module.exports = function( grunt ) {
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'dist/leaflet.lwts.min.js': 'dist/leaflet.lwts.js'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'SliderControl.js'
                ],
                dest: 'dist/leaflet.lwts.js'
            }
        },
        copy: {
          css: {
            src: ['SliderControl.css'],
            dest: 'dist/leaflet.lwts.css'
          }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', ['concat', 'uglify', 'copy']);
};
