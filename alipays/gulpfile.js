var gulp = require('gulp')
var config = require('./index.js')
var rename = require('gulp-rename')
var clean = require('gulp-clean');
var less = require('gulp-less');
const SOURCE_CODE_PATH = './src';
//清除
gulp.task('clean', done => {
    gulp.src("./dist")
        .pipe(clean())
    done();
})
//输出axml
gulp.task('axml', done => {
    gulp.src('./src/**/*.axml')
        .pipe(gulp.dest(config.dist))
    done();
})
//输出axml
gulp.task('html', done => {
    gulp.src('./src/**/*.html')
        .pipe(rename(function (path) {
            path.extname = '.axml'
        }))
        .pipe(gulp.dest(config.dist))
    done();
})
//输出less
gulp.task('less', done => {
    gulp.src('./src/**/*.less')
        .pipe(less({
            outputStyle: 'compressed'
        }))
        .pipe(rename(function (path) {
            path.extname = '.acss'
        }))
        .pipe(gulp.dest(config.dist))
    done();
})
//输出acss
gulp.task('acss', done => {
    gulp.src('./src/**/*.acss')
        .pipe(gulp.dest(config.dist))
    done();
})
//输入axml
gulp.task('json', done => {
    gulp.src('./src/**/*.json')
        .pipe(gulp.dest(config.dist))
    done();
})
//输出js
gulp.task('js', done => {
    gulp.src('./src/**/*.js')
        .pipe(gulp.dest(config.dist))
    done();
})
//输出image
gulp.task('image', done => {
    gulp.src('./src/**/*.{png,jpg,gif,ico}')

        .pipe(gulp.dest(config.dist))
    done();
})
//输出sjs
gulp.task('sjs', done => {

    gulp.src('./src/**/*.sjs')
        .pipe(gulp.dest(config.dist))
    done();


})

// 监听
gulp.task('watch', (done) => {
    gulp.watch(SOURCE_CODE_PATH + '/**/*.html', gulp.series('html'));
    gulp.watch(SOURCE_CODE_PATH + '/**/*.axml', gulp.series('axml'));
    gulp.watch(
        SOURCE_CODE_PATH + '/**/*.less',
        gulp.series('less')
    );
    gulp.watch(
        SOURCE_CODE_PATH + '/**/*.acss',
        gulp.series('acss')
    );
    gulp.watch(SOURCE_CODE_PATH + '/**/*.js', gulp.series('js'));
    gulp.watch(SOURCE_CODE_PATH + '/**/*.sjs', gulp.series('sjs'));
    gulp.watch(SOURCE_CODE_PATH + '/**/*.{json,json5}', gulp.series('json'));
    gulp.watch(
        SOURCE_CODE_PATH + '/**/*.{png,jpg,jpeg,gif,ico,svg,webp}',
        gulp.series('image')
    );
    done();
});
//dev任务  需要异步执行axml,ascc,json,js,image任务
gulp.task('dev', gulp.series('html', 'axml', 'less', 'acss', 'json', 'js', 'image', 'sjs', 'watch', done => {
    gulp.src(config.dev)
        .pipe(rename(function (path) {
            path.basename = 'config'
        }))
        .pipe(gulp.dest(config.dist))
    done();

}));
//test任务 需要异步执行axml,ascc,json,js,image任务
gulp.task('test', gulp.series('html', 'axml', 'less', 'acss', 'json', 'js', 'image', 'sjs', 'watch', done => {
    gulp.src(config.test)
        .pipe(rename(function (path) {
            path.basename = 'config'
        }))
        .pipe(gulp.dest(config.dist))
    done();

}));

//prod任务 需要异步执行axml,ascc,json,js,image任务
gulp.task('prod', gulp.series('html', 'axml', 'acss', 'less', 'json', 'js', 'image', 'sjs', 'watch', done => {
    gulp.src(config.prod)
        .pipe(rename(function (path) {
            path.basename = 'config'
        }))
        .pipe(gulp.dest(config.dist))
    done();

}));
//默认任务,监听所有文件的而变化,出了图片
gulp.task('default', gulp.series('html', 'axml', 'acss', 'less', 'json', 'js', "image", 'sjs', function () {


    gulp.watch('./src/**/*.html', done => {
        gulp.src('./src/**/*.html')
            .pipe(rename(function (path) {
                path.extname = '.axml'
            }))
            .pipe(gulp.dest(config.dist))
        done();
    })

    gulp.watch('./src/**/*.axml', done => {
        gulp.src('./src/**/*.axml')
            .pipe(gulp.dest(config.dist))
        done();
    })
    gulp.watch('./src/**/*.less', done => {
        gulp.src('./src/**/*.less')
            .pipe(less({
                outputStyle: 'compressed'
            }))
            .pipe(rename(function (path) {
                path.extname = '.acss'
            }))
            .pipe(gulp.dest(config.dist))
        done();
    })

    gulp.watch('./src/**/*.acss', done => {
        gulp.src('./src/**/*.acss')
            .pipe(gulp.dest(config.dist))
        done();
    })
    gulp.watch('./src/**/*.json', done => {
        gulp.src('./src/**/*.json')
            .pipe(gulp.dest(config.dist))
        done();
    })
    gulp.watch('./src/**/*.js', done => {
        gulp.src('./src/**/*.js')
            .pipe(gulp.dest(config.dist))
        done();
    })
    gulp.watch('./src/**/*.sjs', done => {
        gulp.src('./src/**/*.sjs')
            .pipe(gulp.dest(config.dist))
        done();
    })


}));