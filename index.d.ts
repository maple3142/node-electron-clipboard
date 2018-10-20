type imgType = 'PNG' | 'JPEG'
interface Clipboard {
	writeText(text: string): Promise<boolean>
	writeImage(path: string): Promise<boolean>
	writeImage(img: Buffer): Promise<boolean>
	readText(): Promise<string>
	readImage(type?: imgType): Promise<Buffer> // Use PNG if type is not provided
	clear(type?: string): Promise<boolean>
	close(): void
}
type initClipboard = () => Promise<Clipboard>
declare const init: initClipboard
export = init
