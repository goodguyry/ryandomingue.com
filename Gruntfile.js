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
          'temp/main.min.css': 'temp/main.css'
        }
      }
    },

    uglify: {
      loadCSS: {
        files: {
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
    'Insert the minified CSS and loadCSS into the HTML head',
    function() {
      var cssPattern = /\/\*\s+?insertCSS\s+?\*\//,
          loadCSSPattern = /<![-]{2}\s+?loadCSS\s+?[-]{2}>/,
          htmlFile = grunt.file.read('src/index.html'),
          cssFile = grunt.file.read('temp/main.min.css'),
          loadCSS = grunt.file.read('temp/loadCSS.min.js'),
          script = [
            '<script>',
            loadCSS,
            'loadCSS( "http://fonts.googleapis.com/css?family=Merriweather:400,700" );',
            '</script>'
          ];

      // Test for the insertCSS placeholder
      if (cssPattern.test(htmlFile)) {
        // We have a match, so proceed
        var insertMatch = htmlFile.match(cssPattern);
        htmlFile = htmlFile.replace(insertMatch[0], cssFile);
        // A little feedback
        grunt.log.write('CSS inserted\n');
      } else {
        // Fail if no matches are found
        grunt.verbose.error('"/* insertCSS */" not found');
      }

      // Test for the loadCSSplaceholder
      if (loadCSSPattern.test(htmlFile)) {
        // We have a match, so proceed
        var loadMatch = htmlFile.match(loadCSSPattern);
        htmlFile = htmlFile.replace(loadMatch[0], script.join(''));
        // A little feedback
        grunt.log.write('loadCSS inserted\n');
      } else {
        // Fail if no matches are found
        grunt.verbose.error('"<!-- loadCSS -->" not found');
      }

      // Write changes back to css/_critical.css
      grunt.file.write('web/index.html', htmlFile);
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
      'uglify',
      'insertCSS',
      'imagemin',
      'copy',
      'clean'
    ]
  );

};

