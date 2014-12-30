'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
      options: {
        report: 'min',
        keepSpecialComments: 0
      },
      critical: {
        files: {
          '_includes/critical.min.css': 'css/_critical.css'
        }
      }
    },

    imagemin: {
      icons: {
        files: [{
          expand: true,
          cwd: '_temp/',
          src: ['*.{png,jpg,gif}', '**/*.{png,jpg,gif}'],
          dest: 'images/'
        }]
      }
    },

    criticalcss: {
      home: {
        options: {
          url: 'http://ryandomingue.dev',
          filename: '_site/css/base.css',
          outputfile: 'css/_critical.css',
          forceInclude: ['nav'],
          width: 1200,
          height: 800,
          buffer: 800*1024
        }
      }
    },

    shell: {
      build: {
        command: 'time jekyll build'
      },
      serve: {
        command: 'jekyll serve'
      },
    }

  });

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Task to 'sass.style' settings in _config.yaml based on the environment passed
  grunt.registerTask(
    'environment',
    'Replace config.yaml settings depending on the environment.',
    function(){
      var pattern = /style:\s(.*)/,
          file = grunt.file.read('_config.yaml'),
          dev = false,
          prod = true;

      // A little feedback
      grunt.log.subhead('Configuring environment strings...\n');

      // Grab the css_ext setting
      var extMatch = file.match(pattern);

      // Check flags
      if (this.flags) {
        dev = this.flags['dev'],
        prod = this.flags['prod'];
      }

      // Done
      function done(style) {
        grunt.log.oklns('Sass style set to "' + style + '" in _config.yaml');
      }

      function unchanged() {
        grunt.log.error('Sass style unchanged');
      }

      if (extMatch.length > 1) {
        // We have a match, so proceed

        if (dev) {
          // Set appropriate Sass output style
          // 'expanded' for development
          if (extMatch[1] === 'compressed') {
            file = file.replace(extMatch[1], 'expanded');
            // Done
            done('expanded');
          } else {
            unchanged();
          }
        } else if (prod) {
          // Set appropriate Sass output style
          // 'compressed' for production
          if (extMatch[1] === 'expanded') {
            file = file.replace(extMatch[1], 'compressed');
            // Done
            done('compressed');
          } else {
            unchanged();
          }
        } else {
          // Fail if neither `dev` nor `prod` is set
          grunt.log.error('No environment argument was passed.');
          grunt.fail.warn('Include `:dev` or `:prod` when calling `environment`');
        }

        // Write changes back to _config.yaml
        grunt.file.write('_config.yaml', file);

      } else {
        // Fail if no matches are found
        grunt.fail.warn('No matches found');
      }
    }
  );

  // default: environment, shell:build, cssmin
  grunt.registerTask(
    'default',
    [
      'environment:prod',
      'cssmin',
      'shell:build',
      'environment:dev'
    ]
  );

  // A few performance-related tasks
  grunt.registerTask(
    'perf',
    [
      'imagemin',
      // 'criticalcss'
    ]
  );

};
