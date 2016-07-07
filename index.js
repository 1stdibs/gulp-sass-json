var gulpmatch = require('gulp-match');
var through   = require('through');
var gutil     = require('gulp-util');

module.exports = function() {
    return through(function (file) {
        var regex = /\$(.*?):([\s\S]*?);/g;
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
            // test for sass maps
            if (m[2].indexOf(':') > -1 &&
                m[2].indexOf('(') > -1 &&
                m[2].indexOf(')') > -1 &&
                m[2].indexOf(',') > -1) {
                    // Split of the SASS map property
                    var sassMapRule = m[2].split(',');
                    // Empty object that will be the JSON property
                    var outputObj = {};

                    for (var prop in sassMapRule) {
                        var sassMapRuleObj = sassMapRule[prop].split(':');

                        // ignore sass map property it it is null or undefined
                        if (!sassMapRuleObj[0] || !sassMapRuleObj[1]) {
                            continue;
                        }

                        // time newlines, whitespaces, and parentheses
                        var sassMapKey = sassMapRuleObj[0].replace(/[\(\n]/, '').trim(); 
                        var sassMapVal = sassMapRuleObj[1].trim();

                        outputObj[sassMapKey] = sassMapVal;
                }
                variables[m[1].trim()] = outputObj;
            // non sass maps rules
            } else {
                variables[m[1].trim()] = m[2].trim();
            }
        }

        jsonVariables = JSON.stringify(variables, null, '\t');
        file.contents = Buffer(jsonVariables);
        filename = file.path.split('/').pop();
        file.path = file.path.replace(filename, filename.replace(/^_/, ''));
        file.path = gutil.replaceExtension(file.path, '.json');

        this.push(file);
    });
};
