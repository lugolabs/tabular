module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Mocha
    mocha: {
      all: {
        src: ['specs/testrunner.html'],
      },
      options: {
        run: true,
        logErrors: true
      }
    },

    concat: {
      tabular: {
        src: ['tabular.js', 'src/*.js'],
        dest: 'dist/tabular.js',
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/tabular.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load Jison parser
  grunt.loadNpmTasks('grunt-jison');

  // Concatinate files
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-browserify');

  // Load mocha for testing
  grunt.loadNpmTasks('grunt-mocha');

  // Default tasks
  grunt.registerTask('default', ['concat', 'uglify', 'mocha']);
};
