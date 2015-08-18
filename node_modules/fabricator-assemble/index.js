// modules
var _ = require('lodash');
var beautifyHtml = require('js-beautify').html;
var chalk = require('chalk');
var fs = require('fs');
var globby = require('globby');
var Handlebars = require('handlebars');
var inflect = require('i')();
var matter = require('gray-matter');
var md = require('markdown-it')({ html: true, linkify: true });
var mkdirp = require('mkdirp');
var path = require('path');
var sortObj = require('sort-object');
var yaml = require('js-yaml');


/**
 * Default options
 * @type {Object}
 */
var defaults = {
	/**
	 * ID (filename) of default layout
	 * @type {String}
	 */
	layout: 'default',

	/**
	 * Layout templates
	 * @type {(String|Array)}
	 */
	layouts: 'src/views/layouts/*',

	/**
	 * Layout includes (partials)
	 * @type {String}
	 */
	layoutIncludes: 'src/views/layouts/includes/*',

	/**
	 * Pages to be inserted into a layout
	 * @type {(String|Array)}
	 */
	views: ['src/views/**/*', '!src/views/+(layouts)/**'],

	/**
	 * Materials - snippets turned into partials
	 * @type {(String|Array)}
	 */
	materials: 'src/materials/**/*',

	/**
	 * JSON or YAML data models that are piped into views
	 * @type {(String|Array)}
	 */
	data: 'src/data/**/*.{json,yml}',

	/**
	 * Markdown files containing toolkit-wide documentation
	 * @type {(String|Array)}
	 */
	docs: 'src/docs/**/*.md',

	/**
	 * Keywords used to access items in views
	 * @type {Object}
	 */
	keys: {
		materials: 'materials',
		views: 'views',
		docs: 'docs'
	},

	/**
	 * Location to write files
	 * @type {String}
	 */
	dest: 'dist',

	/**
	 * beautifier options
	 * @type {Object}
	 */
	beautifier: {
		indent_size: 1,
		indent_char: '	',
		indent_with_tabs: true
	},

	/**
	 * Function to call when an error occurs
	 * @type {Function}
	 */
	onError: null,

	/**
	 * Whether or not to log errors to console
	 * @type {Boolean}
	 */
	logErrors: false
};


/**
 * Merged defaults and user options
 * @type {Object}
 */
var options = {};


/**
 * Assembly data storage
 * @type {Object}
 */
var assembly = {
	/**
	 * Contents of each layout file
	 * @type {Object}
	 */
	layouts: {},

	/**
	 * Parsed JSON data from each data file
	 * @type {Object}
	 */
	data: {},

	/**
	 * Meta data for materials, grouped by "collection" (sub-directory); contains name and sub-items
	 * @type {Object}
	 */
	materials: {},

	/**
	 * Each material's front-matter data
	 * @type {Object}
	 */
	materialData: {},

	/**
	 * Meta data for user-created views (views in views/{subdir})
	 * @type {Object}
	 */
	views: {},

	/**
	 * Meta data (name, sub-items) for doc file
	 * @type {Object}
	 */
	docs: {}
};


/**
 * Get the name of a file (minus extension) from a path
 * @param  {String} filePath
 * @example
 * './src/materials/structures/foo.html' -> 'foo'
 * './src/materials/structures/02-bar.html' -> 'bar'
 * @return {String}
 */
var getName = function (filePath, preserveNumbers) {
	var name = path.basename(filePath, path.extname(filePath));
	return (preserveNumbers) ? name : name.replace(/^[0-9|\.\-]+/, '');
};


/**
 * Attempt to read front matter, handle errors
 * @param  {String} file Path to file
 * @return {Object}
 */
var getMatter = function (file) {
	return matter.read(file, {
		parser: require('js-yaml').safeLoad
	});
};


/**
 * Handle errors
 * @param  {Object} e Error object
 */
var handleError = function (e) {

	// default to exiting process on error
	var exit = true;

	// construct error object by combining argument with defaults
	var error = _.assign({}, {
		name: 'Error',
		reason: '',
		message: 'An error occurred',
	}, e);

	// call onError
	if (_.isFunction(options.onError)) {
		options.onError(error);
		exit = false;
	}

	// log errors
	if (options.logErrors) {
		console.error(chalk.bold.red('Error (fabricator-assemble): ' + e.message));
		exit = false;
	}

	// break the build if desired
	if (exit) {
		console.error(chalk.bold.red('Error (fabricator-assemble): ' + e.message));
		process.exit(1);
	}

};


/**
 * Build the template context by merging context-specific data with assembly data
 * @param  {Object} data
 * @return {Object}
 */
var buildContext = function (data, hash) {

	// set keys to whatever is defined
	var materials = {};
	materials[options.keys.materials] = assembly.materials;

	var views = {};
	views[options.keys.views] = assembly.views;

	var docs = {};
	docs[options.keys.docs] = assembly.docs;

	return _.assign({}, data, assembly.data, assembly.materialData, materials, views, docs, hash);

};


/**
 * Convert a file name to title case
 * @param  {String} str
 * @return {String}
 */
