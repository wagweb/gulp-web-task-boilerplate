// --------------------------------------------------
// GULP WEB PROJECT
// by Niklas Wagner
// GitHub: https://github.com/primumFlaw
// --------------------------------------------------
// Table of contents
// 1. IMPORTS
// 2. CONFIG
// 3. GULP TASKS
// 4. BUILD FUNCTIONS
// 5. HELPER FUNCTIONS
// --------------------------------------------------
// gulp file include doku
// https://www.npmjs.com/package/gulp-file-include
// --------------------------------------------------

// ====================================================================================================
// 1. IMPORTS

// gulp
const gulp = require("gulp"); 

// npm plugins
const npmPlugin_fs = require("fs");
const npmPlugin_fsExtra = require("fs-extra");

// gulp plugins
const gulpPlugin_fileinclude = require("gulp-file-include");
const gulpPlugin_sass = require("gulp-sass");
const gulpPlugin_concat = require("gulp-concat");
const gulpPlugin_watch = require("gulp-watch");
const gulpPlugin_uglify = require("gulp-uglify");
const gulpPlugin_clean_css = require("gulp-clean-css");
const gulpPlugin_rename = require("gulp-rename");
 

// ====================================================================================================
// 2. CONFIG

var config = {
	// cli prefix
	cli_prefix: "⚙️ GulpWebTask INFO:",
	// path config
	path_src: "../src/",
	path_out: "../out/",
	// src folder config
	src_html_components_folder: "html.components/",
	src_html_templates_folder: "html.templates/",
	src_sass_folder: "assets.sass/",
	src_js_folder: "assets.js/",
	src_assets_folder: "assets/",
	// out folder config
	out_html_folder: "html/",
	out_sass_folder: "assets/css/",
	out_js_folder: "assets/js/",
	out_assets_folder: "assets/",
	// fileinclude
	fileinclude_prefix: "@@",
	// filenames
	sass_src_file: "root.scss",
	sass_out_filename: "css-build",
	sass_out_filename_min: "css-build.min",
	js_out_file: "js-build.js",
	js_out_file_min: "js-build.min.js",
}
 
// ====================================================================================================
// 3. GULP TASKS

// default task
gulp.task("default", function() {
	cleanBuild();
	build();
	watch();
	return Promise.resolve();
});

// build task
gulp.task("build", function() {
	cleanBuild();
	build();
	return Promise.resolve();
});

// ====================================================================================================
// 4. BUILD FUNCTIONS

// build
function build() {
	buildHtml();
	buildSass();
	buildSassMin();
	buildJs();
	buildJsMin();
	buildAssets();
}

// build html
function buildHtml() {
	log("BUILD -> html");
	// check directories
	checkDirectory(config.path_src);
	checkDirectory(config.path_src + config.src_html_components_folder);
	checkDirectory(config.path_src + config.src_html_templates_folder);
	// build
	gulp.src(config.path_src + config.src_html_templates_folder + "**")
    .pipe(gulpPlugin_fileinclude({prefix: config.fileinclude_prefix}))
    .pipe(gulp.dest(config.path_out + config.out_html_folder));
}

// build sass 
function buildSass() {
	log("BUILD -> sass");
	// check files
	checkFile(config.path_src + config.src_sass_folder + config.sass_src_file);
	// check directories
	checkDirectory(config.path_src);
	checkDirectory(config.path_src + config.src_sass_folder);
	// build
	gulp.src(config.path_src + config.src_sass_folder + config.sass_src_file)
	.pipe(gulpPlugin_sass().on("error", gulpPlugin_sass.logError))
	.pipe(gulpPlugin_rename({basename:config.sass_out_filename}))
    .pipe(gulp.dest(config.path_out + config.out_sass_folder));
}

// build sass min
function buildSassMin() {
	log("BUILD -> sass min");
	// check files
	checkFile(config.path_src + config.src_sass_folder + config.sass_src_file);
	// check directories
	checkDirectory(config.path_src);
	checkDirectory(config.path_src + config.src_sass_folder);
	// build
	gulp.src(config.path_src + config.src_sass_folder + config.sass_src_file)
	.pipe(gulpPlugin_sass().on("error", gulpPlugin_sass.logError))
	.pipe(gulpPlugin_clean_css())
	.pipe(gulpPlugin_rename({basename:config.sass_out_filename_min}))
    .pipe(gulp.dest(config.path_out + config.out_sass_folder));
}

// build js
function buildJs() {
	log("BUILD -> js");
	// check directories
	checkDirectory(config.path_src);
	checkDirectory(config.path_src + config.src_js_folder);
	// build
	gulp.src(config.path_src + config.src_js_folder + "**")
    .pipe(gulpPlugin_concat(config.js_out_file))
	.pipe(gulp.dest(config.path_out + config.out_js_folder));
}

// build js min
function buildJsMin(params) {
	log("BUILD -> js min");
	// check directories
	checkDirectory(config.path_src);
	checkDirectory(config.path_src + config.src_js_folder);
	// build
	gulp.src(config.path_src + config.src_js_folder + "**")
	.pipe(gulpPlugin_concat(config.js_out_file_min))
	.pipe(gulpPlugin_uglify())
	.pipe(gulp.dest(config.path_out + config.out_js_folder));
}

// build assets
function buildAssets() {
	log("BUILD -> assets");
	// check directories
	checkDirectory(config.path_src);
	checkDirectory(config.path_src + config.src_assets_folder);
	// build
	gulp.src(config.path_src + config.src_assets_folder + "**")
	.pipe(gulp.dest(config.path_out + config.out_assets_folder));
} 

// ====================================================================================================
// 5. HELPER FUNCTIONS

// watch
function watch() {           
	var watchHtmlComponentsPath = config.path_src + config.src_html_components_folder + "**";
	var watchHtmlTemplatesPath = config.path_src + config.src_html_templates_folder + "**";
	var watchSassPath = config.path_src + config.src_sass_folder + "**";
	var watchJsPath = config.path_src + config.src_js_folder + "**";
	var watchAssetsPath = config.path_src + config.src_assets_folder + "**";
	// watch html
	log("WATCHING -> html");
	gulpPlugin_watch(watchHtmlComponentsPath, function() {
		buildHtml();
	});
	gulpPlugin_watch(watchHtmlTemplatesPath, function() {
		buildHtml();
	});
	// watch sass      
	log("WATCHING -> sass");  
	gulpPlugin_watch(watchSassPath, function() {
		buildSass();
	});
	// watch js
	log("WATCHING -> js");
	gulpPlugin_watch(watchJsPath, function() {
		buildJs();
	});
	// watch assets
	log("WATCHING -> assets"); 
	gulpPlugin_watch(watchAssetsPath, function() {
		buildAssets();
	});
}

// clean build
function cleanBuild() {
	log("cleaning build (deletes out folder)");
	if(npmPlugin_fs.existsSync(config.path_out)) {
		npmPlugin_fsExtra.removeSync(config.path_out); 
	}
}	

// check directory
function checkDirectory(path) {
	if(!npmPlugin_fs.existsSync(path)) {
		npmPlugin_fs.mkdirSync(path);
		log("new folder created -> " + path);  
	}   
}

// check file
function checkFile(path) {
	if(!npmPlugin_fs.existsSync(path)) {
		npmPlugin_fsExtra.outputFileSync(path, "\n")
		log("new file created -> " + path);  
	}   
}

// log
function log(log) {
	console.log(config.cli_prefix + " " + log);	
}
