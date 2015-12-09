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
            target: 'web/js/src/*.js'
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            core: {
                src: 'web/js/src/*.js'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'web/js/dist/login.js' : 'web/js/src/login.js',
                    'web/js/dist/register.js' : 'web/js/src/register.js',
                    'web/js/dist/adminRegistration.js' : 'web/js/src/adminRegistration.js'
                }
            }
        },
        watch: {
            src: {
                files: '<%= jscs.core.src %>',
                tasks: ['babel:dist']
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Default task.
    grunt.registerTask('default', ['test']);

    grunt.registerTask('test', ['eslint', 'jscs:core', 'babel:dist']);
};