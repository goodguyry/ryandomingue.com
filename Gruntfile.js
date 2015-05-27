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
          '_includes/critical.min.css': 'css/_critical.css',
          '_includes/critical.post.min.css': 'css/_critical.post.css'
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
    'default',
    [
      // 'imagemin',
      'criticalcss',
      'cssmin'
    ]
  );

};
