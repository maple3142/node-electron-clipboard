const fs = require('fs')
const path = require('path')
const electron = require('electron')
const { app, clipboard, nativeImage } = electron
const express = require('express')
const bodyParser = require('body-parser')
const server = express()

server.use(bodyParser.json())

process.send = msg => {
	process.stdout.write(JSON.stringify(msg) + '\n')
}

if (typeof electron === 'string') {
	process.send({ action: 'initerr', data: electron })
	process.exit(2)
}

server.post('/', (req, res) => {
	const { action, data } = req.body
	switch (action) {
		case 'writeText':
			clipboard.writeText(data)
			res.json({ message: 'Success' })
			break
		case 'writeImage':
			const img = nativeImage.createFromPath(data)
			clipboard.writeImage(img)
			res.json({ message: 'Success' })
			break
		default:
			res.json({ error: 'Unknown action' })
			break
	}
})

setTimeout(() => {
	fs.readFile(path.join(__dirname, '.PORT'), 'utf-8', (err, port) => {
		if (err) {
			process.send({ action: 'readyfailed', data: err })
			return
		}
		port = parseInt(port)
		server.listen(port)
		process.send({ action: 'ready', data: { port } })
	})
}, 3000)

app.on('ready', function() {
	process.send({ action: 'electronready' })
})
