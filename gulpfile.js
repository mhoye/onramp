var gulp 		= require('gulp'),
	plumber 	= require('gulp-plumber'),
	bowerFiles 	= require('gulp-main-bower-files'),
	filter		= require('gulp-filter'),
	flatten 	= require('gulp-flatten'),
	connect 	= require('gulp-connect'),
	jade 		= require('jade'),
	gulpJade 	= require ('gulp-jade'),
	scss 		= require('gulp-sass'),
	gulpConcat 	= require('gulp-concat'),
	lint 		= require ('gulp-jslint'),
	htmlmin 	= require('gulp-html-minifier'),
	uglifycss 	= require('gulp-uglifycss'),
	uglifyjs 	= require('gulp-uglify');

var config = {
	bootstrapDir: './bower_components/bootstrap-sass',
	tabzillaDir: './bower_components/mozilla-tabzilla',
	publicDir: './test',
};

// Build HTML

gulp.task('html', function() {
	return gulp.src('src/*.jade')
	.pipe(plumber())
	.pipe(gulpJade({
		jade: jade,
		pretty: true
	}))
	.pipe(plumber.stop())
	.pipe(gulp.dest(config.publicDir));
});

// Build CSS

gulp.task('css', function() {
	return gulp.src('./src/assets/scss/*.scss')
	.pipe(plumber())
	.pipe(scss({
		includePaths: [
			config.bootstrapDir + '/assets/stylesheets', 
			config.tabzillaDir + '/css/'
        ]
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.publicDir + '/assets/css'));
});

// Build Js

gulp.task('libJs', function() {
    var filterJs = filter('**/*.js');
    return gulp.src('./bower.json')
        .pipe(bowerFiles())
        .pipe(filterJs)
        .pipe(gulpConcat('vendor.js'))
        .pipe(gulp.dest(config.publicDir + '/assets/js'));
});

gulp.task('lint', function() {
    return gulp.src('src/assets/js/*.js')
        .pipe(lint())
        .pipe(lint({reporter: 'default'}));
});

gulp.task('js', function() {
	return gulp.src('src/assets/js/*.js')
		.pipe(plumber())
		.pipe(gulpConcat('main.js'))
		.pipe(plumber.stop())
        .pipe(gulp.dest(config.publicDir + '/assets/js'))
});

gulp.task('scripts', ['libJs', 'lint', 'js']);

// Build assets

gulp.task('libImages', function() {
    return gulp.src(config.tabzillaDir + '/media/**/*')
    	.pipe(flatten())
    	.pipe(gulp.dest(config.publicDir + '/assets/img'));
});

gulp.task('images', function() {
	return gulp.src('src/assets/img/**/*')
		.pipe(gulp.dest(config.publicDir + '/assets/img'))
});

gulp.task('libFonts', function() {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
    	.pipe(plumber())
    	.pipe(flatten())
    	.pipe(plumber.stop())
    	.pipe(gulp.dest(config.publicDir + '/assets/fonts'));
});

gulp.task('assets', ['libImages', 'images', 'libFonts']);

// Server

gulp.task('connect', function() {
	connect.server({
		root: './test',
		port: 8000,
		https: false
	});
});

// Watch

gulp.task('watch', function() {
	gulp.watch('src/**/*.jade', ['html']); 
	gulp.watch('src/assets/scss/**/*.scss', ['css']);
    gulp.watch('src/assets/js/**/*.js', ['lint', 'js']);
    gulp.watch('src/assets/img/**/*', ['images']);
});


gulp.task('default', ['html', 'css', 'scripts', 'assets', 'connect', 'watch']);

gulp.task('dist', function() {
	gulp.src('./test/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
    
	gulp.src('./test/assets/css/*.css')
	.pipe(uglifycss())
	.pipe(gulp.dest('./dist/assets/css'))
	
	gulp.src('./test/assets/js/*.js')
        .pipe(uglifyjs())
        .pipe(gulp.dest('./dist/assets/js'));
	
	gulp.src(['./test/assets/**/*', '!./test/assets/{css, js}/*'])
        .pipe(gulp.dest('./dist/assets/'));
});
