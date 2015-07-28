'use strict';

var assert = require('assert');
var fs     = require('fs');
var File   = require('vinyl');

var sassJson = require('../');

var expectedJson = {
    'foo-bar': '4px',
    'bar-foo': '50px'
};

describe('gulp-sass-json', function() {
    var output;
    var fakeFile;

    beforeEach(function () {
        output = sassJson();

        fakeFile = new File({
            path: 'test/fixtures/_breakpoints.scss',
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.readFileSync('test/fixtures/_breakpoints.scss')
        });
    });

    afterEach(function () {
        output.end();
    });

    it('should parse the filename', function(done) {
        // events should be bind before .write() function is called
        output.on('data', function (file) {
            console.log(file.path);
            assert.equal(file.path, 'test/fixtures/breakpoints.json');
            done();
        });

        output.write(fakeFile);
    });

    it('should parse file content to json', function(done) {
        // events should be bind before .write() function is called
        output.on('data', function (file) {
            var json = JSON.parse(file.contents.toString('utf8'));
            assert.deepEqual(json, expectedJson);
            done();
        });

        output.write(fakeFile);
    });
});
