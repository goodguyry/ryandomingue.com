'use strict';
module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/**\n' +
            ' * By <%= pkg.author %>\n' +
            ' * Full source available at <%= pkg.homepage %>\n' +
            ' */',

    cssmin: {
      options: {
        report: 'min',
        keepSpecialComments: 0
      },
      deploy: {
        files: {
          // destination: source
          '_site/css/base.min.css': '_site/css/base.css',
          '_site/css/code.min.css': '_site/css/code.css'
        },
        options: {
          banner: '<%= banner %>\n'
        }
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

  // Task to change 'url' and 'css_ext' settings in _config.yml based on the environment passed
  grunt.registerTask(
    'environment',
    'Replace file names depending on the environment.',
    function(){
      var minPattern = /css_ext:\s(.*)/,
          file = grunt.file.read('_config.yaml'),
          dev = false,
          prod = true;

      // A little feedback
      grunt.log.subhead('Configuring environment strings...\n');

      // Grab the css_ext setting
      var extMatch = file.match(minPattern);

      if (this.flags) {
        dev = this.flags['dev'],
        prod = this.flags['prod'];
      }

      function unchanged() {
        grunt.log.writeln('CSS extension unchanged');
        grunt.log.writeln();
      }

      if (extMatch.length > 1) {
        // We have a match, so proceed

        if (dev) {
          // Set appropriate css file extension
          // '.css' for development
          if (extMatch[1] === '.min.css') {
            // change it to '.css'
            file = file.replace(extMatch[1], '.css');
          } else {
            unchanged();
          }
        } else if (prod) {
          // Set appropriate css file extension
          // '.min.css' for production
          if (extMatch[1] === '.css') {
            // change it to '.min.css'
            file = file.replace(extMatch[1], '.min.css');
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

        // Done
        grunt.log.oklns('environment:' + Object.keys(this.flags) + ' setting processed in _config.yaml');
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
      'shell:build',
      'cssmin',
      'environment:dev'
    ]
  );

  // A few performance-related tasks
  grunt.registerTask(
    'perf',
    [
      'imagemin',
      // 'criticalcss',
      'cssmin:critical'
    ]
  );

  // default: environment, shell:build, cssmin
  grunt.registerTask(
    'all',
    [
      'perf',
      'environment:prod',
      'shell:build',
      'cssmin',
      'environment:dev'
    ]
  );

};
