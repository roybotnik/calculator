var gulp = require("gulp");
var connect = require("gulp-connect");
var livereload = require('gulp-livereload');
var karma = require("karma").server;

gulp.task("test",function (done) {
  karma.start({
    configFile : __dirname + "/karma.conf.js",
    singleRun : true
  },done);
});

gulp.task("tdd",function (done) {
  karma.start({
    configFile : __dirname + "/karma.conf.js"
  },done);
});

gulp.task("watch",function () {
  livereload.listen();
  gulp.watch("app/**").on("change",livereload.changed);
});

gulp.task("connect",function () {
  connect.server({
    root: "app",
    livereload: true
  });
});

gulp.task("copy_externals",function () {
  gulp.src("node_modules/angular/angular.js").
    pipe(gulp.dest("app/js"));
});

gulp.task("default",["copy_externals","connect","watch"]);
