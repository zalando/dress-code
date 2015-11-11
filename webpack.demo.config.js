var path = require('path');
var webpack = require('webpack');

module.exports = function(_config) {

	"use strict";

	var config = {
		entry: {
			'fabricator/scripts/f': _config.src.scripts.fabricator
		},
		output: {
			path: path.resolve(__dirname, _config.demo, 'assets'),
			filename: '[name].js'
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules|prism\.js)/,
					loaders: ['babel-loader']
				}
			]
		},
		plugins: [],
		cache: {}
	};

	if (!_config.dev) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin()
		);
	}

	return config;

};
