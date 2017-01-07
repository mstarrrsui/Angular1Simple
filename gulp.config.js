module.exports = function () {
    var client = './client/';
    var clientApp = client + 'app/';
    var clientStyle = client + 'styles/';
    var clientLibs = client + 'libs/js';
    var report = './report/';
    var root = './';
    var server = './server/';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';


    var config = {
        /**
         * Files paths
         */
        alljstocheck: [
            './**/*.js',
            './*.js'
        ],
        build: './build/',
        buildindex: './build/index.html',
        client: client,
        theme: clientStyle + 'bootstrap-flatly.css',
        css: clientStyle + 'styles.css',
        fonts: [
            clientLibs + 'fonts/**/*.*'
        ],
        html: clientApp + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'img/**/*.*',
        index: client + 'index.html',
        appjs: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        //less: client + 'styles/styles.less',
        report: report,
        root: root,
        server: server,
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        },

        /**
         * browser sync
         */
        browserReloadDelay: 1000,


        packages: [
            './package.json'
        ],

        /**
         * Node settings
         */
        defaultPort: 7203,
        nodeServer: './server/app.js'

    };


    return config;

    ////////////////

};
