# gulp-sass-json
Gulp plugin for turning SASS variable definitions files into JSON files.

## Installation ##
```
npm install --save-dave gulp-sass-json
```

## Example ##
In this example gulpfile, a SASS variable file is turned into a JSON file.

```javascript
var sassJson = require('gulp-sass-json');
var gulp = require('gulp');

gulp.task('sass-json', function () {
    return gulp
        .src('./**/*.scss')
        .pipe(sassJson())
        .pipe(gulp.dest('./cssVars'));
});
```
