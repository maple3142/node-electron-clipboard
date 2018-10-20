const clipinit = require('../src')
const path = require('path')
const fs = require('fs-extra')
const assert = require('assert')

const sleep = ms => new Promise(res => setTimeout(res, ms))
const test = async (label, fn, wait = 3000) => {
	console.log(label)
	await fn()
	console.log(`${label} complete`)
	await sleep(wait)
}

const TESTIMG = path.join(__dirname, 'testimg.jpg')
const TMPJPEG = path.join(__dirname, '.tmp.jpg')
const TMPPNG = path.join(__dirname, '.tmp.png')

clipinit().then(async clip => {
	await test('writeText', async () => {
		await clip.writeText('hello')
	})
	await test('readText', async () => {
		assert.equal(await clip.readText(), 'hello')
	})
	await test('writeImage:path', async () => {
		await clip.writeImage(TESTIMG)
	})
	await test('writeImage:Buffer', async () => {
		await clip.writeImage(await fs.readFile(TESTIMG))
	})
	await test('readImage:JPEG', async () => {
		const clbuf = await clip.readImage('JPEG')
		await fs.writeFile(TMPJPEG, clbuf)
		// check for yourself
	})
	await test('readImage:PNG', async () => {
		const clbuf = await clip.readImage() // implict pass 'PNG'
		await fs.writeFile(TMPPNG, clbuf)
		// check for yourself
	})
	await test('clear',async ()=>{
		await clip.clear()
	})
	clip.close()
})
process.on('unhandledRejection', e => {
	console.error(e)
})
