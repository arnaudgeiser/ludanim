var gulp = require("gulp");
var clean = require("gulp-clean");
var babel = require("gulp-babel");
var connect = require("gulp-connect");
var usemin = require("gulp-usemin");
var uglify = require("gulp-minify-html");
var rev = require("gulp-rev");
var sourcemaps = require('gulp-sourcemaps');

var DIST_DIR = "dist/";
var APP_DIR = "app/";

gulp.task("clean", function() {
	return gulp.src(DIST_DIR)
		.pipe(clean({force: true}));
});

gulp.task('usemin', function() {
	return gulp.src(APP_DIR+"index.html")
		.pipe(usemin({
			css: [],
			js: [],
			js2: [babel({presets: ['es2015']})],
			inlinejs: [ uglify() ]
		}))
		.pipe(gulp.dest(DIST_DIR))
		.pipe(connect.reload())
});

gulp.task("html", function() {
	return gulp.src(APP_DIR+"**/*.html")
		.pipe(gulp.dest(DIST_DIR))
		.pipe(connect.reload());
});

gulp.task("views", function() {
	return gulp.src(APP_DIR+"/views/*.html")
		.pipe(gulp.dest(DIST_DIR+"/views"));
});

gulp.task("fonts", function() {
	return gulp.src('./bower_components/font-awesome/fonts/*')
		.pipe(gulp.dest(DIST_DIR+'/fonts'));
});

gulp.task("scripts", function() {
	return gulp.src(APP_DIR+"**/*.js")
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets : ['es2015']
		}))
		.on('error', console.error.bind(console))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(DIST_DIR))
		.pipe(connect.reload());
});

gulp.task("watch", function() {
	gulp.watch("app/**.html", ["html"]);
	gulp.watch("app/views/**.html", ["html"]);
	gulp.watch("app/**/*.js", ["scripts"]);
});

gulp.task("build", ["usemin","views","fonts"]);
gulp.task("serve",["html","scripts","watch"],
	function() {
		connect.server({
			root : ".",
			livereload : true
	});
});

gulp.task("default", function() {
});
