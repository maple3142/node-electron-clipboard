const fs = require('fs-extra')
const path = require('path')
const electron = require('electron')
const { app, clipboard, nativeImage } = electron
const express = require('express')
const bodyParser = require('body-parser')
const server = express()
const tmp = require('tmp-promise')

server.use(bodyParser.json())

process.send = msg => {
	process.stdout.write(JSON.stringify(msg) + '\n')
}

if (typeof electron === 'string') {
	process.send({ action: 'initerr', data: electron })
	process.exit(2)
}

const cleanupfns = new Map()

const handlers = {
	writeText: text => {
		clipboard.writeText(text)
		return true
	},
	writeImage: imgpath => {
		const img = nativeImage.createFromPath(imgpath)
		clipboard.writeImage(img)
		return true
	},
	readText: () => {
		return clipboard.readText()
	},
	readImage: async type => {
		const img = clipboard.readImage()
		const buf = type === 'PNG' ? img.toPNG() : img.toJPEG(100)
		const { path, cleanup } = await tmp.file()
		await fs.writeFile(path, buf)
		cleanupfns.set(path, cleanup)
		return path
	},
	_cleanup: imgpath => {
		// data should be file path
		const cleanup = cleanupfns.get(imgpath)
		if (typeof cleanup === 'function') {
			cleanup()
		}
		cleanupfns.delete(imgpath)
		return true
	},
	clear: type => {
		clipboard.clear(type)
		return true
	}
}

server.post('/', async (req, res) => {
	const { action, data } = req.body
	if (action in handlers) {
		try {
			const result = await handlers[action](data)
			res.json(result)
		} catch (err) {
			res.status(500).json({ action, errorStack: err.stack })
		}
	} else {
		res.status(404).json('Action not found.')
	}
})

setTimeout(() => {
	fs.readFile(path.join(__dirname, '.PORT'), 'utf-8')
		.then(port => {
			port = parseInt(port)
			server.listen(port, 'localhost')
			process.send({ action: 'ready', data: { port } })
		})
		.catch(err => {
			process.send({ action: 'readyfailed', data: err })
		})
}, 3000)

app.on('ready', () => {
	process.send({ action: 'electronready' })
})
