module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Mocha tests config
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['specs/**/*.js']
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'index.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load mocha for testing
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  // grunt.registerTask('default', ['uglify']);

  // Test
  grunt.registerTask('default', ['uglify', 'mochaTest']);
};
