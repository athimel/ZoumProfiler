/*!
 * gulp
 * $ npm install gulp-bower gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache gulp-clean --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    clean = require('gulp-clean'),
    bower = require('gulp-bower'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
//jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');


var bases = {
    src  : 'src/',
    deps : 'bower_components/',
    dist : 'dist/',
    fonts : 'dist/fonts/'
};

var paths = {
    html    : ['**/*.html'],
    scripts : ['**/*.js'],
    styles  : ['**/*.css'],
    images  : ['**/*.png'],
    fonts   : ['common/fonts/*'],
    libs    : ['angular/angular.min.js', 'angular-sanitize/angular-sanitize.min.js',
        'angular-ui-bootstrap-bower/ui-bootstrap.min.js', 'angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
        'bootstrap/dist/js/bootstrap.min.js', 'jquery/dist/jquery.min.js', 'underscore/underscore.js']
};

// Clean
gulp.task('clean', function() {
    return gulp.src(bases.dist)
        .pipe(clean());
});

// Dependencies
gulp.task('deps', function() {
    return bower();
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(paths.scripts, {cwd: bases.src})
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('zoumProfiler.js'))
        .pipe(rename({dirname: 'scripts'}))
        .pipe(gulp.dest(bases.dist))
        .pipe(rename({ suffix : '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(bases.dist));
//        .pipe(notify({ message : 'Scripts task complete' }));
});

// Styles
gulp.task('styles', function() {
    return gulp.src(paths.styles, {cwd: bases.src})
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('zoumProfiler.css'))
        .pipe(rename({dirname: 'styles'}))
        .pipe(gulp.dest(bases.dist))
        .pipe(rename({ suffix : '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(bases.dist));
//        .pipe(notify({ message : 'Styles task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src(paths.images, {cwd: bases.src})
        .pipe(cache(imagemin({ optimizationLevel : 3, progressive : true, interlaced : true })))
        .pipe(rename({dirname: 'images'}))
        .pipe(gulp.dest(bases.dist));
//        .pipe(notify({ message : 'Images task complete' }));
});

// Other resources
gulp.task('resources', function() {
    // Copy html
    gulp.src(paths.html, {cwd: bases.src})
        .pipe(gulp.dest(bases.dist));

    // Copy lib scripts, maintaining the original directory structure
    gulp.src(paths.libs, {cwd: bases.deps})
        .pipe(rename({dirname: 'libs'}))
        .pipe(gulp.dest(bases.dist));

    // Copy everything from fonts
    gulp.src(paths.fonts, {cwd: bases.src})
        .pipe(gulp.dest(bases.fonts));
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'styles', 'images', 'resources');
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('src/**/*.css', ['styles']);

    // Watch .js files
    gulp.watch('src/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/**/*.png', ['images']);

    // Watch index.html
    gulp.watch('src/index.html', ['resources']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});