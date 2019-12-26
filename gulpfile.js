const autoprefixer = require('gulp-autoprefixer');
const beeper = require('beeper');
const browserSync = require('browser-sync');
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');
const gconcat = require('gulp-concat');
const gulp = require('gulp');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
// npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-pug gulp-imagemin gulp-cache gulp-clean-css gulp-sourcemaps gulp-concat beeper gulp-util gulp-rename gulp-notify --save-dev
const jsVendorFiles = []; // Holds the js vendor files to be concatenated
const myJsFiles = ['src/js/*.js']; // Holds the js files to be concatenated
const fs = require('fs');

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

function findKeyText(data, txt) {
        for (let i = 0; i < data.length; i++) {
                if (data[i].indexOf(txt) > -1) {
                        return true;
                }
        }
        return false;
}
gulp.task('styles', async function() {
        gulp.src('src/styles/*.scss')
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
                .pipe(
                        autoprefixer({
                                cascade: false,
                        })
                )
                .pipe(cleanCSS())
                .pipe(sourcemaps.write())
                .pipe(
                        rename({
                                suffix: '.min',
                        })
                )
                .pipe(gulp.dest('dist/css'));
});
gulp.task('templates', async function() {
        gulp.src('src/*.pug')
                .pipe(
                        plumber({
                                errorHandler: onError,
                        })
                )
                .pipe(pug())
                .pipe(gulp.dest('dist/'));
});
gulp.task('scripts', async function() {
        return gulp
                .src(myJsFiles.concat(jsVendorFiles))
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
                .pipe(gulp.dest('dist/js'));
});
gulp.task('images', async function() {
        gulp.src('src/img/**/*')
                .pipe(
                        cache(
                                imagemin({
                                        optimizationLevel: 3,
                                        progressive: true,
                                        interlaced: true,
                                })
                        )
                )
                .pipe(gulp.dest('dist/img/'));
});
// gulp.task('setup-src', async function() {
//         const data = fs
//                 .readFileSync('src/index.pug')
//                 .toString()
//                 .split('\n');
//         if (data[data.length - 1] === '') {
//                 data.pop();
//         }
//         if (data[data.length - 1].indexOf('script(src="js/bundle.min.js")') > -1) {
//                 data.pop();
//         }
//         if (!findKeyText(data, 'bundle.min.js')) {
//                 data.splice(data.length, 0, '    script(src="js/bundle.min.js")');
//         }
//         const text = data.join('\n');
//         fs.writeFile('dist/index.pug', text, function(err) {
//                 if (err) throw err;
//         });
// });
gulp.task('default', async function() {
        console.log("Use 'gulp setup' command to initialize the project files");
});
gulp.task('setup', gulp.series('styles', 'templates', 'scripts', 'images'));
gulp.task('watch', function() {
        gulp.watch('styles/**/*', gulp.series('styles'));
        gulp.watch(['templates/**/*', './*.pug'], gulp.series('templates'));
        gulp.watch('js/*.js', gulp.series('scripts'));
        gulp.watch('img/**/*', gulp.series('images'));
        // init server
        browserSync.init({
                server: {
                        baseDir: 'dist/',
                        index: '/index.html',
                },
        });
        gulp.watch(['dist/**'], browserSync.reload);
});
