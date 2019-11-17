/* jshint node: true */
'use strict';

const {src, dest} = require('gulp');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require ('autoprefixer');

// Compile sass
function compileSass() {
    return src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest('src/css'));
}

// Export the default Gulp task so it can be run
exports.default = compileSass;
