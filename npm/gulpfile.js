// ================================================================================
// Gulp Web Task (V:3.0)
// by: Niklas Wagner
// ----------------------------------------
// INFO:
// gulp file include doku: https://www.npmjs.com/package/gulp-file-include
// ----------------------------------------
// Table of contents:
// CONFIG
// HELPER FUNCTIONS
// WORKER TASKS (PRIVATE)
// INIT TASKS (PRIVATE)
// EXPOSED TASKS (PUBLIC)
// WATCH CONFIG
// ================================================================================


// node gulp import
const gulp = require("gulp");

// node fs extra import
const fs = require("fs-extra");

// node browser sync import
const browserSync = require("browser-sync").create();

// node gulp module imports
const gulp_fileInclude = require("gulp-file-include");
const gulp_sass = require("gulp-sass");
const gulp_rename = require("gulp-rename");
const gulp_concat = require("gulp-concat");
const gulp_uglify = require("gulp-uglify");
const gulp_cleanCss = require("gulp-clean-css");

// ================================================================================
// CONFIG

// config
const config = {
	// cli prefix
	cli_prefix: "⚙️--GulpWebTask INFO:",
	// base paths
	pathSrc: "../src/",
	pathOut: "../out/",
	// src config
	src: {
		htmlComponentsPath: "html.components/",
		htmlTemplatesPath: "html.templates/",
		scssPath: "assets.scss/",
		scssRootFile: "root.scss",
		jsPath: "assets.js/",
		assetsPath: "assets/",
	},
	// out config
	out: {
		htmlPath: "html/",
		cssPath: "assets/css/",
		cssOutFileName: "app",
		cssOutFileNameMin: "app.min",
		jsPath: "assets/js/",
		jsOutFile: "app.js",
		jsOutFileNameMin: "app.min",
		assetsPath: "assets/",
	},
	// file include prefix
	fileIncludePrefix: "@@",
	// index content
	indexContent: ''
	+'<input type="text" placeholder="name-of-your-html-template" id="in-text">'
	+'<input type="button" value="Browse" id="in-button">'
	+'<script>'
	+'window.addEventListener("load", function() {'
	+'document.querySelector("#in-button").addEventListener("click", function() {'
	+'window.location.href = window.location.origin '
	+'+ "/html/" '
	+'+ document.querySelector("#in-text").value '
	+'+ ".html";'
	+'});'
	+'});'
	+'</script>',
};

// ================================================================================
// HELPER FUNCTIONS

// helper ensure file
function helper_ensureFile(path) {
	if (!fs.pathExistsSync(path)) {
		helperLog("creating file | rel path: " + path);
		fs.ensureFileSync(path);
	}
}

// helper ensure file with content
function helper_ensureFileWithContent(path, content) {
	if (!fs.pathExistsSync(path)) {
		helperLog("creating and filling file | rel path: " + path);
		fs.ensureFileSync(path);
		fs.outputFileSync(path, content);
	}
}

// helper ensure dir
function helper_ensureDir(path) {
	if (!fs.pathExistsSync(path)) {
		helperLog("creating dir | rel path: " + path);
		fs.ensureDirSync(path);
	}
}

// helper log
function helperLog(log) {
	console.log(config.cli_prefix + " " + log);
}

// ================================================================================
// WORKER TASKS (PRIVATE)

