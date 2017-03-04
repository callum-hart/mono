
var transformRuleset = function(less, ruleset, transformation) {
  var result = "";

  console.log(new less.ParseTree(less.tree).toCSS());

  // console.log(ruleset);

  ruleset.ruleset.rules.forEach(function(rule) {

    var aa = new less.tree.Ruleset(null, rule);

    // console.log(new less.ParseTree(less.tree).toCSS());

    console.log("----------------------------");

    // console.log(aa.genCSS(this, ""));
    // console.log(result);
    console.log("----------------------------");

    // less.render(rule).then(function(output) {
    //   console.log(output);
    // }

    var name = new less.tree.Ruleset(rule).selectors.name[0].value,
        value = new less.tree.Ruleset(rule).selectors.value.value;

    result += name + ": " + value + " /* " + transformation + " */;\n";
  });

  return result;
}

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    less: {
      development: {
        files: {
          "out/css/app.css": "src/less/app.less"
        },
        options: {
          customFunctions: {
            bar: function(less, color) {
              return "color: " + color.value + "/* some comment */;\n";
            },
            immutable: function(less, ruleset) {
              return transformRuleset(less, ruleset, 'immutable');
            },
            protected: function(less, ruleset) {
              return transformRuleset(less, ruleset, 'protected');
            }

            // Todo: add functions: public, override, mutate, fallback etc...
          }
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