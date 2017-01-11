    /*
     * Importing all the modules used in the gulp tasks
     */
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
        gulpSequence = require('gulp-sequence'),
        livereload = require('gulp-livereload'),
        del = require('del'),
        eslint = require('gulp-eslint'),
        htmlmin = require('gulp-htmlmin'),
        extname = require('gulp-extname'),
        assemble = require('assemble'),
        browserSync = require('browser-sync').create(),
        app = assemble();


        /*
         * Style task
         * Combines all the scss files mentioned in the main.scss
         * Deployes into main.css file into dist/styles folder
         */
        gulp.task('styles', function() {
          return sass('src/styles/main.scss', { style: 'expanded' })
            .pipe(autoprefixer('last 2 version'))
            .pipe(gulp.dest('dist/styles'));
        });

        /*
         * Style:prod task
         * Combines all the scss files mentioned in the main.scss
         * and prefixes it
         * Does the minification of main.css
         * Deployes into dist/styles folder
         */
        gulp.task('styles:prod', function() {
          return sass('src/styles/main.scss', { style: 'expanded' })
            .pipe(autoprefixer('last 2 version'))
            .pipe(gulp.dest('dist/styles'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(cssnano())
            .pipe(gulp.dest('dist/styles'));
        });


        /*
         * @jsfilelist : This is the variable used to store list of jquery files
         * All the files will be served to "scripts" task as array
         */

         var jsfilelist = ['bower_components/jquery/dist/jquery.js',
                           'src/scripts/components/globalheader.js'];


        /*
         * Scripts task
         * @jsfilelist : uses as source to modify them.
         * Deployes combined and uglified js files to the dist folder.
         */
        gulp.task('scripts', function() {
            return gulp.src(jsfilelist)
            .pipe(concat('main.js'))
            .pipe(gulp.dest('dist/scripts'));
        });


        /*
         * Scripts task
         * @jsfilelist : uses as source to modify them.
         * Task to combile and uglify Js files
         * Deployes combined and uglified js files to the dist folder.
         */
        gulp.task('scripts:prod', function() {
            return gulp.src(jsfilelist)
            .pipe(concat('main.js'))
            .pipe(gulp.dest('dist/scripts'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts'));
        });


        /*
         * @lintFileList : variable to check the list of files to be linted.
         * This array will be served to "eslint" task as source.
         */
        var lintFileList = ['src/scripts/components/globalheader.js'];

        /*
         * Es lint task
         * to validate javascript files as per the mentioned standsrds ".eslintrc" file
         * Task validates all the js files served from "lintFileList" variable
         */
        gulp.task('eslint', function () {
            return gulp.src(lintFileList)
            .pipe(eslint())
            .pipe(eslint.format());
        });


        /*
         * Images task
         * Task to optimise the size of images and copy them to dist folder.
         */
        gulp.task('images', function() {
            return gulp.src('src/images/**/*')
            .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
            .pipe(gulp.dest('dist/images'));
        });


        /*
         * Clean task
         * Task to remove folders inside dist folder,
         * Triggered only while running gulp.
         */
        gulp.task('clean', function() {
          return del(['dist/styles', 'dist/scripts', 'dist/images']);
        });


        /*
         * Load Task
         * Helper task to provide configuration for the assembler task
         * Providing sources to assemble task
         */
        gulp.task('load', function(cb) {
          app.partials('src/templates/partials/*.hbs');
          app.layouts('src/templates/layouts/*.hbs');
          app.pages('src/templates/pages/*.hbs');
          app.data('src/data/*.{json,yml}');
          cb();
        });


        /*
         * Assemble Task
         * Task to combile handlebars templates to .HTML pages
         * Folders given in as "load" task.
         * Deployes compiled html files to dist folder
         */
        gulp.task('assemble', ['load'], function() {
          return app.toStream('pages')
            .pipe(app.renderFile())
            .pipe(htmlmin())
            .pipe(extname())
            .pipe(app.dest('dist'));
            //.pipe(notify({ message: 'Assemble task complete' }));
        });


        /*
         * Browser Sync
         * Task to start server
         * Few configurations to be added
         * opens page http://localhost:3000/
         */
        gulp.task('browser-sync', function() {
            browserSync.init({
                server: {
                    baseDir: "./dist"
                }
            });
        });


        /*
         * Watch task
         * Task to listen to the fodlers and files and triger relavent gulp tasks
         * Once task are done, the watch which is listening to the dist folder will refresh the page automatially.
         */
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

          // Watch any files in dist/ has chaneged re-load the browser
          gulp.watch(['dist/**/*.*']).on('change', browserSync.reload);

        });


        /*
         * Default task
         * if no task is specified while gulp triggers default task.
         * As mentioned in the array triggers indivedual tasks.
         * opens window with http://localhost:3000/ url
         */
        gulp.task('default', function (cb) {
          gulpSequence('clean',['styles', 'scripts', 'images'],'assemble','watch','browser-sync')(cb)
        });


        /*
         * Build task
         * This task is to create uglify and minfy files for the production versions.
         * This task clean dist folder, main.css will get minified,
         * Js files as per the build config file whill get uglified, with added .min extn
         */
        gulp.task('build', function (cb) {
          gulpSequence('clean',['styles:prod','scripts:prod','images'],'assemble')(cb)
        });
