var gulp        = require("gulp"),
    gulpif      = require('gulp-if'),
    sass        = require('gulp-sass')(require('sass')),
    sourcemaps  = require('gulp-sourcemaps')
    browserSync = require('browser-sync'),
    fileinclude = require('gulp-file-include'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs');


var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task('html', function(calback) {
    gulp.src(['./app/index.html', './app/post.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './app/_include'
        }))
        .pipe(gulp.dest('./build'));
    calback()
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        port: 3000,
        notify: false,
        open: false
    });
 
});

gulp.task('sass', function () {
    return gulp.src('./app/_sass/main.scss')
        .pipe(gulpif(isDevelopment, sourcemaps.init()))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulpif(isDevelopment ,sourcemaps.write()))
        .pipe(gulp.dest('./build/assets/css'))
        .pipe(browserSync.reload({stream:true}));
  
});

gulp.task("can__min--js", function () {
    return gulp.src( ['!./app/assets/js/donate.js' ,'./app/assets/**/*.js']  )
        .pipe(concat('libs-min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/assets/js'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task("js", function () {
    return gulp.src( './app/assets/js/*.js' )
        .pipe(gulp.dest('./build/assets/js'))
});

gulp.task("assets", function(){
    return gulp.src(["!./app/assets/**/*.js" ,"./app/assets/**"])
        .pipe(gulp.dest("./build/assets"))
});


gulp.task('watch', function () {
    gulp.watch(['app/_include/*.*',"./app/index.html","./app/post.html"]).on('change', gulp.series('html', browserSync.reload));
    gulp.watch('app/_sass/**/*.scss').on('change', gulp.series('sass', browserSync.reload));
    gulp.watch('./app/assets/**/*.*').on('change', gulp.series('assets', browserSync.reload));
});


gulp.task('default', gulp.series( function (done) {
     gulp.series ('js', 'html' ,'sass' ,'assets', 'can__min--js');
    done();
    },

    gulp.parallel('watch', 'browser-sync')

    ));
