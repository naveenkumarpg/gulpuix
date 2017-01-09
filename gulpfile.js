    // Load plugins
    var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        cssnano = require('gulp-cssnano'),
        jshint = require('gulp-jshint'),
        uglify = require('gulp-uglify'),
        imagemin = require('gulp-imagemin'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        notify = require('gulp-notify'),
        cache = require('gulp-cache'),
        livereload = require('gulp-livereload'),
        del = require('del');

    var jsfilelist = ['src/scripts/vendor/jquery-3.1.1.js','src/scripts/components/globalheader.js',];

    // Styles
    gulp.task('styles', function() {
      return sass('src/styles/main.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
    });

    // Scripts
    gulp.task('scripts', function() {
      return gulp.src(jsfilelist)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
    });

    // Images
    gulp.task('images', function() {
      return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
    });


    // Clean
    gulp.task('clean', function() {
      return del(['dist/styles', 'dist/scripts', 'dist/images']);
    });


    // Default task
    gulp.task('default', ['clean'], function() {
      gulp.start('styles', 'scripts', 'images');
    });


    // Watch
    gulp.task('watch', function() {

      // Watch .scss files
      gulp.watch('src/styles/**/*.scss', ['styles']);

      // Watch .js files
      gulp.watch('src/scripts/**/*.js', ['scripts']);

      // Watch image files
      gulp.watch('src/images/**/*', ['images']);

      // Create LiveReload server
      livereload.listen();

      // Watch any files in dist/, reload on change
      gulp.watch(['dist/**']).on('change', livereload.changed);

    });
