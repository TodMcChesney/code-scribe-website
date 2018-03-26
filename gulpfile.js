/* jshint node: true */
'use strict';

const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const rm = require('gulp-rm');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const processhtml = require('gulp-processhtml');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const babili = require('gulp-babili');

// Running dev tasks from the CLI:
// $ gulp (Runs all dev tasks in sequence and watches for changes)

// compile:sass
gulp.task('compile:sass', () =>
    sass('src/scss/**/*.scss', {
        sourcemap: true
    })
    .on('error', sass.logError)
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('maps', {
        includeContent: false,
        sourceRoot: 'source'
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
);

// browserSync
gulp.task('browserSync', () =>
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        browser: 'chrome'
    })
);

// Default gulp task runs all dev tasks and watches for changes
gulp.task('default', ['browserSync', 'compile:sass'], () => {
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/scss/**/*.scss', ['compile:sass']);
    gulp.watch('src/js/*.js', browserSync.reload);
    gulp.watch('src/img/*.+(png|jpg|svg)', browserSync.reload);
});

// Run build task from the CLI:
// $ gulp build (Runs all production tasks in sequence to build dist folder)

// clean:dist
gulp.task('clean:dist', () =>
    gulp.src('dist/**/*', {
        read: false
    })
    .pipe(rm())
);

// minify:js
gulp.task('minify:js', ['clean:dist'], () =>
    gulp.src('src/js/scripts.js')
    .pipe(babel({
        presets: ['es2015-nostrict']
    }))
    .pipe(concat('scripts.js'))
    .pipe(babili({
        mangle: {
            keepClassName: true
        }
    }))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
);

// minify:css
gulp.task('minify:css', ['clean:dist'], () =>
    gulp.src(['src/css/normalize.css', 'src/css/styles.css'])
    .pipe(concat('styles.css'))
    .pipe(cssnano())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
);

// minify:html
gulp.task('minify:html', ['clean:dist'], () =>
    gulp.src('src/*.html')
    .pipe(processhtml())
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(gulp.dest('dist'))
);

// copy
gulp.task('copy', ['clean:dist'], () =>
    gulp.src(['src/img/**/*.+(png|jpg|svg)', 'src/*.!(html)'], {
        base: 'src'
    })
    .pipe(gulp.dest('dist'))
);

// build
gulp.task('build', ['clean:dist', 'minify:js', 'minify:css', 'minify:html', 'copy']);
