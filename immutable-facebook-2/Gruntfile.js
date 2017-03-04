module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks("grunt-contrib-watch");
  // grunt.loadNpmTasks("grunt-contrib-cssmin");

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'out/app.css': 'src/app.scss'
        }
      }
    },
    watch: {
      files: ["src/*", "src/immutable_css/*", "*.html"],
      tasks: ["sass"],
      options: {
        livereload: true
      }
    }
  });
};

//   grunt.initConfig({
//     cssmin: {
//       my_target: {
//         src: "out/css/app.css",
//         dest: "out/css/app.min.css"
//       }
//     },
//     watch: {
//       files: ["src/less/*", "src/less/immutable_css/*", "*.html"],
//       tasks: ["less", "cssmin"],
//       options: {
//         livereload: true
//       }
//     }
//   });
// };