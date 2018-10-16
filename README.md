# node-clipboardwriter

> Use electron's clipboard api under the hood to bring cross platform `writeText` and `writeImage` to node.js

## API

```ts
type imgType = 'PNG' | 'JPEG'
interface ClipboardWriter {
  writeText(text: string): Promise<boolean>
  writeImage(path: string): Promise<boolean>
  writeImage(img: Buffer): Promise<boolean>
  readText(): Promise<string>
  readImage(): Promise<Buffer> // PNG by default
  readImage(type: imgType): Promise<Buffer>
  close(): void
}
type initClipboardWriter = () => Promise<ClipboardWriter>
declare const init: initClipboardWriter
export = init
```
