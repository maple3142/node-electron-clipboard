const getEp = require('./ep')
const fs = require('fs-extra')
const tmp = require('tmp-promise')

class ClipboardWriter {
	constructor(ep) {
		this.ep = ep
	}
	writeText(text) {
		if (this.ep === null) throw new Error('ClipboardWriter has been closed.')
		if (typeof text !== 'string') throw new TypeError('Text must exists.')
		return this.ep.send({
			action: 'writeText',
			data: text
		})
	}
	async writeImage(img) {
		if (this.ep === null) throw new Error('ClipboardWriter has been closed.')
		let outercleanup
		if (img instanceof Buffer) {
			const { path, cleanup } = await tmp.file()
			await fs.writeFile(path, img)
			img = path
			outercleanup = cleanup
		}
		if (typeof img !== 'string') throw new TypeError('Img must be either Buffer or string.')
		return this.ep
			.send({
				action: 'writeImage',
				data: img
			})
			.then(r => {
				if (typeof outercleanup === 'function') outercleanup()
				return r
			})
	}
	close() {
		this.ep.kill('SIGINT')
		this.ep = null
	}
}

module.exports = () => getEp().then(ep => new ClipboardWriter(ep))
