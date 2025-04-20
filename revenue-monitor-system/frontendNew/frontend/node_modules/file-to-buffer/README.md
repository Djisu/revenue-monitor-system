<!--
 Copyright (c) 2023 Anthony Mugendi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# file-to-buffer

This module takes a variety of values such as a file, url or string and returns a buffer. That simple.

## How to use

```javascript
const path = require('path');
let fileToBuffer = require('.');

!(async () => {
	let file = path.resolve('./.gitignore');
	let url =
		'https://github.com/mugendi/file-to-buffer/raw/master/.gitignore';

	// buffer from file on disk
	let fileBuffer = await fileToBuffer(file);
	let urlBuffer = await fileToBuffer(file);
    let strBuffer = await fileToBuffer('node_modules');

	console.log({ fileBuffer, size: fileBuffer.byteLength });
	console.log({ urlBuffer, size: urlBuffer.byteLength });
    console.log({ strBuffer, size: strBuffer.byteLength });
})();

```

Because we have loaded the same `.gitignore` file, and same file content, the logs should be something like below;

```text
{ fileBuffer: <Buffer 6e 6f 64 65 5f 6d 6f 64 75 6c 65 73>, size: 12 }
{ urlBuffer: <Buffer 6e 6f 64 65 5f 6d 6f 64 75 6c 65 73>, size: 12 }
{ strBuffer: <Buffer 6e 6f 64 65 5f 6d 6f 64 75 6c 65 73>, size: 12 }
```