function workerBuildHtml() {
	// logging
	helperLog("building html");
	// ensure
	helper_ensureDir(config.pathSrc + config.src.htmlComponentsPath);
	helper_ensureDir(config.pathSrc + config.src.htmlTemplatesPath);
	// build
	return gulp.src(config.pathSrc + config.src.htmlTemplatesPath + "**")
    .pipe(gulp_fileInclude({prefix: config.fileIncludePrefix}))
	.pipe(gulp.dest(config.pathOut + config.out.htmlPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build scss
function workerBuildScss() {
	// logging
	helperLog("building scss");
	// ensure
	helper_ensureFile(config.pathSrc + config.src.scssPath + config.src.scssRootFile);
	// build
	return gulp.src(config.pathSrc + config.src.scssPath + config.src.scssRootFile)
	.pipe(gulp_sass().on("error", gulp_sass.logError))
	.pipe(gulp_rename({basename:config.out.cssOutFileName}))
	.pipe(gulp.dest(config.pathOut + config.out.cssPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build scss min
function workerBuildScssMin() {
	// logging
	helperLog("building scss min");
	// ensure
	helper_ensureFile(config.pathSrc + config.src.scssPath + config.src.scssRootFile);
	// build
	return gulp.src(config.pathSrc + config.src.scssPath + config.src.scssRootFile)
	.pipe(gulp_sass().on("error", gulp_sass.logError))
	.pipe(gulp_cleanCss())
	.pipe(gulp_rename({basename:config.out.cssOutFileNameMin}))
    .pipe(gulp.dest(config.pathOut + config.out.cssPath));
}

// worker build js
function workerBuildJs() {
	// logging
	helperLog("building js");
	// ensure
	helper_ensureDir(config.pathSrc + config.src.jsPath);
	// build
	return gulp.src(config.pathSrc + config.src.jsPath + "**")
    .pipe(gulp_concat(config.out.jsOutFile))
	.pipe(gulp.dest(config.pathOut + config.out.jsPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build js min
function workerBuildJsMin() {
	// logging
	helperLog("building js min");
	// ensure
	helper_ensureDir(config.pathSrc + config.src.jsPath);
	// build
	return gulp.src(config.pathSrc + config.src.jsPath + "**")
	.pipe(gulp_concat(config.out.jsOutFile))
	.pipe(gulp_uglify())
	.pipe(gulp_rename({basename:config.out.jsOutFileNameMin}))
	.pipe(gulp.dest(config.pathOut + config.out.jsPath));
}

// worker build assets
function workerBuildAssets() {
	// logging
	helperLog("building assets");
	// ensure
	helper_ensureDir(config.pathSrc + config.src.assetsPath);
	// build
	return gulp.src(config.pathSrc + config.src.assetsPath + "**")
	.pipe(gulp.dest(config.pathOut + config.out.assetsPath))
	.pipe(browserSync.reload({ stream: true }));
}

// ================================================================================
// INIT TASKS (PRIVATE)

// init browser sync
function initBrowserSync(cb) {
	// logging
	helperLog("starting browser sync");
	// ensure
	helper_ensureFileWithContent(config.pathOut + "index.html", config.indexContent);
	// browser sync
	browserSync.init({
		server: {
			baseDir: config.pathOut
		},
	});
	// callback
	cb();
}

// ================================================================================
// EXPOSED TASKS (PUBLIC)

// build dev
exports["build-dev"] = gulp.series(
	workerBuildHtml,
	workerBuildScss,
	workerBuildJs,
	workerBuildAssets
);

// build prod
exports["build-prod"] = gulp.series(
	workerBuildHtml,
	workerBuildScss,
	workerBuildScssMin,
	workerBuildJs,
	workerBuildJsMin,
	workerBuildAssets
);

// default
exports["default"] = gulp.series(
	workerBuildHtml,
	workerBuildScss,
	workerBuildScssMin,
	workerBuildJs,
	workerBuildJsMin,
	workerBuildAssets,
	initBrowserSync,
	watch
);

// ================================================================================
// WATCH

function watch(cb) {
	// paths
	const watchHtmlComponentsPath = config.pathSrc + config.src.htmlComponentsPath + "**";
	const watchHtmlTemplatesPath = config.pathSrc + config.src.htmlTemplatesPath + "**";
	const watchScssPath = config.pathSrc + config.src.scssPath + "**";
	const watchJsPath = config.pathSrc + config.src.jsPath + "**";
	const watchAssetsPath = config.pathSrc + config.src.assetsPath + "**";
	// watchers
	gulp.watch(watchHtmlComponentsPath, gulp.series(workerBuildHtml)); 
	gulp.watch(watchHtmlTemplatesPath, gulp.series(workerBuildHtml)); 
	gulp.watch(watchScssPath, gulp.series(workerBuildScss)); 
	gulp.watch(watchJsPath, gulp.series(workerBuildJs)); 
	gulp.watch(watchAssetsPath, gulp.series(workerBuildAssets));
	// callback
	cb()
}