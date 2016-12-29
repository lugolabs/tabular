module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mocha: {
      all: {
        src: ['specs/testrunner.html'],
      },
      options: {
        run:            true,
        log:            true,
        logErrors:      true,
        growlOnSuccess: true
      }
    },

    jshint: {
      all: [
        'Gruntfile.js', '<%= pkg.name %>.js', 'VERSION.js', 'src/*.js', 'specs/**/*_spec.js'
      ]
    },

    watch: {
      scripts: {
        files: ['<%= pkg.name %>.js', 'VERSION.js', 'src/*.js', 'specs/**/*_spec.js'],
        tasks: ['jshint', 'concat', 'mocha'],
        options: {
          spawn: false,
        },
      },
    },

    concat: {
      tabular: {
        src: ['<%= pkg.name %>.js', 'VERSION.js', 'src/*.js'],
        dest: 'build/<%= pkg.name %>.js',
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Watching changes
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Check your coding
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Concatinate files
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load mocha for testing
  grunt.loadNpmTasks('grunt-mocha');

  // Default tasks
  grunt.registerTask('default', ['concat', 'uglify', 'mocha']);
};
