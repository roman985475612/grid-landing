const { src, dest, task, series, watch, parallel }  = require('gulp')
const rm           = require('gulp-rm')
const sass         = require('gulp-sass')(require('sass'))
const concat       = require('gulp-concat')
const browserSync  = require('browser-sync').create()
const reload       = browserSync.reload
const rename       = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const gcmq         = require('gulp-group-css-media-queries')
const cleanCss     = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')
const babel        = require('gulp-babel')
const uglify       = require('gulp-uglify')
const svgmin       = require('gulp-svgmin')
const svgo         = require('gulp-svgo')
const svgSprite    = require('gulp-svg-sprite')
const gulpIf       = require('gulp-if')
const webp         = require('gulp-webp')
const imagemin     = require('gulp-imagemin')
const env          = process.env.NODE_ENV
const fs           = require('fs')
    
const styles = [
    './node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
    './node_modules/owl.carousel/dist/assets/owl.theme.default.min.css',
]

const scripts = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/owl.carousel/dist/owl.carousel.min.js'
]

task('create:dirs', () => {
    return src('*.*', {read: false})
        .pipe(dest('./build'))
        .pipe(dest('./src/img'))
        .pipe(dest('./src/svg'))
        // .pipe(dest('./src/icons'))
        .pipe(dest('./src/fonts'))
        .pipe(dest('./src/js'))
        .pipe(dest('./src/scss'))
        .pipe(dest('./src/scss/blocks'))
})

const files = [
    './src/index.html',
    './src/scss/style.scss',
    './src/scss/_core.scss',
    './src/scss/_fonts.scss',
    './src/scss/_mixins.scss',
    './src/scss/_variables.scss',
]

task('create:files', () => {
    files.forEach(filepath => {
        fs.open(filepath, 'w', (err) => {})
    })
})

task('clean', () => {
    return src([
        'build/**/*', 
        '!build/img/**/*',
        '!build/fonts/**/*',
        '!build/icons/**/*',
        '!build/svg/**/*',
    ], {read: false})
        .pipe(rm())
})

task('clean:all', () => {
    return src([
        'build/**/*'
    ], {read: false})
        .pipe(rm())
})

task('copy:html', () => {
    return src('src/*.html')
        .pipe(dest('build'))
        .pipe(reload({stream: true}))
})

task('copy:fonts', () => {
    return src('src/fonts/**/*')
        .pipe(dest('build/fonts'))
})

task('copy:icons', () => {
    return src('src/icons/**/*')
        .pipe(dest('build/icons'))
})

task('copy:css', () => {
    return src([...styles])
        .pipe(dest('build/css'))
})

task('scss', () => {
    return src('src/scss/style.scss')
        .pipe(gulpIf(env === 'dev', sourcemaps.init()))
        // .pipe(concat('style.min.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(env === 'prod', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        })))
        .pipe(gulpIf(env === 'prod', gcmq()))
        .pipe(gulpIf(env === 'prod', cleanCss()))
        .pipe(rename('style.min.css'))
        .pipe(gulpIf(env === 'dev', sourcemaps.write()))
        .pipe(dest('build/css'))
        .pipe(reload({stream: true}))
})

task('copy:js', () => {
    return src([...scripts])
        .pipe(dest('build/js'))
})

task('js', () => {
    return src('src/js/*.js')
        .pipe(gulpIf(env === 'dev', sourcemaps.init()))
        .pipe(gulpIf(env === 'prod', babel({
            presets: ["@babel/preset-env"]
        })))
        .pipe(concat('all.js', {newLine: ';'}))
        .pipe(gulpIf(env === 'prod', uglify()))
        .pipe(rename('all.min.js'))
        .pipe(gulpIf(env === 'dev', sourcemaps.write()))
        .pipe(dest('build/js'))
        .pipe(reload({stream: true}))
})

task('img:min', () => {
    return src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(imagemin())
        .pipe(dest('build/img'))
})

task('img:webp', () => {
    return src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(webp({quality: 90}))
        .pipe(dest('build/img'))
})

task('img:svg', () => {
    return src('src/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: {
                        attrs: "(fill|stroke|style|width|data.*)"
                    }
                }
            ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest('build/img'))
})

task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        open: false
    })
})

task('watch', () => {
    watch('./src/scss/**/*.scss', series('scss'))
    watch('./src/js/**/*.js', series('js'))
    watch('./src/*.html', series('copy:html'))
})

task('default', 
    series(
        'clean', 
        parallel(
            'copy:html', 
            'copy:js', 
            'copy:css', 
            'scss', 
            'js', 
        ), 
        parallel('watch', 'serve')
    )
)

task('build', 
    series(
        'clean:all', 
        parallel(
            'copy:html', 
            'copy:js',
            'copy:css', 
            'scss', 
            'js', 
            'img:min', 
            'img:webp', 
            'img:svg', 
            'copy:fonts', 
        )
    ) 
)
