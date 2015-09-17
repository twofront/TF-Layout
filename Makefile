
main:
	browserify exports.js | uglifyjs -c > bin/tflayout.js
