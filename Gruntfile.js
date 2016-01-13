/*!
 * ownMc's Gruntfile
 * Copyright 2015 Strikesoft.
 * Licensed under MIT (https://github.com/Strikesoft/ownMc/blob/master/LICENSE)
 */

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: 'src/js/*.js'
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            core: {
                src: '<%= eslint.target %>'
            }
        },
        jasmine: {
            src : 'web/js/dist/*.js',
            options: {
                specs: 'src/js/specs/*.js',
                keepRunner: true,
                vendor: [
                    'web/js/libs/jquery.min.js',
                    'web/js/libs/tether.min.js',
                    'web/js/libs/bootstrap.min.js',
                    'web/js/libs/chosen.min.js'
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/js/',
                    src: ['*.js'],
                    dest: 'web/js/dist/',
                    ext: '.js'
                }]
            }
        },
        sass: {
            options: {
                sourcemap: 'none',
                style: 'expanded'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/scss/',
                    src: ['*.scss'],
                    dest: 'web/css/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            js: {
                files: '<%= eslint.target %>',
                tasks: ['babel:dist']
            },
            css: {
                files: 'src/scss/*.scss',
                tasks: ['sass:dist']
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Default task.
    grunt.registerTask('default', ['test']);

    grunt.registerTask('test', ['test-js']);
    grunt.registerTask('test-js', ['eslint', 'jscs:core', 'babel:dist', 'jasmine']);
};