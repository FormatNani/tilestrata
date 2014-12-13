var TileServer = require('../lib/TileServer.js');
var TileRequest = require('../lib/TileRequest.js');
var filesystem = require('../stack/cache/filesystem.js');
var assert = require('chai').assert;
var path = require('path');
var fs = require('fs');

describe('Cache Implementation "filesystem"', function() {
	describe('init', function() {
		it('should create parent folder', function(done) {
			var server = new TileServer();
			var dir = path.resolve(__dirname, './.tmp/fs' + String(Math.random()).substring(2)) + '/folder';
			var cache = filesystem({dir: dir});
			cache.init(server, function(err) {
				assert.isFalse(!!err);
				assert.isTrue(fs.existsSync(dir));
				done();
			});
		});
	});
	describe('set', function() {
		it('should store file', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/3/1/2/tile@2x.png');
			var dir = path.resolve(__dirname, './.tmp/fs' + String(Math.random()).substring(2)) + '/folder';
			var cache = filesystem({dir: dir});
			cache.init(server, function(err) {
				assert.isFalse(!!err);
				cache.set(server, req, new Buffer('contents', 'utf8'), {}, function(err) {
					assert.isFalse(!!err);
					assert.equal(fs.readFileSync(dir + '/3/1/2/tile@2x.png', 'utf8'), 'contents');
					done();
				});
			});
		});
	});
	describe('get', function() {
		it('should retrieve file', function(done) {
			var server = new TileServer();
			var req = TileRequest.parse('/layer/3/2/1/tile.txt');
			var dir = __dirname + '/fixtures/filesystem-test';
			var cache = filesystem({dir: dir});
			cache.init(server, function(err) {
				assert.isFalse(!!err);
				cache.get(server, req, function(err, buffer, headers) {
					assert.isFalse(!!err);
					assert.instanceOf(buffer, Buffer);
					assert.equal(buffer.toString('utf8'), 'Hello World');
					assert.deepEqual(headers, {
						'Content-Type': 'text/plain',
						'Content-Length': 11
					});
					done();
				});
			});
		});
	});
});