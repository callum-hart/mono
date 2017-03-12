module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'out/app.css': 'src/app.scss'
        }
      }
    },
    watch: {
      files: ["src/*", "src/*/*", "yoke/*", "*.html"],
      tasks: ["sass"],
      options: {
        livereload: true
      }
    }
  });
};