const path = require('path')
const cp = require('child_process')
const JSONStream = require('JSONStream')
const getport = require('./getport')
const xf = require('xfetch-js')
const fs = require('fs')
const electron = require('electron') // return electron executable path

const helper = path.join(__dirname, './electron.js')
const getCleanEnv = () => {
	const env = Object.assign({}, process.env)
	// work around for vscode
	delete env.ATOM_SHELL_INTERNAL_RUN_AS_NODE
	delete env.ELECTRON_RUN_AS_NODE
	return env
}
const getEp = () =>
	getport().then(port => {
		fs.writeFile(path.join(__dirname, '.PORT'), port, () => {})
		const ep = cp.spawn(electron, [helper], {
			env: getCleanEnv()
		})
		ep.send = msg =>
			xf
				.post(`http://localhost:${port}`, { json: msg })
				.then(() => true)
				.catch(() => false)
		ep.stdout.pipe(JSONStream.parse()).on('data', ({ action, data }) => {
			ep.emit(`data:${action}`, data)
		})
		return new Promise((res, rej) => {
			ep.once('data:ready', () => res(ep))
			ep.once('data:readyfailed', err => rej(err))
		})
	})
module.exports = getEp

if (require.main === module) {
	Error.stackTraceLimit = Infinity
	getEp().then(ep => {
		ep.send({
			action: 'writeText',
			data: 'helloworld'
		}).then(() => console.log('Copy success'))
		ep.stderr.pipe(process.stderr)
	})
}
