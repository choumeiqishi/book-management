module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// 合并
		concat: {
			options: {
				separator: '\n'
			},
			dist: {
				src: ['public/javascripts/*.js'],
				dest: 'public/dist/<%= pkg.name %>.js'
			}
		},
		
		// 压缩
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		
		// JS 语法检查
		jshint: {
			files: ['Gruntfile.js', 'public/javascripts/*.js', 'app.js', 'models/*.js', 'config/*.js', 'routes/*.js'],
			options: {
				globals: {
					angular: false,
					require: false,
					jQuery: false,
					$: false,
					console: true,
					module: true,
					document: true
				}
			}
		},
		
		// watch
		watch: {
			files: ['public/javascripts/*.js'],
			tasks: ['concat', 'uglify']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
