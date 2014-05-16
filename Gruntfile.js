module.exports = function( grunt ) {
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'dist/leaflet.lwts.min.js': 'dist/leaflet.lwts.min.js'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'SliderControl.js'
                ],
                dest: 'dist/leaflet.lwts.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'uglify']);
};
