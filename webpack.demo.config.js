var path = require('path');
var webpack = require('webpack');

module.exports = function(mode) {

	"use strict";

	var config = {
		entry: {
			'scripts/main': './docs/demo/assets/scripts/index.js'
		},
		output: {
			path: path.resolve(__dirname, '.tmp/.demo', 'assets'),
			filename: '[name].js'
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					loaders: ['babel-loader']
				}
			]
		},
		plugins: [],
		cache: {}
	};

	if (mode === 'dist') {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin()
		);
	}
	
	return config;

};
