const gulp = require('gulp');

//css
const sass = require('gulp-sass');
const minifyCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

//JS
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

//Images
const imagemin = require('gulp-imagemin');

//Utilities
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync')
const server = browserSync.create();

//Styles
gulp.task('style', () => {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputSytle: 'compressed '}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({
            message: "Task: style complited",
            onLast: true
        }))
});

//Style:bulid
gulp.task('style:build', () => {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(plumber())
        .pipe(sass({ outputSytle: 'compressed '}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({
            message: "Task: style:build complited",
            onLast: true
        }))
});

//Scripts (vendor)
gulp.task('vendorJS', () => {
    return gulp
        .src('./src/js/vendor/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('vendor.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({
            message: "Task: vendorJS complited",
            onLast: true
        }))
});

//Scripts (vendor):bulid
gulp.task('vendorJS:build', () => {
    return gulp
        .src('./src/js/vendor/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({
            message: "Task: vendorJS:build complited",
            onLast: true
        }))
});
//Scripts (custom)
gulp.task('customJS', () => {
    return gulp
        .src('./src/js/custom/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('custom.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({
            message: "Task: customJS complited",
            onLast: true
        }))
});

//Scripts (custom):bulid
gulp.task('customJS:build', () => {
    return gulp
        .src('./src/js/custom/*.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat('custom.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({
            message: "Task: customJS:build complited",
            onLast: true
        }))
});

//Images
gulp.task('images', () => {
    return gulp
        .src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
        .pipe(notify({
            message: "Task: images complited",
            onLast: true
        }))
});


//Fonts
gulp.task('fonts', () => {
    return gulp
        .src('./src/fonts/**.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(notify({
            message: "Task: fonts complited",
            onLast: true
        }))
});

//Clean
gulp.task('clean', () => {
    return del(['./dist/**', '!./dist'])
});

//BrowserSync
function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: './'
        }
    })
}
//Watch
gulp.task('default', gulp.series('clean', gulp.parallel(
    'style',
    'vendorJS',
    'customJS',
    'images',
    'fonts',
    serve,
    function watchFile() {
        //Scss
        gulp.watch('./src/scss/*.scss', gulp.series('style', reload));

        //JS
        gulp.watch('./src/js/vendor/*.js', gulp.series('vendorJS', reload));
        gulp.watch('./src/js/custom/*.js', gulp.series('customJS', reload));

        //Images
        gulp.watch('./src/img/*', gulp.series('images', reload));
    }
)));
//Build
gulp.task('build', gulp.series('clean', gulp.parallel(
    'style:build',
    'vendorJS:build',
    'customJS:build',
    'images',
    'fonts'
)))