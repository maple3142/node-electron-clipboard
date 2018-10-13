const clipinit = require('../src')
const path = require('path')
const fs = require('fs-extra')

const sleep = ms => new Promise(res => setTimeout(res, ms))
const test = async (label, fn, wait = 3000) => {
	console.log(label)
	await fn()
	console.log(`${label} complete`)
	await sleep(wait)
}

const TESTIMG = path.join(__dirname, 'testimg.jpg')

clipinit().then(async clip => {
	await test('writeText', async () => {
		await clip.writeText('hello')
	})
	await test('writeImage:path', async () => {
		await clip.writeImage(TESTIMG)
	})
	await test('writeImage:Buffer', async () => {
		await clip.writeImage(await fs.readFile(TESTIMG))
	})
	clip.close()
})
