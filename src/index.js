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
		return this.ep
			.send({
				action: 'writeText',
				data: text
			})
			.then(() => true)
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
			.then(() => {
				if (typeof outercleanup === 'function') outercleanup()
				return true
			})
	}
	readText() {
		return this.ep.send({
			action: 'readText'
		})
	}
	readImage(type = 'PNG') {
		if (type !== 'PNG' && type !== 'JPEG') {
			throw new TypeError('Invalid image type.')
		}
		return this.ep
			.send({
				action: 'readImage',
				data: type
			})
			.then(async imgpath => {
				const buf = await fs.readFile(imgpath)
				await this.ep.send({
					action: '_cleanup',
					data: imgpath
				})
				return buf
			})
	}
	close() {
		this.ep.kill('SIGINT')
		this.ep = null
	}
}

module.exports = () => getEp().then(ep => new ClipboardWriter(ep))
