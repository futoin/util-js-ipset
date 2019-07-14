'use strict';

var fs = require( 'fs' );

module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        eslint: {
            options: {
                fix: true,
                ignore: false,
            },
            target: [
                '*.js',
                'lib/**/*.js',
                'test/**/*.js',
            ],
        },
        webpack: {
            dist: require( './webpack.dist' ),
            test: require( './webpack.test' ),
        },
        jsdoc2md: {
            README: {
                src: [ '*.js', 'lib/**/*.js' ],
                dest: "README.md",
                options: { template: fs.readFileSync( 'misc/README.hbs', 'utf8' ) },
            },
        },
        replace: {
            README: {
                src: "README.md",
                overwrite: true,
                replacements: [
                    {
                        from: "$$pkg.version$$",
                        to: "<%= pkg.version %>",
                    },
                ],
            },
        },
        nyc: {
            cover: {
                options: {
                    cwd: '.',
                    exclude: [
                        '.eslintrc.js',
                        'Gruntfile.js',
                        'coverage/**',
                        'test/**',
                    ],
                    reporter: [ 'lcov', 'text-summary' ],
                    reportDir: 'coverage',
                    all: true,
                },
                cmd: false,
                args: [ 'mocha' ],
            },
            report: {
                options: {
                    reporter: 'text-summary',
                },
            },
        },
        karma: {
            test: {
                browsers: [ 'FirefoxHeadless' ],
                customLaunchers: {
                    FirefoxHeadless: {
                        base: 'Firefox',
                        flags: [
                            '-headless',
                        ],
                    },
                },
                frameworks: [ 'mocha' ],
                reporters: [ 'mocha' ],
                singleRun: true,
                files: [
                    { src: [ 'dist/*.js' ], serve: true, include: false },
                ],
            },
        },
    } );

    grunt.loadNpmTasks( 'grunt-eslint' );
    grunt.loadNpmTasks( 'grunt-webpack' );
    grunt.loadNpmTasks( 'grunt-karma' );
    grunt.loadNpmTasks( 'grunt-simple-nyc' );

    grunt.registerTask( 'check', [ 'eslint' ] );

    grunt.registerTask( 'build-browser', [ 'webpack:dist' ] );
    grunt.registerTask( 'test-browser', [ 'webpack:test', 'karma' ] );

    grunt.registerTask( 'node', [ 'nyc' ] );
    grunt.registerTask( 'browser', [ 'build-browser', 'test-browser' ] );
    grunt.registerTask( 'test', [
        'check',
        'node',
        'browser',
        'doc',
    ] );

    grunt.loadNpmTasks( 'grunt-jsdoc-to-markdown' );
    grunt.loadNpmTasks( 'grunt-text-replace' );
    grunt.registerTask( 'doc', [ 'jsdoc2md:README', 'replace:README' ] );

    grunt.registerTask( 'dist', [ 'build-browser' ] );

    grunt.registerTask( 'default', [ 'check', 'dist' ] );
};
