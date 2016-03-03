var gulp 		= require('gulp'),
	gulpConcat 	= require ('gulp-concat'),
	connect 	= require ('gulp-connect'),
	gulpFilter 	= require ('gulp-filter'),
	gulpJade 	= require ('gulp-jade'),
	gulpJslint 	= require ('gulp-jslint'),
	gulpSass	= require ('gulp-sass'),
	jade 		= require('jade'),
	bowerFiles	= require('gulp-main-bower-files');

gulp.task('bower', function() {
    return gulp.src('./bower.json')
        .pipe(bowerFiles())
      	.pipe(gulp.dest('test/assets/lib'))
});

// Compile Jade
gulp.task('html', function() {
	return gulp.src('src/*.jade')
		.pipe(gulpJade({
			jade: jade,
			pretty: true
		}))
		.pipe(gulp.dest('test/'));
});

// Compile SCSS
gulp.task('css', function() {
    return gulp.src('src/assets/scss/*.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('test/assets/css/'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/assets/js/*.js')
        .pipe(gulpJslint())
        .pipe(gulpJslint({reporter: 'default'}));
});

// Concatenate JS
gulp.task('scripts', function() {
    return gulp.src('src/assets/js/*.js')
        .pipe(gulpConcat('main.js'))
        .pipe(gulp.dest('test/assets/js/'))
});

// Other assets
gulp.task('img', function() {
	return gulp.src('src/assets/img/**/*')
		.pipe(gulp.dest('test/assets/img/'))
});

gulp.task('fonts', function() {
	return gulp.src('src/assets/fonts/**/*')
		.pipe(gulp.dest('test/assets/fonts/'))
});

gulp.task('assets', ['img', 'fonts']);

gulp.task('connect', function() {
	connect.server({
		root: 'test'
	})
});

// Watch for any changes
gulp.task('watch', function() {
	gulp.watch('src/**/*.jade', ['html']); 
	gulp.watch('src/assets/scss/**/*.scss', ['css']);
    gulp.watch('src/assets/js/**/*.js', ['lint', 'scripts']);
    gulp.watch('src/assets/img/**/*', ['img']);
    gulp.watch('src/assets/fonts/**/*', ['fonts']);
});

gulp.task('default', ['bower', 'html', 'css', 'lint', 'scripts', 'assets', 'watch']);
