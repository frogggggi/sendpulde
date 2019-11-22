let gulp = require('gulp'), // Подключаем Gulp
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'), // Подключаем Sass пакет
    pug = require('gulp-pug'), // Подключаем pug
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    spritesmith = require('gulp.spritesmith'), // Подключаем библиотеку создания спрайтов
    merge = require('merge-stream'), // Подключаем merge
    autoprefixer = require('gulp-autoprefixer');

let browserSync = require('browser-sync').create();

let pathBuild = './dist/';
let pathSrc = './src/';

let pathFonts = [
    pathSrc + 'fonts/**/*'
];

gulp.task('sass', function () {
    return gulp.src(pathSrc + 'sass/**/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(pathBuild + 'css'));
});

gulp.task('cleanCSSBuild', () => {
    return gulp.src(pathBuild + 'css/main.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(pathBuild + 'css/'))
});
/*
gulp.task('pug', function () {
    gulp.src('src/pug/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'))
});
*/

gulp.task('pug', function () {
    gulp.src('src/pug/*.+(jade|pug)')   
        .pipe(pug({
            data: {
                title: 'Our Awesome Website',
                links: [
                    'Link 3',
                    'Link 2',
                    'Link 1'
                ],
                message: 'Hello World!'
            }
        }))
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'))
});

gulp.task('js', function () {
    return gulp.src(pathSrc + 'js/**/*.js')
        .pipe(gulp.dest('dist/js'));
});


gulp.task('svg', function () {
    return gulp.src(pathSrc + 'svg/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/svg'));
});
gulp.task('img', function () {
    return gulp.src(pathSrc + 'img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fontsDev', () => {
    return gulp.src(pathFonts)
        .pipe(gulp.dest(pathBuild + 'fonts'));
});

gulp.task('sprite', function () {
    let spriteData = gulp.src('src/sprite/*.png').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: 'sprite.scss'
    }));
    let imgStream = spriteData.img
        .pipe(gulp.dest('src/img/'));
    let cssStream = spriteData.css
        .pipe(gulp.dest('src/sprite/'));
    return merge(imgStream, cssStream);
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: pathBuild
    });
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.+(sass|scss)', ['sass', 'cleanCSSBuild']);
    gulp.watch('src/pug/**/*.+(jade|pug)', ['pug']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/img/**/*', ['img']);
    gulp.watch('src/sprite/**/*.png', ['sprite']);
});

gulp.task('default', [
    'img',
    'svg',
    'js',
    'sass',
    'pug',
    'fontsDev',
    'cleanCSSBuild',
    'watch',
    'browserSync',
]);
