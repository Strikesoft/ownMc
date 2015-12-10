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
                src: 'src/js/*.js'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'web/js/dist/login.js' : 'src/js/login.js',
                    'web/js/dist/register.js' : 'src/js/register.js',
                    'web/js/dist/adminRegistration.js' : 'src/js/adminRegistration.js'
                }
            }
        },
        watch: {
            src: {
                files: '<%= eslint.target %>',
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