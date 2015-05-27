'use strict';
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
      options: {
        report: 'min',
        keepSpecialComments: 0
      },
      critical: {
        files: {
          '_includes/critical.min.html': 'css/_critical.css',
          '_includes/critical.post.min.html': 'css/_critical.post.css'
        }
      }
    },

    criticalcss: {
      home: {
        options: {
          url: 'http://ryandomingue.dev',
          filename: '_site/css/base.css',
          outputfile: 'css/_critical.css',
          forceInclude: ['nav', 'footer'],
          width: 720,
          height: 800,
          buffer: 800*1024
        }
      },
      post: {
        options: {
          url: 'http://ryandomingue.dev/thoughts-and-ramblings/multi-tenant-wordpress.html',
          filename: '_site/css/base.css',
          outputfile: 'css/_critical.post.css',
          forceInclude: ['nav'],
          width: 720,
          height: 800,
          buffer: 800*1024
        }
      }
    },

  });

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask(
    'specialchar',
    'Replace special characters in css/_critical.css due to a bug in either PhantomJS or CriticalCSS.',
    function() {
      var pattern = /[content\s*:\s*](›)/,
          // Dancing around octal restriction...
          replacement = '"\\'+'203A"',
          file = grunt.file.read('css/_critical.css');

      // Test for the special character
      var extMatch = file.match(pattern);

      if (extMatch && extMatch.length > 1) {
        // We have a match, so proceed
        file = file.replace(extMatch[1], replacement);
        // Write changes back to css/_critical.css
        grunt.file.write('css/_critical.css', file);
        // A little feedback
        grunt.log.write('Critical CSS special character replaced.\n');
      } else {
        // Fail if no matches are found
        grunt.verbose.error('No matches found');
      }
    }
  );

  grunt.registerTask(
    'criticalwrap',
    'Wrap minified CriticalCSS files in <style> tags.',
    function() {
      var files = grunt.file.expand('_includes/critical.*.html'),
          content = '';

      if (files.length > 0) {
        for (var f in files) {
          // Read the file
          content = grunt.file.read(files[f]);
          // Write changes back to file
          grunt.file.write(files[f], '<style>'+content+'</style>');
          // Feedback
          grunt.log.write('File "' + files[f] + '" updated.\n');
        }
      } else {
        // Fail if no matches are found
        grunt.verbose.error('No matches found');
      }
    }
  );

  grunt.registerTask(
    'default',
    [
      // 'imagemin',
      'criticalcss',
      'specialchar',
      'cssmin',
      'criticalwrap'
    ]
  );

};
