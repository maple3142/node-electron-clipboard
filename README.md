# node-electron-clipboard

> Use electron's clipboard api under the hood to bring cross platform `writeText` and `writeImage` to node.js

## API

```ts
type imgType = 'PNG' | 'JPEG'
interface Clipboard {
  writeText(text: string): Promise<boolean>
  writeImage(path: string): Promise<boolean>
  writeImage(img: Buffer): Promise<boolean>
  readText(): Promise<string>
  readImage(): Promise<Buffer> // PNG by default
  readImage(type: imgType): Promise<Buffer>
  close(): void
}
type initClipboard = () => Promise<Clipboard>
declare const init: initClipboard
export = init
```
