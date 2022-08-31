var gulp = require("gulp");
var config = require("./index.js");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var less = require("gulp-less");
const SOURCE_CODE_PATH = "./src";
//清除
gulp.task("clean", (done) => {
  gulp.src("./dist").pipe(clean());
  done();
});
//输出wxml
gulp.task("wxml", (done) => {
  gulp.src("./src/**/*.wxml").pipe(gulp.dest(config.dist));
  done();
});
//输出wxml
gulp.task("html", (done) => {
  gulp
    .src("./src/**/*.html")
    .pipe(
      rename(function (path) {
        path.extname = ".wxml";
      })
    )
    .pipe(gulp.dest(config.dist));
  done();
});
//输出less
gulp.task("less", (done) => {
  gulp
    .src("./src/**/*.less")
    .pipe(
      less({
        outputStyle: "compressed",
      })
    )
    .pipe(
      rename(function (path) {
        path.extname = ".wxss";
      })
    )
    .pipe(gulp.dest(config.dist));
  done();
});
//输出wxss
gulp.task("wxss", (done) => {
  gulp.src("./src/**/*.wxss").pipe(gulp.dest(config.dist));
  done();
});
//输入wxml
gulp.task("json", (done) => {
  gulp.src("./src/**/*.json").pipe(gulp.dest(config.dist));
  done();
});
//输出js
gulp.task("js", (done) => {
  gulp.src("./src/**/*.js").pipe(gulp.dest(config.dist));
  done();
});
//输出image
gulp.task("image", (done) => {
  gulp
    .src("./src/**/*.{png,jpg,gif,ico}")

    .pipe(gulp.dest(config.dist));
  done();
});
//输出sjs
gulp.task("sjs", (done) => {
  gulp.src("./src/**/*.sjs").pipe(gulp.dest(config.dist));
  done();
});

// 监听
gulp.task("watch", (done) => {
  gulp.watch(SOURCE_CODE_PATH + "/**/*.html", gulp.series("html"));
  gulp.watch(SOURCE_CODE_PATH + "/**/*.wxml", gulp.series("wxml"));
  gulp.watch(SOURCE_CODE_PATH + "/**/*.less", gulp.series("less"));
  gulp.watch(SOURCE_CODE_PATH + "/**/*.wxss", gulp.series("wxss"));
  gulp.watch(SOURCE_CODE_PATH + "/**/*.js", gulp.series("js"));
  gulp.watch(SOURCE_CODE_PATH + "/**/*.sjs", gulp.series("sjs"));
  gulp.watch(SOURCE_CODE_PATH + "/**/*.{json,json5}", gulp.series("json"));
  gulp.watch(
    SOURCE_CODE_PATH + "/**/*.{png,jpg,jpeg,gif,ico,svg,webp}",
    gulp.series("image")
  );
  done();
});
//dev任务  需要异步执行wxml,ascc,json,js,image任务
gulp.task(
  "dev",
  gulp.series(
    "html",
    "wxml",
    "less",
    "wxss",
    "json",
    "js",
    "image",
    "sjs",
    "watch",
    (done) => {
      gulp
        .src(config.dev)
        .pipe(
          rename(function (path) {
            path.basename = "config";
          })
        )
        .pipe(gulp.dest(config.dist));
      done();
    }
  )
);
//test任务 需要异步执行wxml,ascc,json,js,image任务
gulp.task(
  "test",
  gulp.series(
    "html",
    "wxml",
    "less",
    "wxss",
    "json",
    "js",
    "image",
    "sjs",
    "watch",
    (done) => {
      gulp
        .src(config.test)
        .pipe(
          rename(function (path) {
            path.basename = "config";
          })
        )
        .pipe(gulp.dest(config.dist));
      done();
    }
  )
);

//prod任务 需要异步执行wxml,ascc,json,js,image任务
gulp.task(
  "prod",
  gulp.series(
    "html",
    "wxml",
    "wxss",
    "less",
    "json",
    "js",
    "image",
    "sjs",
    "watch",
    (done) => {
      gulp
        .src(config.prod)
        .pipe(
          rename(function (path) {
            path.basename = "config";
          })
        )
        .pipe(gulp.dest(config.dist));
      done();
    }
  )
);
//默认任务,监听所有文件的而变化,出了图片
gulp.task(
  "default",
  gulp.series(
    "html",
    "wxml",
    "wxss",
    "less",
    "json",
    "js",
    "image",
    "sjs",
    function () {
      gulp.watch("./src/**/*.html", (done) => {
        gulp
          .src("./src/**/*.html")
          .pipe(
            rename(function (path) {
              path.extname = ".wxml";
            })
          )
          .pipe(gulp.dest(config.dist));
        done();
      });

      gulp.watch("./src/**/*.wxml", (done) => {
        gulp.src("./src/**/*.wxml").pipe(gulp.dest(config.dist));
        done();
      });
      gulp.watch("./src/**/*.less", (done) => {
        gulp
          .src("./src/**/*.less")
          .pipe(
            less({
              outputStyle: "compressed",
            })
          )
          .pipe(
            rename(function (path) {
              path.extname = ".wxss";
            })
          )
          .pipe(gulp.dest(config.dist));
        done();
      });

      gulp.watch("./src/**/*.wxss", (done) => {
        gulp.src("./src/**/*.wxss").pipe(gulp.dest(config.dist));
        done();
      });
      gulp.watch("./src/**/*.json", (done) => {
        gulp.src("./src/**/*.json").pipe(gulp.dest(config.dist));
        done();
      });
      gulp.watch("./src/**/*.js", (done) => {
        gulp.src("./src/**/*.js").pipe(gulp.dest(config.dist));
        done();
      });
      gulp.watch("./src/**/*.sjs", (done) => {
        gulp.src("./src/**/*.sjs").pipe(gulp.dest(config.dist));
        done();
      });
    }
  )
);
