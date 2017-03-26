var gulp  = require('gulp'),
    gutil = require('gulp-util');
    htmlreplace = require('gulp-html-replace')
    uglify = require('gulp-uglify')
    concat = require('gulp-concat');

gulp.task('default', ['copyManifestFile','buildJs','replaceScript','copyVendorScript']);

gulp.task('copyManifestFile', function() {
  gulp.src('manifest.json').pipe(gulp.dest('dist'));
});
gulp.task('buildJs', function() {
  gulp.src('app/*.js')
  	.pipe(concat('app.min.js'))
  	.pipe(uglify())
  	.pipe(gulp.dest('dist/js'));

});

gulp.task('replaceScript', function() {
  gulp.src('index.html')
    .pipe(htmlreplace({
        'vendor': 'lib/angular.min.js',
        'appjs': 'js/app.min.js'
    }))
    .pipe(gulp.dest('dist'));

});

gulp.task('copyVendorScript', function() {
  gulp.src('node_modules/angular/angular.min.js').pipe(gulp.dest('dist/lib'));
});

