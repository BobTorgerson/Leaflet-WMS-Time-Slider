module.exports = function( grunt ) {
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'dist/leaflet.lwds.min.js': 'dist/leaflet.lwds.min.js'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'SliderControl.js'
                ],
                dest: 'dist/leaflet.lwds.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'uglify']);
};