var toTitleCase = function(str) {
	return str.replace(/(\-|_)/g, ' ').replace(/\w\S*/g, function(word) {
		return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
	});
};


/**
 * Insert the page into a layout
 * @param  {String} page
 * @param  {String} layout
 * @return {String}
 */
var wrapPage = function (page, layout) {
	return layout.replace(/\{\%\s?body\s?\%\}/, page);
};


/**
 * Parse each material - collect data, create partial
 */
var parseMaterials = function () {

	// reset object
	assembly.materials = {};

	// get files and dirs
	var files = globby.sync(options.materials, { nodir: true, nosort: true });

	// get all directories
	var dirs = files.map(function (file) {
		return path.normalize(path.dirname(file)).split(path.sep).pop();
	});


	// stub out an object for each collection and subCollection
	files.forEach(function (file) {

		var parent = getName(path.normalize(path.dirname(file)).split(path.sep).slice(-2, -1)[0]);
		var collection = getName(path.normalize(path.dirname(file)).split(path.sep).pop());
		var isSubCollection = (dirs.indexOf(parent) > -1);

		if (!isSubCollection) {
			assembly.materials[collection] = assembly.materials[collection] || {
				name: toTitleCase(collection),
				items: {}
			};
		} else {
			assembly.materials[parent].items[collection] = assembly.materials[parent].items[collection] || {
				name: toTitleCase(collection),
				items: {}
			};
		}

	});


	// iterate over each file (material)
	files.forEach(function (file) {

		// get info
		var fileMatter = getMatter(file);
		var collection = getName(path.normalize(path.dirname(file)).split(path.sep).pop());
		var parent = path.normalize(path.dirname(file)).split(path.sep).slice(-2, -1)[0];
		var isSubCollection = (dirs.indexOf(parent) > -1);
		var id = (isSubCollection) ? collection + '.' + getName(file) : getName(file);
		var key = (isSubCollection) ? collection + '.' + getName(file, true) : getName(file, true);

		// get material front-matter, omit `notes`
		var localData = _.omit(fileMatter.data, 'notes');

		// trim whitespace from material content
		var content = fileMatter.content.replace(/^(\s*(\r?\n|\r))+|(\s*(\r?\n|\r))+$/g, '');


		// capture meta data for the material
		if (!isSubCollection) {
			assembly.materials[collection].items[key] = {
				name: toTitleCase(id),
				notes: (fileMatter.data.notes) ? md.render(fileMatter.data.notes) : '',
				data: localData
			};
		} else {
			assembly.materials[parent].items[collection].items[key] = {
				name: toTitleCase(id.split('.')[1]),
				notes: (fileMatter.data.notes) ? md.render(fileMatter.data.notes) : '',
				data: localData
			};
		}


		// store material-name-spaced local data in template context
		assembly.materialData[id.replace(/\./g, '-')] = localData;


		// replace local fields on the fly with name-spaced keys
		// this allows partials to use local front-matter data
		// only affects the compilation environment
		if (!_.isEmpty(localData)) {
			_.forEach(localData, function (val, key) {
				// {{field}} => {{material-name.field}}
				var regex = new RegExp('(\\{\\{[#\/]?)(\\s?' + key + '+?\\s?)(\\}\\})', 'g');
				content = content.replace(regex, function (match, p1, p2, p3) {
					return p1 + id.replace(/\./g, '-') + '.' + p2.replace(/\s/g, '') + p3;
				});
			});
		}

		// register the partial
		Handlebars.registerPartial(id, content);

	});


	// sort materials object alphabetically
	assembly.materials = sortObj(assembly.materials, 'order');

	for (var collection in assembly.materials) {
		assembly.materials[collection].items = sortObj(assembly.materials[collection].items, 'order');
	}

};


/**
 * Parse markdown files as "docs"
 */
var parseDocs = function () {

	// reset
	assembly.docs = {};

	// get files
	var files = globby.sync(options.docs, { nodir: true });

	// iterate over each file (material)
	files.forEach(function (file) {

		var id = getName(file);

		// save each as unique prop
		assembly.docs[id] = {
			name: toTitleCase(id),
			content: md.render(fs.readFileSync(file, 'utf-8'))
		};

	});

};


/**
 * Parse layout files
 */
var parseLayouts = function () {

	// reset
	assembly.layouts = {};

	// get files
	var files = globby.sync(options.layouts, { nodir: true });

	// save content of each file
	files.forEach(function (file) {
		var id = getName(file);
		var content = fs.readFileSync(file, 'utf-8');
		assembly.layouts[id] = content;
	});

};


/**
 * Register layout includes has Handlebars partials
 */
var parseLayoutIncludes = function () {

	// get files
	var files = globby.sync(options.layoutIncludes, { nodir: true });

	// save content of each file
	files.forEach(function (file) {
		var id = getName(file);
		var content = fs.readFileSync(file, 'utf-8');
		Handlebars.registerPartial(id, content);
	});

};


/**
 * Parse data files and save JSON
 */
