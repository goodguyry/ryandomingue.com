'use strict';
module.exports = function(grunt) {

  grunt.initConfig({

    sass: {
      all: {
        options: {
          style: 'expanded'
        },
        files: {
          'temp/main.css': 'src/scss/main.scss'
        }
      }
    },

    cssmin: {
      options: {
        report: 'min',
        keepSpecialComments: 0
      },
      all: {
        files: {
          'temp/main.min.css': 'temp/main.css',
          'temp/loadCSS.min.js': '_loadCSS/loadCSS.js'
        }
      }
    },

    copy: {
      rootFiles: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['favicon.{ico,gif}', 'errors.php'],
          dest: 'web/'
        }]
      }
    },

    imagemin: {
      all: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: 'web/images/'
        }]
      }
    },

    watch: {
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass', 'cssmin', 'insertCSS'],
        options: {
          spawn: false,
        },
      },
    },

  });

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask(
    'insertCSS',
    'Insert the minified CSS into the HTML head',
    function() {
      var pattern = /\/\*\s+?insertCSS\s+?\*\//,
          htmlFile = grunt.file.read('src/index.html'),
          cssFile = grunt.file.read('temp/main.min.css');

      // Test for the special character
      if (pattern.test(htmlFile)) {
        // We have a match, so proceed
        var insertMatch = htmlFile.match(pattern);
        htmlFile = htmlFile.replace(insertMatch[0], cssFile);
        // Write changes back to css/_critical.css
        grunt.file.write('web/index.html', htmlFile);
        // A little feedback
        grunt.log.write('CSS inserted\n');
      } else {
        // Fail if no matches are found
        grunt.verbose.error('"<!-- insertCSS -->" not found');
      }
    }
  );

  grunt.registerTask(
    'clean',
    'Remove temporary directories and files.',
    function() {
      if (grunt.file.exists('temp')) {
        grunt.file.delete('temp');
        grunt.log.write('temp/ removed.\n');
      }
    }
  );

  grunt.registerTask(
    'default',
    [
      'sass',
      'cssmin',
      'insertCSS',
      'imagemin',
      'copy',
      'clean'
    ]
  );

};

