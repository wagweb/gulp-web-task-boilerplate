// ================================================================================
// Gulp Web Task (V:4.2)
// by: Niklas Wagner
// ----------------------------------------
// INFO:
// gulp file include docs: https://www.npmjs.com/package/gulp-file-include
// ----------------------------------------
// Table of contents:
// CONFIG
// HELPER FUNCTIONS
// WORKER TASKS (PRIVATE)
// INIT TASKS (PRIVATE)
// FILL TASK ARRAYS
// EXPOSED TASKS (PUBLIC)
// WATCH
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
const gulp_typescript = require("gulp-typescript");

// ================================================================================
// CONFIG

// config
const config = {
	// cli prefix
	cli_prefix: "⚙️--GulpWebTask INFO:",
	// base paths
	pathSrc: "./src/",
	pathOut: "./out/",
	// module config
	module: {
		// html
		html: {
			srcComponentsPath: "html.components/",
			srcTemplatesPath: "html.templates/",
			outPath: "html/",
		},
		// scss
		scss: {
			srcPath: "assets.scss/",
			srcFile: "root.scss",
			outPath: "assets/css/",
			outFileName: "app",
			outFileNameMin: "app.min",
		},
		// js
		js: {
			srcPath: "assets.js/",
			outPath: "assets/js/",
			outFile: "app-js.js",
			outFileNameMin: "app-js.min",
		},
		// ts
		ts: {
			srcPath: "assets.ts/",
			srcFile: "root.ts",
			outPath: "assets/js/",
			outFileName: "app-ts",
			outFileNameMin: "app-ts.min",
		},
		// assets
		assets: {
			srcPath: "assets/",
			outPath: "assets/",
		},
		// js ts bundle
		jsTsBundle: {
			srcJs: "assets/js/app-js.js",
			srcJsMin: "assets/js/app-js.min.js",
			srcTs: "assets/js/app-ts.js",
			srcTsMin: "assets/js/app-ts.min.js",
			outPath: "assets/js/",
			outFile: "app-bundle.js",
			outFileMin: "app-bundle.min.js",
		},
	},
	// enable config
	enable: {
		html: true,
		scss: true,
		js: true,
		assets: true,
		ts: true,
		tsJsBundle: true,
	},
	// file include prefix
	fileIncludePrefix: "@@",
};

// content index
config.contentIndex = `
<input type="text" placeholder="name-of-your-html-template" id="in-text">
<input type="button" value="Browse" id="in-button">
<script>
	window.addEventListener("load", function() {
		document.querySelector("#in-button").addEventListener("click", function() {
			window.location.href = window.location.origin 
			+ "/html/" 
			+ document.querySelector("#in-text").value 
			+ ".html";
		});
	});
</script>`;

// content tsconfig
config.contentTsconfig = `
{
	"files": [
		"`+ config.pathSrc + config.module.ts.srcPath + config.module.ts.srcFile +`"
	],
	"exclude": [
		"`+ config.pathOut +`"
	],
	"compilerOptions": {
		"module": "commonjs",
		"noImplicitAny": true,
		"target": "es5"
	}
}`;

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

