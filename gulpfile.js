
var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    nodemon = require('gulp-nodemon'),
    webserver = require('gulp-webserver');
    watchLess = require('gulp-watch-less');
    less = require('gulp-less');

/* javascripts need to be converted from 6 to 5 and minified */
gulp.task('js', function () {

    return gulp.src(['app/js/**/*.js'])
        .pipe(babel())
        .pipe(uglify())
        .pipe(replace('bower_components', 'lib'))
        .pipe(gulp.dest('public/js'));
});

/* javascripts need to be converted from 6 to 5 and minified */
gulp.task('jsiis', function () {

    return gulp.src(['app/js/**/*.js'])
        .pipe(babel())
        .pipe(replace('bower_components', 'lib'))
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/js'));

});


/* javascripts need to be converted from 6 to 5 and minified */
gulp.task('jsbuild', function () {

    return gulp.src(['app/js/**/*.js'])
        .pipe(babel())
        .pipe(replace('bower_components', 'lib'))
        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/js'));

});

gulp.task('less', function () {
    return gulp.src('app/less/styles.less')
        .pipe(watchLess('app/less/styles.less'))
        .pipe(less())
        .pipe(gulp.dest('app/css'));
});

gulp.task('lessnowatch', function () {
    return gulp.src('app/less/styles.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'));
});

/* copy all static assets into the build */
gulp.task('static', function () {
    gulp.src('app/*.html')
        .pipe(replace('bower_components', 'lib'))
        .pipe(gulp.dest('public'));

    gulp.src('app/bower_components/**')
        .pipe(gulp.dest('public/lib'))

    gulp.src('app/lib/**')
        .pipe(gulp.dest('public/lib'))

    gulp.src('app/img/**')
        .pipe(gulp.dest('public/img'));

    gulp.src('app/css/**')
        .pipe(gulp.dest('public/css'));

    gulp.src('app/pages/**')
        .pipe(gulp.dest('public/pages'));

    gulp.src('app/partials/**')
        .pipe(gulp.dest('public/partials'));
});


/* copy all static assets into the build */
gulp.task('staticiis', function () {
    gulp.src('app/*.html')
         .pipe(replace('bower_components', 'lib'))
         .pipe(gulp.dest('../../wealthhub/wealthhub.web'));

    gulp.src('app/bower_components/**')
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/lib'))

    gulp.src('app/lib/**')
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/lib'))

    gulp.src('app/img/**')
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/img'));

    gulp.src('app/css/**')
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/css'));

    gulp.src('app/pages/**')
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/pages'));

    gulp.src('app/partials/**')
        .pipe(gulp.dest('../../wealthhub/wealthhub.web/partials'));
});


/* copy all static assets into the build */
//gulp.task('staticbuild', function () {
//    gulp.src('app/*.html')
//        .pipe(replace('bower_components', 'lib'))
//        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web'));

//    gulp.src('app/bower_components/**')
//        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/lib'))

//    gulp.src('app/img/**')
//        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/img'));

//    gulp.src('app/css/**')
//        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/css'));

//    gulp.src('app/pages/**')
//        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/pages'));

//    gulp.src('app/partials/**')
//        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/partials'));
//});



gulp.task('serve', function () {
    gulp.src('public')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 3000,
            fallback: 'index.html',
            livereload: true,
            open: true
        }));

});

gulp.task('server', function(){
    gulp.src('app')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 3000,
            fallback: 'index.html',
            livereload: true,
            open: true
        }));

})

gulp.task('winserve', function () {

    gulp.src('public')
        .pipe(webserver({
            host: '127.0.0.1',
            port: 3000,
            fallback: 'index.html',
            livereload: true,
            open: true
        }));

});


gulp.task('watch', function () {
    gulp.watch('app/*.html', [ 'static' ]);
    gulp.watch('app/bower_components/**', [ 'static' ]);
    gulp.watch('app/lib/**', [ 'static' ]);
    gulp.watch('app/img/**', [ 'static' ]);
    gulp.watch('app/css/**', [ 'static' ]);
    gulp.watch('app/pages/**', ['static']);
    gulp.watch('app/partials/**', ['static']);
    gulp.watch('app/less/**', ['less']);
    gulp.watch('app/js/**/*.js', ['js']);
});

//use NoServe inside VS/TFS builds so that the web server is not started
gulp.task('default', ['js', 'less', 'static', 'watch', 'serve']); // starts web server using linux loopback address
gulp.task('defaultwin', ['js', 'less', 'static', 'watch', 'winserve']); //starts web server using windows loopback address
gulp.task('build',['buildsequential']); // ['jsbuild', 'lessnowatch', 'static']); //clean task for the build server that doesn't stay resident
gulp.task('iis', ['jsiis', 'lessnowatch', 'staticiis']); //clean task for iis hosting that doesn't stay resident

gulp.task('buildsequential', function () {

    gulp.src(['app/js/**/*.js'])
        .pipe(babel())
        .pipe(replace('bower_components', 'lib'))
        .pipe(gulp.dest('../../../../bin/_PublishedWebsites/WealthHub.Web/js'));

    gulp.src('app/less/styles.less')
        .pipe(less())
        .pipe(gulp.dest('app/css'));


    gulp.src('app/*.html')
        .pipe(replace('bower_components', 'lib'))
        .pipe(gulp.dest('public'));

    gulp.src('app/bower_components/**')
        .pipe(gulp.dest('public/lib'))

    gulp.src('app/img/**')
        .pipe(gulp.dest('public/img'));

    gulp.src('app/css/**')
        .pipe(gulp.dest('public/css'));

    gulp.src('app/pages/**')
        .pipe(gulp.dest('public/pages'));

    gulp.src('app/partials/**')
        .pipe(gulp.dest('public/partials'));


});