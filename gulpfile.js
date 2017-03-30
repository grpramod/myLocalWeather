var gulp  = require('gulp'),
    gutil = require('gulp-util');
    htmlreplace = require('gulp-html-replace')
    uglify = require('gulp-uglify')
    concat = require('gulp-concat')
    clean = require('gulp-clean')
    connect = require('gulp-connect'),
    Server = require('karma').Server,
    protractor = require("gulp-protractor").protractor;
 


gulp.task('default', ['clean','connect','unit','copyManifestFile','copyImageFiles','copyCSSFiles','buildJs','replaceScript','copyVendorScript']);

/*Clean dist folder*/
gulp.task('clean', function () {
    return gulp.src('app/dist', {read: false})
        .pipe(clean());
});
/*Copy manifest file to dist folder*/
gulp.task('copyManifestFile', function() {
  gulp.src('manifest.json').pipe(gulp.dest('dist'));
});
/*Copy image files to dist folder*/
gulp.task('copyImageFiles', function() {
  gulp.src(['*.png','*.jpg']).pipe(gulp.dest('dist'));
});
/*Copy css files to dist folder*/
gulp.task('copyCSSFiles', function() {
  gulp.src('app/*.css')
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/css'));
});
/*Minify and Copy *.js file to dist folder*/
gulp.task('buildJs', function() {
  gulp.src(['app/app.js','app/background.js'])
  	.pipe(uglify())
  	.pipe(gulp.dest('dist/js'));

});
/*Switch resources from Dev to Prodr*/
gulp.task('replaceScript', function() {
  gulp.src('index.html')
    .pipe(htmlreplace({
        'vendor': 'lib/angular.min.js',
        'appjs': 'js/app.js',
        'appcss': 'css/app.css'
    }))
    .pipe(gulp.dest('dist'));

});
/*Copy Vendor file to dist folder*/
gulp.task('copyVendorScript', function() {
  gulp.src('node_modules/angular/angular.min.js').pipe(gulp.dest('dist/lib'));
});

/* Unit and E2E test tasks*/
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});

gulp.task('unit', function (done) {
  var server = new Server({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true
  }, done);
  server.start();
});

gulp.task('e2e', function(done) {
  var args = ['--baseUrl', 'http://127.0.0.1:8888'];
  gulp.src(["./tests/e2e/*.js"])
    .pipe(protractor({
      configFile: "tests/protractor.conf.js",
      args: args
    }))
    .on('error', function(e) { throw e; });
});

