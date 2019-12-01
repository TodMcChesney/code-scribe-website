/* jshint node: true */
'use strict';

const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require ('autoprefixer');
const browserSync = require('browser-sync').create();
const rm = require('gulp-rm');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const htmlreplace = require('gulp-html-replace');
const htmlmin = require('gulp-htmlmin');


// Running dev tasks from the CLI:
// $ gulp (Runs all dev tasks in sequence and watches for changes)

// Compile Sass
function compileSass() {
    return src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentWidth: 4,
            linefeed: 'crlf'
        }).on('error', sass.logError))
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
    watch(['src/*.html', 'src/js/*.js', 'src/img/**.*'], reload);
    done();
}

// Export the default Gulp task and assign dev tasks to be run in series
exports.default = series(compileSass, startServer, watchChanges);


// Run build task from the CLI:
// $ gulp build (Runs all production tasks in sequence to build dist folder)

// Clean the Dist folder
function cleanDist() {
    return src('dist/**/*', {
        read: false
    })
    .pipe(rm());
}

// Run JS through Babel and minify
function minifyJS(done) {
    src('src/js/scripts.js')
    .pipe(babel({
        sourceType: 'script',
        presets: ['@babel/env']
    }))
    .pipe(minify({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(rename({
            suffix: '.min'
        }))
    .pipe(dest('dist/js'));
    done();
}

// Minify Wufoo CSS
function minifyWufooCSS(done) {
    src('src/css/wufoo-custom.css')
    .pipe(postcss([cssnano()]))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(dest('dist/css'));
    done();
}

// Minify HTML
function minifyHTML(done) {
    src('src/*.html')
    .pipe(htmlreplace({
        cssInline: {
            src: src(['src/css/normalize.css', 'src/css/styles.css']),
            tpl: '<style>%s</style>'
        },
        js: 'js/scripts.min.js',
        absolutejs: 'https://codescribe.net/js/scripts.min.js'
    }))
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
    }))
    .pipe(dest('dist'));
    done();
}

// Copy all remaining files to Dist folder
function copy(done) {
    src(['src/img/**/*.*', 'src/*.!(html)'], {
        base: 'src'
    })
    .pipe(dest('dist'));
    done();
}

// Export the build task and assign tasks to be run in the correct sequence
exports.build = series(cleanDist, parallel(minifyJS, minifyWufooCSS, minifyHTML, copy));
