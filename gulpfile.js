var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var angularFilesort = require('gulp-angular-filesort');
var historyApiFallback = require('connect-history-api-fallback');
var config = require('./gulp.config')();
var del = require('del');
var ren = require('rename');
//var path = require('path');
//var _ = require('lodash');
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;
var replace = require('gulp-replace');
var rename = require('gulp-rename');



gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function () {

    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jscs.reporter())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}));
});

gulp.task('templatecache', ['clean-code'], function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});





//
// inject CSS and JS for the app code
//
//gulp.task('inject', ['templatecache'], function () {
gulp.task('inject', function () {

    log('Wire up the app and lib js and css into the html');

    return gulp
        .src(config.index)

        //.pipe($.inject(gulp.src('./libs/css/**/*.css')))
        //.pipe($.inject(gulp.src('./libs/js/**/*.js', {read: false}), {name: 'libs'}))


        .pipe($.inject(gulp.src(config.theme),{relative: true}))
        .pipe($.inject(gulp.src(config.appjs).pipe(angularFilesort()),{relative: true})) //inject app js

        //.pipe(replace({prefix:'__',suffix:'__',global:opts}))
        //.pipe(rename(config.client + 'index.html'))


        .pipe(gulp.dest(config.client));
});


gulp.task('optimize', ['inject', 'images', 'fonts'], function() {
   log('Optimizing the javascript, css, html');

    var assets = $.useref();
    var templateCache = config.temp + config.templateCache.file;
    var cssFilter = $.filter(['**/*.css'],{restore:true});
    //var jsFilter = $.filter(['**/*.js'],{restore:true});
    var jsAppFilter = $.filter(['**/app.js'],{restore:true});
    var jsLibFilter = $.filter(['**/lib.js'],{restore:true});
    var indexHtmlFilter = $.filter(['**/*', '!**/index.html'], { restore: true });


    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(   
            gulp.src(templateCache, {read: false}), {
                starttag: '<!-- inject:templates:js -->',
                relative: true
            }))  //inject does the bundling up of css and js files based on comments in index.html
        .pipe(assets) //useref - go through index.html and bundle up css and js based on comments
        .pipe(cssFilter)
        .pipe($.csso())  //minify CSS
        .pipe(cssFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify()) //minify lib javascript
        .pipe(jsLibFilter.restore)
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())  //minify app javascript
        .pipe(jsAppFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe($.rev())  //add revision numbers to all files in the pipe, except index.html
        .pipe(indexHtmlFilter.restore)
        .pipe($.revReplace())  //substitute any references to files with the revision-named one
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build));
});

gulp.task('bump', function() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest(config.root));
});

gulp.task('build', ['optimize', 'images', 'fonts'], function() {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'To run from the build directory `gulp serve-build`'
    };
    del(config.temp);
    log(msg);
    //notify(msg);
});

gulp.task('build-release', ['build'], function() {

    //to prepare for release we need to tokenize a couple of things in the index.html and make a template
    gulp.src(config.buildindex)
        //.pipe(replace(/foo(.{3})/g, '$1foo'))
        .pipe(replace('<base href="/">', '<base href="__SLMAINT_BASE_HREF__">'))
        .pipe(replace('var slmaint_api_url = "http://localhost/slapi/api"', 'var slmaint_api_url = "__SLMAINT_API_URL__"'))
        .pipe(rename('index.html.template'))
        .pipe(gulp.dest(config.build));

});


gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    return del(delconfig).then(log('delete done'));
});

gulp.task('clean-fonts', function(done) {
    return clean(config.build + 'fonts/**/*.*');
});

gulp.task('clean-images', function(done) {
    return clean(config.build + 'images/**/*.*');
});

gulp.task('clean-styles', function(done) {
    return clean(config.temp + '**/*.css');
});

gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    return clean(files);
});




gulp.task('fonts', ['clean-fonts'], function() {

    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});


gulp.task('images', ['clean-images'], function() {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'img'));
});


gulp.task('serve-build', ['optimize'], function () {
    serve(false /* isDev */);
});


gulp.task('serve-dev', ['inject'], function () {
    serve(true /* isDev */);
});

gulp.task('serve-dev-express', ['inject'], function() {
    serve(true);
});



/////////////////////  MY FUNCTIONS /////////////////////////////
function clean(path) {

    log('Cleaning: ' + $.util.colors.blue(path));

    return del(path).then(log('delete done'));

}

function bserve(isDev, specRunner) {

    var filesOpt = isDev ? [
        config.client + '**/*.*',
        '!' + config.less,
        config.temp + '**/*.css'
    ] : [];

    var baseDirOpt = isDev ? config.client : config.build;

    browserSync({
        files: filesOpt,
        logLevel: "debug",
        server: {
            baseDir: baseDirOpt, // web root dir
            middleware: [ historyApiFallback() ] //this middleware fixes the "#" url routing issue with angular
        }
    });
}



function serve(isDev, specRunner) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
}


function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    // if (isDev) {
    //      gulp.watch([config.less], ['styles'])
    //          .on('change', changeEvent);
    // } else {
    //      gulp.watch([config.less, config.js, config.html], ['optimize', browserSync.reload])
    //          .on('change', changeEvent);
    // }

    //this is for live reload when using serve-build (not sure we need this???)
    if (!isDev) {
        gulp.watch([config.js, config.html], ['optimize', browserSync.reload])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            '!' + config.less,
            config.temp + '**/*.css'
        ] : [],
        //files: [config.client + '**/*.*'],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'ang',
        notify: true,
        reloadDelay: 1000 //1000
    };

    // if (specRunner) {
    //     options.startPath = config.specRunnerFile;
    // }

    browserSync(options);
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}
