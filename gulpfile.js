const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const nodemon = require("gulp-nodemon");

const tsProject = ts.createProject("tsconfig.json");
const outputDir = "./dist";
const sourceMask = "./src/**/*";
const sourceMaskTS = `${sourceMask}.ts`;
const sourceMaskPgSQL = `${sourceMask}.pgsql`;

function copyTask() {
  return gulp.src(sourceMaskPgSQL).pipe(gulp.dest(outputDir));
}

function clean() {
  return del(outputDir);
}

const defaultTask = gulp.series(clean, build, copyTask);

function build() {
  return gulp
    .src(sourceMaskTS)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(tsProject())
    .js.pipe(
      sourcemaps.write("./", {
        includeContent: false,
        sourceRoot: ".",
      })
    )
    .pipe(gulp.dest(outputDir));
}
function watchTask() {
  gulp.watch(sourceMaskTS, build);
  gulp.watch(sourceMaskPgSQL, copyTask);
}
function botTestTask(done) {
  return nodemon({
    script: `${outputDir}/app.js`,
    watch: outputDir,
    delay: "1000",
    done,
  });
}

function devTask(done) {
  watchTask();
  gulp.series(defaultTask, botTestTask)();
}

exports.watch = watchTask;
exports.botTest = botTestTask;
exports.dev = devTask;
exports.copy = copyTask;
exports.default = defaultTask;
