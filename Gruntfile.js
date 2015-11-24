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
        pkg: grunt.file.readJSON('package.json')
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Default task.
    grunt.registerTask('default', ['']);

    grunt.registerTask('test', ['']);
};