// worker build html
function workerBuildHtml() {
	// logging
	helperLog("building html");
	// ensure
	helper_ensureDir(config.pathSrc + config.module.html.srcComponentsPath);
	helper_ensureDir(config.pathSrc + config.module.html.srcTemplatesPath);
	// build
	return gulp.src(config.pathSrc + config.module.html.srcTemplatesPath + "**")
    .pipe(gulp_fileInclude({prefix: config.fileIncludePrefix}))
	.pipe(gulp.dest(config.pathOut + config.module.html.outPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build scss
function workerBuildScss() {
	// logging
	helperLog("building scss");
	// ensure
	helper_ensureFile(config.pathSrc + config.module.scss.srcPath + config.module.scss.srcFile);
	// build
	return gulp.src(config.pathSrc + config.module.scss.srcPath + config.module.scss.srcFile)
	.pipe(gulp_sass().on("error", gulp_sass.logError))
	.pipe(gulp_rename({basename:config.module.scss.outFileName}))
	.pipe(gulp.dest(config.pathOut + config.module.scss.outPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build scss min
function workerBuildScssMin() {
	// logging
	helperLog("building scss min");
	// ensure
	helper_ensureFile(config.pathSrc + config.module.scss.srcPath + config.module.scss.srcFile);
	// build
	return gulp.src(config.pathSrc + config.module.scss.srcPath + config.module.scss.srcFile)
	.pipe(gulp_sass().on("error", gulp_sass.logError))
	.pipe(gulp_cleanCss())
	.pipe(gulp_rename({basename:config.module.scss.outFileNameMin}))
    .pipe(gulp.dest(config.pathOut + config.module.scss.outPath));
}

// worker build js
function workerBuildJs() {
	// logging
	helperLog("building js");
	// ensure
	helper_ensureDir(config.pathSrc + config.module.js.srcPath);
	// build
	return gulp.src(config.pathSrc + config.module.js.srcPath + "**")
    .pipe(gulp_concat(config.module.js.outFile))
	.pipe(gulp.dest(config.pathOut + config.module.js.outPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build js min
function workerBuildJsMin() {
	// logging
	helperLog("building js min");
	// ensure
	helper_ensureDir(config.pathSrc + config.module.js.srcPath);
	// build
	return gulp.src(config.pathSrc + config.module.js.srcPath + "**")
	.pipe(gulp_concat(config.module.js.outFile))
	.pipe(gulp_uglify())
	.pipe(gulp_rename({basename:config.module.js.outFileNameMin}))
	.pipe(gulp.dest(config.pathOut + config.module.js.outPath));
}

// worker build ts
function workerBuildTs() {
	// logging
	helperLog("building typescript");
	// ensure
	helper_ensureFile(config.pathSrc + config.module.ts.srcPath + config.module.ts.srcFile);
	helper_ensureFileWithContent("./tsconfig.json", config.contentTsconfig);
	// create typescript instance
	var tsInstance = gulp_typescript.createProject("tsconfig.json");
	// build
	return tsInstance.src()
	.pipe(tsInstance())
	.js
	.pipe(gulp_rename({basename:config.module.ts.outFileName}))
	.pipe(gulp.dest(config.pathOut + config.module.ts.outPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build ts min
function workerBuildTsMin() {
	// logging
	helperLog("building typescript min");
	// ensure
	helper_ensureFile(config.pathSrc + config.module.ts.srcPath + config.module.ts.srcFile);
	helper_ensureFileWithContent("./tsconfig.json", config.contentTsconfig);
	// create typescript instance
	var tsInstance = gulp_typescript.createProject("tsconfig.json");
	// build
	return tsInstance.src()
	.pipe(tsInstance())
	.js
	.pipe(gulp_uglify())
	.pipe(gulp_rename({basename:config.module.ts.outFileNameMin}))
	.pipe(gulp.dest(config.pathOut + config.module.ts.outPath));
}

// worker build assets
function workerBuildAssets() {
	// logging
	helperLog("building assets");
	// ensure
	helper_ensureDir(config.pathSrc + config.module.assets.srcPath);
	// build
	return gulp.src(config.pathSrc + config.module.assets.srcPath + "**")
	.pipe(gulp.dest(config.pathOut + config.module.assets.outPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build js ts bundle
function workerBuildJsTsBundle() {
	// logging
	helperLog("building js ts bundle");
	// ensure
	helper_ensureFile(config.pathOut + config.module.jsTsBundle.srcJs);
	helper_ensureFile(config.pathOut + config.module.jsTsBundle.srcTs);
	// build
	return gulp.src([
		config.pathOut + config.module.jsTsBundle.srcJs,
		config.pathOut + config.module.jsTsBundle.srcTs
	])
    .pipe(gulp_concat(config.module.jsTsBundle.outFile))
	.pipe(gulp.dest(config.pathOut + config.module.jsTsBundle.outPath))
	.pipe(browserSync.reload({ stream: true }));
}

// worker build js ts bundle
function workerBuildJsTsBundleMin() {
	// logging
	helperLog("building js ts bundle min");
	// ensure
	helper_ensureFile(config.pathOut + config.module.jsTsBundle.srcJsMin);
	helper_ensureFile(config.pathOut + config.module.jsTsBundle.srcTsMin);
	// build
	return gulp.src([
		config.pathOut + config.module.jsTsBundle.srcJsMin,
		config.pathOut + config.module.jsTsBundle.srcTsMin
	])
	.pipe(gulp_concat(config.module.jsTsBundle.outFileMin))
	.pipe(gulp.dest(config.pathOut + config.module.jsTsBundle.outPath))
}

// ================================================================================
// INIT TASKS (PRIVATE)

// init browser sync
function initBrowserSync(cb) {
	// logging
	helperLog("starting browser sync");
	// ensure
	helper_ensureFileWithContent(config.pathOut + "index.html", config.contentIndex);
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
// FILL TASK ARRAYS

// task arrays
const taskArrays = {
	"build-dev": [],
	"build-prod": [],
	"bundle": [],
	"default": [],
}

// fill task array build dev
config.enable.html ? taskArrays["build-dev"].push(workerBuildHtml):{};
config.enable.scss ? taskArrays["build-dev"].push(workerBuildScss):{};
config.enable.js ? taskArrays["build-dev"].push(workerBuildJs):{};
config.enable.ts ? taskArrays["build-dev"].push(workerBuildTs):{};
config.enable.assets ? taskArrays["build-dev"].push(workerBuildAssets):{};
config.enable.tsJsBundle ? taskArrays["build-dev"].push(workerBuildJsTsBundle):{};

// fill task array build prod
config.enable.html ? taskArrays["build-prod"].push(workerBuildHtml):{};
config.enable.scss ? taskArrays["build-prod"].push(workerBuildScss):{};
config.enable.js ? taskArrays["build-prod"].push(workerBuildJs):{};
config.enable.js ? taskArrays["build-prod"].push(workerBuildJsMin):{};
config.enable.ts ? taskArrays["build-prod"].push(workerBuildTs):{};
config.enable.ts ? taskArrays["build-prod"].push(workerBuildTsMin):{};
config.enable.assets ? taskArrays["build-prod"].push(workerBuildAssets):{};
config.enable.tsJsBundle ? taskArrays["build-prod"].push(workerBuildJsTsBundle):{};
config.enable.tsJsBundle ? taskArrays["build-prod"].push(workerBuildJsTsBundleMin):{};

// fill task array bundle
config.enable.tsJsBundle ? taskArrays["bundle"].push(workerBuildJsTsBundle):{};
config.enable.tsJsBundle ? taskArrays["bundle"].push(workerBuildJsTsBundleMin):{};

// fill task array default
config.enable.html ? taskArrays["default"].push(workerBuildHtml):{};
config.enable.scss ? taskArrays["default"].push(workerBuildScss):{};
config.enable.js ? taskArrays["default"].push(workerBuildJs):{};
config.enable.ts ? taskArrays["default"].push(workerBuildTs):{};
config.enable.assets ? taskArrays["default"].push(workerBuildAssets):{};
config.enable.tsJsBundle ? taskArrays["default"].push(workerBuildJsTsBundle):{};

// fill task array default
taskArrays["default"].push(initBrowserSync);
taskArrays["default"].push(watch);

// ================================================================================
// EXPOSED TASKS (PUBLIC)

// build dev
if (taskArrays["build-dev"].length > 0) {
	exports["build-dev"] = gulp.series(taskArrays["build-dev"]);
} else {
	helperLog("build-dev task not defined, to few modules active");
}

// build prod
if (taskArrays["build-prod"].length > 0) {
	exports["build-prod"] = gulp.series(taskArrays["build-prod"]);
} else {
	helperLog("build-prod task not defined, to few modules active");
}

// bundle
if (taskArrays["bundle"].length > 0) {
	exports["bundle"] = gulp.series(taskArrays["bundle"]);
} else {
	helperLog("bundle task not defined, to few modules active");
}

// default
if (taskArrays["default"].length > 0) {
	exports["default"] = gulp.series(taskArrays["default"]);
} else {
	helperLog("bundle task not defined, to few modules active");
}


// ================================================================================
// WATCH

function watch(cb) {
	// html components
	if (config.enable.html) {
		const watchHtmlComponentsPath = config.pathSrc + config.module.html.srcComponentsPath + "**";
		gulp.watch(watchHtmlComponentsPath, gulp.series(workerBuildHtml)); 
	}
	// html templates
	if (config.enable.html) {
		const watchHtmlTemplatesPath = config.pathSrc + config.module.html.srcTemplatesPath + "**";
		gulp.watch(watchHtmlTemplatesPath, gulp.series(workerBuildHtml)); 
	}
	// scss
	if (config.enable.scss) {
		const watchScssPath = config.pathSrc + config.module.scss.srcPath + "**";
		gulp.watch(watchScssPath, gulp.series(workerBuildScss)); 
	}
	// js
	if (config.enable.js) {
		const watchJsPath = config.pathSrc + config.module.js.srcPath + "**";
		gulp.watch(watchJsPath, gulp.series(workerBuildJs)); 
	}
	// ts
	if (config.enable.js) {
		const watchTsPath = config.pathSrc + config.module.ts.srcPath + "**";
		gulp.watch(watchTsPath, gulp.series(workerBuildTs)); 
	}
	// assets
	if (config.enable.assets) {
		const watchAssetsPath = config.pathSrc + config.module.assets.srcPath + "**";
		gulp.watch(watchAssetsPath, gulp.series(workerBuildAssets));
	}
	// callback
	cb()
}