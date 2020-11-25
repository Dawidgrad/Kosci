const express = require('express');
const http = require('http');
const url = require('url');
const fs = require('fs');

const port = process.env.PORT || 9000;

const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
	const urlParts = url.parse(req.url, true);

	const permittedFiles = /(.html|.js)/gi;

	if (urlParts.path.search(permittedFiles) !== -1) {
		fs.readFile(__dirname + urlParts.path, (err, file) => {
			if (urlParts.path.indexOf('.html')) {
				res.writeHead(200, { 'Content-Type': 'text/html' });
			} else {
				res.writeHead(200, { 'Content-Type': 'text/javascript' });
			}

			res.end(file);
		});
	} else {
		res.writeHead(404);
		res.end();
	}
});

server.listen(port, () => {
	console.log(`Server listening on ${port}`);
});