var parseData = function () {

	// reset
	assembly.data = {};

	// get files
	var files = globby.sync(options.data, { nodir: true });

	// save content of each file
	files.forEach(function (file) {
		var id = getName(file);
		var content = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
		assembly.data[id] = content;
	});

};


/**
 * Get meta data for views
 */
var parseViews = function () {

	// reset
	assembly.views = {};

	// get files
	var files = globby.sync(options.views, { nodir: true });

	files.forEach(function (file) {

		var id = getName(file, true);

		// determine if view is part of a collection (subdir)
		var dirname = path.normalize(path.dirname(file)).split(path.sep).pop(),
			collection = (dirname !== options.keys.views) ? dirname : '';

		var fileMatter = getMatter(file),
			fileData = _.omit(fileMatter.data, 'notes');

		// if this file is part of a collection
		if (collection) {

			// create collection if it doesn't exist
			assembly.views[collection] = assembly.views[collection] || {
				name: toTitleCase(collection),
				items: {}
			};

			// store view data
			assembly.views[collection].items[id] = {
				name: toTitleCase(id),
				data: fileData
			};

		}

	});

};


/**
 * Register new Handlebars helpers
 */
var registerHelpers = function () {

	// get helper files
	var resolveHelper = path.join.bind(null, __dirname, 'helpers');
	var localHelpers = fs.readdirSync(resolveHelper());
	var userHelpers = options.helpers;

	// register local helpers
	localHelpers.map(function (helper) {
		var key = helper.match(/(^\w+?-)(.+)(\.\w+)/)[2];
		var path = resolveHelper(helper);
		Handlebars.registerHelper(key, require(path));
	});


	// register user helpers
	for (var helper in userHelpers) {
		if (userHelpers.hasOwnProperty(helper)) {
			Handlebars.registerHelper(helper, userHelpers[helper]);
		}
	}


	/**
	 * Helpers that require local functions like `buildContext()`
	 */

	/**
	 * `material`
	 * @description Like a normal partial include (`{{> partialName }}`),
	 * but with some additional templating logic to help with nested block iterations.
	 * The name of the helper is the singular form of whatever is defined as the `options.keys.materials`
	 * @example
	 * {{material name context}}
	 */
	Handlebars.registerHelper(inflect.singularize(options.keys.materials), function (name, context, options) {

		// remove leading numbers from name keyword
		// partials are always registered with the leading numbers removed
		var key = name.replace(/^([a-z][a-z0-9\-]*\.)?([0-9\.-]+)(.*)$/i, '$1$3');

		// attempt to find pre-compiled partial
		var template = Handlebars.partials[key],
			fn;

		// compile partial if not already compiled
		if (!_.isFunction(template)) {
			fn = Handlebars.compile(template);
		} else {
			fn = template;
		}

		// return beautified html with trailing whitespace removed
		return beautifyHtml(fn(buildContext(context, options.hash)).replace(/^\s+/, ''), options.beautifier);

	});

};


/**
 * Setup the assembly
 * @param  {Objet} options  User options
 */
var setup = function (userOptions) {

	// merge user options with defaults
	options = _.merge({}, defaults, userOptions);

	// setup steps
	registerHelpers();
	parseLayouts();
	parseLayoutIncludes();
	parseData();
	parseMaterials();
	parseViews();
	parseDocs();

};


/**
 * Assemble views using materials, data, and docs
 */
var assemble = function () {

	// get files
	var files = globby.sync(options.views, { nodir: true });

	// create output directory if it doesn't already exist
	mkdirp.sync(options.dest);

	// iterate over each view
	files.forEach(function (file) {

		var id = getName(file);

		// build filePath
		var dirname = path.normalize(path.dirname(file)).split(path.sep).pop(),
			collection = (dirname !== options.keys.views) ? dirname : '',
			filePath = path.normalize(path.join(options.dest, collection, path.basename(file)));

		// get page gray matter and content
		var pageMatter = getMatter(file),
			pageContent = pageMatter.content;

		if (collection) {
			pageMatter.data.baseurl = '..';
		}

		// template using Handlebars
		var source = wrapPage(pageContent, assembly.layouts[pageMatter.data.layout || options.layout]),
			context = buildContext(pageMatter.data),
			template = Handlebars.compile(source);

		// redefine file path if dest front-matter variable is defined
		if (pageMatter.data.dest) {
			filePath = path.normalize(pageMatter.data.dest);
		}

		// write file
		mkdirp.sync(path.dirname(filePath));
		fs.writeFileSync(filePath, template(context));

		// write a copy file if custom dest-copy front-matter variable is defined
		if (pageMatter.data['dest-copy']) {
			var copyPath = path.normalize(pageMatter.data['dest-copy']);
			mkdirp.sync(path.dirname(copyPath));
			fs.writeFileSync(copyPath, template(context));
		}
	});

};


/**
 * Module exports
 * @return {Object} Promise
 */
module.exports = function (options) {

	try {

		// setup assembly
		setup(options);

		// assemble
		assemble();

	} catch(e) {
		handleError(e);
	}

};
