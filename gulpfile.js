const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const beeper = require('beeper');
const browserSync = require('browser-sync').create();
const cache = require('gulp-cache');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const gconcat = require('gulp-concat');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');

const jsVendorFiles = []; // Holds the js vendor files to be concatenated

// File paths
const files = {
        pugPath: 'src/**/*.pug',
        scssPath: 'src/styles/*.scss',
        jsPath: 'src/js/**/*.js',
        imgPath: 'src/img/**/*',
};

const onError = function(err) {
        // Custom error msg with beep sound and text color
        notify.onError({
                title: `Gulp error in ${err.plugin}`,
                message: err.toString(),
        })(err);
        beeper(3);
        this.emit('end');
        gutil.log(gutil.colors.red(err));
};
function scssTask() {
        return src(files.scssPath)
                .pipe(
                        plumber({
                                errorHandler: onError,
                        })
                )
                .pipe(sourcemaps.init())
                .pipe(
                        sass({
                                indentedSyntax: false,
                        })
                )
                .pipe(postcss([autoprefixer(), cssnano()]))
                .pipe(sourcemaps.write())
                .pipe(
                        rename({
                                suffix: '.min',
                        })
                )
                .pipe(dest('dist/css'))
                .pipe(browserSync.stream());
}
const cbString = new Date().getTime();
function pugTask() {
        return src(files.pugPath)
                .pipe(
                        plumber({
                                errorHandler: onError,
                        })
                )
                .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
                .pipe(pug())
                .pipe(dest('dist/'))
                .pipe(browserSync.stream());
}
function JSTask() {
        return src(files.jsPath.concat(jsVendorFiles))
                .pipe(
                        plumber({
                                errorHandler: onError,
                        })
                )
                .pipe(sourcemaps.init())
                .pipe(gconcat('bundle.js'))
                .pipe(babel())
                .pipe(uglify())
                .pipe(sourcemaps.write())
                .pipe(
                        rename({
                                suffix: '.min',
                        })
                )
                .pipe(dest('dist/js'));
}
function imgTask() {
        return src(files.imgPath)
                .pipe(
                        cache(
                                imagemin({
                                        optimizationLevel: 3,
                                        progressive: true,
                                        interlaced: true,
                                })
                        )
                )
                .pipe(dest('dist/img/'));
}
async function defaultTask() {
        console.log("Use 'gulp watch' command to initialize the project files");
}

function watchTask() {
        // init server
        browserSync.init({
                server: {
                        baseDir: 'dist/',
                        index: '/index.html',
                        // reloadDelay: 1000,
                },
        });
        watch(files.scssPath, series(scssTask));
        watch(files.jsPath, series(JSTask));
        watch(files.pugPath, series(pugTask));
        watch(files.imgPath, series(imgTask));
        watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js']).on('change', browserSync.reload);
}

exports.watch = series(parallel(scssTask, JSTask, imgTask), pugTask, watchTask);
exports.build = series(parallel(imgTask, scssTask, JSTask), pugTask);
exports.default = defaultTask;
