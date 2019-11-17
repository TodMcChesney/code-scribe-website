/* jshint node: true */
'use strict';

const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require ('autoprefixer');
const browserSync = require('browser-sync').create();

// Compile Sass
function compileSass() {
    return src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest('src/css'));
}

// Start Browsersync server
function startServer(done) {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        browser: 'chrome'
    });
    done();
}

// Reload web page
function reload(done) {
    browserSync.reload();
    done();
}

// Watch for file changes and fire reload
function watchChanges(done) {
    watch('src/scss/**/*.scss', series(compileSass, reload));
    watch(['src/*.html', 'src/js/*.js', 'src/img/*.+(png|jpg)'], reload);
    done();
}

// Export the default Gulp task and assign dev tasks to be run in series
exports.default = series(compileSass, startServer, watchChanges);
