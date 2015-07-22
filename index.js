var gulpmatch = require('gulp-match');
var through   = require('through');
var gutil     = require('gulp-util');

module.exports = function() {
    return through(function (file) {
        var regex = /\$(.*?):(.*?);/g;
        var variables = {};
        var stringifiedContent;
        var jsonVariables;
        var filename;
        var m;

        // if it does not have a .scss suffix, ignore the file
        if (!gulpmatch(file,'**/*.scss')) {
            this.push(file);
            return;
        }

        // load the JSON
        stringifiedContent = String(file.contents);

        while ((m = regex.exec(stringifiedContent)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            variables[m[1].trim()] = m[2].trim();
        }

        jsonVariables = JSON.stringify(variables, null, '\t');
        file.contents = Buffer(jsonVariables);
        filename = file.path.split('/').pop();
        file.path = file.path.replace(filename, filename.replace(/^_/, ''));
        file.path = gutil.replaceExtension(file.path, '.json');

        this.push(file);
    });
};
