module.exports = function(grunt) {

  var banner = [
    '/*! <%= pkg.name %> v<%= pkg.version %>\n',
    ' * <%= pkg.homepage %>\n',
    ' * \n',
    ' * Copyright: <%= pkg.author %> 2016\n',
    ' * Released under <%= pkg.license %> license\n',
    ' * https://github.com/lugolabs/tabular/blob/master/LICENCE\n',
    ' * \n',
    ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>\n',
    ' */\n'
  ].join('');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    mocha: {
      all: {
        src: ['specs/testrunner.html'],
      },
      options: {
        run:       true,
        logErrors: true
      }
    },

    jshint: {
      all: [
        'Gruntfile.js', '<%= pkg.name %>.js', 'src/**/*.js', 'specs/**/*_spec.js'
      ]
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'specs/src/**/*_spec.js'],
        tasks: ['jshint', 'concat', 'uglify', 'mocha'],
        options: {
          spawn: false,
        },
      },
    },

    concat: {
      tabular: {
        src:  ['build/intro.js', '<%= pkg.name %>.js', 'src/**/*.js', 'build/outro.js'],
        dest: 'build/<%= pkg.name %>.js',
      },
      options: {
        banner: banner
      }
    },

    uglify: {
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      },
      options: {
        banner: banner,
        sourceMap: true
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
