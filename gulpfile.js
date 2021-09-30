const { src, dest, watch, series, task, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const webserver = require('gulp-webserver')
const minifyCSS = require('gulp-minify-css')
const uglify = require('gulp-uglify')
const rename = require("gulp-rename")
// const concat = require("concat")

const html_options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: false, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
    minifyJS: false, //压缩页面JS
    minifyCSS: false //压缩页面CSS
};
const root_path = './dist';


function buildStyles() {
    return src('./app/sass/index.scss')
        .pipe(sass())
        .pipe(dest('./app/css'))
}

function watchTask() {
    watch(['./app/sass/**/*.scss'], buildStyles)

    src('app') //起始目錄
        .pipe(webserver({
            host: 'localhost', //host設定'0.0.0.0'，就可以用內網檢視
            port: 8888, //設定一個沒在使用的port
            livereload: true, //auto refresh
            open: true //執行gulp時自動開啟browser
        }));
}

function build() {
    return src('./app/css/index.css')
        // .pipe(minifyCSS({
            // keepBreaks: true,
            // relative_assets:false
        // }))
        .pipe(rename(function (path) {
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(dest('./public/css/'));

    // src('./app/js/*.js')
    //     .pipe(uglify())
    //     .pipe(rename(function (path) {
    //         path.basename += ".min";
    //         path.extname = ".js";
    //     }))
    //     .pipe(dest('./dist/js/'));
}

exports.default = series(build, parallel(buildStyles, watchTask))