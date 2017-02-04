module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    less: {
      development: {
        files: {
          "out/css/app.css": "src/less/app.less"
        }
      }
    },
    cssmin: {
      my_target: {
        src: "out/css/app.css",
        dest: "out/css/app.min.css"
      }
    },
    watch: {
      files: ["src/less/*", "src/less/immutable_css/*", "*.html"],
      tasks: ["less", "cssmin"],
      options: {
        livereload: true
      }
    }
  });
};