module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/js/jquery.password-requirements-checker.js"],
				dest: "dist/js/jquery.password-requirements-checker.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/js/jquery.password-requirements-checker.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/js/jquery.password-requirements-checker.js"],
				dest: "dist/js/jquery.password-requirements-checker.min.js"
			},
			options: {
				banner: "<%= meta.banner %>",
                mangle: true

			}
		},

        // SASS
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/scss/',
                    src: ['base-styling.scss'],
                    dest: 'dist/css/',
                    ext: '.css'
                }]
            }
        },

        // Minify CSS base-file
        cssmin: {
            target: {
                files: {
                    'dist/css/base-styling.min.css': ['dist/css/base-styling.css']
                }
            }
        },

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
		    files: ['src/**/*'],
		    tasks: ['default']
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["concat", "uglify"]);
	grunt.registerTask("default", ["sass", "cssmin", "jshint", "build"]);
	grunt.registerTask("travis", ["default"]);

};
