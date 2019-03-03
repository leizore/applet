

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var del = require('del');
var replace = require('gulp-replace');
var postcss = require('gulp-postcss');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var newer = require('gulp-newer');
var debug = require('gulp-debug');
var pxtorpx = require('postcss-px2rpx');
var base64 = require('postcss-font-base64');
var argv  = require('yargs').argv;
var eslint = require('gulp-eslint')

// 相关路径配置
var paths = {
	src: {
		baseDir: 'src',
		imgDir: 'src/images',
		scssDir: 'src/assets/scss',
		imgFiles: 'src/images/**/*',
		scssFiles: 'src/**/*.scss',
		baseFiles: ['src/**/*.{png,js,json}', '!src/assets/**/*', '!src/images/**/*'],
		assetsDir: 'src/assets',
		assetsImgFiles: 'src/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
		wxmlFiles: 'src/**/*.wxml',
		jsFiles: 'src/**/*.js',
		wxFiles: 'src/**/*.wxss'
	},
	dist: {
		baseDir: 'dist',
		imgDir: 'dist/images',
		wxssFiles: 'dist/**/*.wxss',
	},
	tmp: {
		baseDir: 'tmp',
		imgDir: 'tmp/assets/images',
		imgFiles: 'tmp/assets/images/**/*.{png,jpg,jpeg,svg,gif}'
	}
};


// Log for output msg.
function log() {
	var data = Array.prototype.slice.call(arguments);
	gutil.log.apply(false, data);
}

// 压缩图片
function imageMin() {
	// return gulp.src(paths.src.i mgFiles, {si≤nce: gulp.lastRun(imageMin)})
	return gulp.src(paths.src.imgFiles)
		.pipe(newer(paths.dist.imgDir))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(gulp.dest(paths.dist.imgDir));
}

// assets 文件夹下的图片处理
function assetsImgMin() {
	return gulp.src(paths.src.assetsImgFiles)
		.pipe(newer(paths.tmp.imgDir))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(gulp.dest(paths.tmp.imgDir))
}

// Sass 编译
function sassCompile() {
	return gulp.src(paths.src.scssFiles)
		.pipe(sass({errLogToConsole: true,outputStyle: 'expanded'})
			.on('error', sass.logError))
		.pipe(gulpif(Boolean(argv.debug),debug({title: '`sassCompile` Debug:'})))
		.pipe(postcss([pxtorpx(), base64()]))
		.pipe(rename({
			'extname': '.wxss'
		}))
		.pipe(replace('.scss', '.wxss'))
		.pipe(gulp.dest(paths.dist.baseDir))
}

function jsEslint () {
	return gulp.src(paths.src.jsFiles)
	.pipe(eslint())
	.pipe(eslint.formatEach('compact', process.stderr))
}

// 复制基础文件
function copyBasicFiles() {
	return gulp.src(paths.src.baseFiles, {})
		.pipe(gulp.dest(paths.dist.baseDir));
}

// 复制 WXML
function copyWXML() {
	return gulp.src(paths.src.wxmlFiles, {})
		.pipe(gulp.dest(paths.dist.baseDir));
}

// 复制 WXSS
function copyWXSS() {
	return gulp.src(paths.src.wxFiles, {})
		.pipe(gulp.dest(paths.dist.baseDir));
}


// clean 任务, dist 目录
function cleanDist() {
	return del(paths.dist.baseDir);
}

// clean tmp 目录
function cleanTmp() {
	return del(paths.tmp.baseDir);
}

var watchHandler = function (type, file) {
	var extname = path.extname(file);
	// SCSS 文件
	if (extname === '.scss') {
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/').replace(extname, '.wxss');
			del([tmp]);
		} else {
			sassCompile();
		}
	}
	// 图片文件
	else if (extname === '.png' || extname === '.jpg' || extname === '.jpeg'  || extname === '.svg' || extname === '.gif') {
		if (type === 'removed') {
			if (file.indexOf('assets') > -1 ) {
				del([file.replace('src/', 'tmp/')]);
			} else {
				del([file.replace('src/', 'dist/')]);
			}
		} else {
			imageMin();
			assetsImgMin();
		}
	}

	// wxml
	else if (extname === '.wxml') {
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/')
			del([tmp]);
		} else {
			copyWXML();
		}
	}

	// wxss
	else if (extname === '.wxss') {
		if (type === 'removed') {
			var temp = file.replace('src/', 'dist/')
			del([temp]);
		} else {
			copyWXSS()
		}
	}

	// 其余文件
	else {
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/');
			del([tmp]);
		} else {
			copyBasicFiles();
		}

	}

	jsEslint()
};

//监听文件
function watch(cb) {
	var watcher = gulp.watch([
			paths.src.baseDir,
			paths.tmp.imgDir
		],
		{ignored: /[\/\\]\./}
	);
	watcher
		.on('change', function (file) {
			log(gutil.colors.yellow(file) + ' is changed');
			watchHandler('changed', file);
		})
		.on('add', function (file) {
			log(gutil.colors.yellow(file) + ' is added');
			watchHandler('add', file);
		})
		.on('unlink', function (file) {
			log(gutil.colors.yellow(file) + ' is deleted');
			watchHandler('removed', file);
		});

	cb();
}

//注册默认任务
gulp.task('default', gulp.series(
	cleanTmp,
	copyBasicFiles,
	gulp.parallel(
		sassCompile,
		imageMin,
		copyWXML,
		copyWXSS
	),
	assetsImgMin,
	jsEslint,
	watch
));

//注册测试任务
gulp.task('test', gulp.series(
	cleanTmp,
	copyBasicFiles,
	gulp.parallel(
		sassCompile,
		imageMin,
		copyWXML,
		copyWXSS
	),
	assetsImgMin
));


// 删除任务
gulp.task('clean', gulp.parallel(
	cleanTmp,
	cleanDist
));
