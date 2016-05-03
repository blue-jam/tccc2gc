var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task("upload", shell.task(["gapps upload"]));

gulp.task("upload-prd", ["copy"], shell.task(['gapps upload'], {cwd: "prd"}));

gulp.task("copy", function() {
  return gulp.src(["src/*.js"]).pipe(gulp.dest("prd/src/"));
});
