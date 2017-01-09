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
        del = require('del'),
        htmlmin = require('gulp-htmlmin'),
        extname = require('gulp-extname'),
        assemble = require('assemble'),
        browserSync = require('browser-sync').create(),
        app = assemble();

    var jsfilelist = ['src/scripts/vendor/jquery-3.1.1.js','src/scripts/components/globalheader.js',];

    // Styles
    gulp.task('styles', function() {
      return sass('src/styles/main.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/styles'));
    });

    // Scripts
    gulp.task('scripts', function() {
      return gulp.src(jsfilelist)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
    });

    // Images
    gulp.task('images', function() {
      return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
    });


    // Clean
    gulp.task('clean', function() {
      return del(['dist/styles', 'dist/scripts', 'dist/images']);
    });


    gulp.task('load', function(cb) {
      app.partials('src/templates/partials/*.hbs');
      app.layouts('src/templates/layouts/*.hbs');
      app.pages('src/templates/pages/*.hbs');
      app.data('src/data/*.{json,yml}');
      cb();
    });

    gulp.task('assemble', ['load'], function() {
      return app.toStream('pages')
        .pipe(app.renderFile())
        .pipe(htmlmin())
        .pipe(extname())
        .pipe(app.dest('dist'));
        //.pipe(notify({ message: 'Assemble task complete' }));
    });

    // Static server
    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: "./dist"
            }
        });
    });

    // Watch
    gulp.task('watch', function() {
      // Watch .scss files
      gulp.watch('src/styles/**/*.scss', ['styles']);

      // Watch .hbs files
      gulp.watch('src/templates/**/*.hbs', ['assemble']);

      // Watch .js files
      gulp.watch('src/scripts/**/*.js', ['scripts']);

      // Watch image files
      gulp.watch('src/images/**/*', ['images']);

      // Create LiveReload server
      livereload.listen();

      // Watch any files in dist/, reload on change
      gulp.watch(['dist/**/*.*']).on('change', browserSync.reload);

    });


    // Default task
    gulp.task('default', ['clean'], function() {
      gulp.start('styles', 'scripts', 'images','assemble','watch','browser-sync');
    });
