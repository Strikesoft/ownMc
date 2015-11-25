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
            target: 'web/js/*.js'
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            core: {
                src: 'web/js/*.js'
            }
        },
        babel: {
            dev: {
                options: {
                    sourceMap: true,
                    modules: 'ignore'
                },
                files: {}
            }
        },
        watch: {
            src: {
                files: '<%= jscs.core.src %>',
                tasks: ['babel:dev']
            }
        }
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Default task.
    grunt.registerTask('default', ['test']);

    grunt.registerTask('test', ['eslint', 'jscs:core']);
};