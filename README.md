# node-clipboardwriter

> Use electron's clipboard api under the hood to bring cross platform `writeText` and `writeImage` to node.js

## API

```ts
interface ClipboardWriter {
  writeText(text: string): Promise<boolean>
  writeImage(path: string): Promise<boolean>
  writeImage(img: Buffer): Promise<boolean>
  close(): void
}
type initClipboardWriter = () => Promise<ClipboardWriter>
declare const init: initClipboardWriter
export = init
```
