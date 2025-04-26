/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

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
