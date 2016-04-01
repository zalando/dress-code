/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	__webpack_require__(2);

	/**
	 * Global `fabricator` object
	 * @namespace
	 */
	var fabricator = window.fabricator = {};

	/**
	 * Default options
	 * @type {Object}
	 */
	fabricator.options = {
		toggles: {
			labels: true,
			notes: true,
			code: false
		},
		menu: false,
		mq: '(min-width: 60em)'
	};

	// open menu by default if large screen
	fabricator.options.menu = window.matchMedia(fabricator.options.mq).matches;

	/**
	 * Feature detection
	 * @type {Object}
	 */
	fabricator.test = {};

	// test for sessionStorage
	fabricator.test.sessionStorage = (function () {
		var test = '_f';
		try {
			sessionStorage.setItem(test, test);
			sessionStorage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	})();

	// create storage object if it doesn't exist; store options
	if (fabricator.test.sessionStorage) {
		sessionStorage.fabricator = sessionStorage.fabricator || JSON.stringify(fabricator.options);
	}

	/**
	 * Cache DOM
	 * @type {Object}
	 */
	fabricator.dom = {
		root: document.querySelector('html'),
		primaryMenu: document.querySelector('.f-menu'),
		menuItems: document.querySelectorAll('.f-menu li a'),
		menuToggle: document.querySelector('.f-menu-toggle')
	};

	/**
	 * Get current option values from session storage
	 * @return {Object}
	 */
	fabricator.getOptions = function () {
		return fabricator.test.sessionStorage ? JSON.parse(sessionStorage.fabricator) : fabricator.options;
	};

	/**
	 * Build color chips
	 */
	fabricator.buildColorChips = function () {

		var chips = document.querySelectorAll('.f-color-chip'),
		    color;

		for (var i = chips.length - 1; i >= 0; i--) {
			color = chips[i].querySelector('.f-color-chip__color').innerHTML;
			chips[i].style.borderTopColor = color;
			chips[i].style.borderBottomColor = color;
		}

		return this;
	};

	/**
	 * Add `f-active` class to active menu item
	 */
	fabricator.setActiveItem = function () {

		/**
	  * @return {Array} Sorted array of menu item 'ids'
	  */
		var parsedItems = function parsedItems() {

			var items = [],
			    id,
			    href;

			for (var i = fabricator.dom.menuItems.length - 1; i >= 0; i--) {

				// remove active class from items
				fabricator.dom.menuItems[i].classList.remove('f-active');

				// get item href
				href = fabricator.dom.menuItems[i].getAttribute('href');

				// get id
				if (href.indexOf('#') > -1) {
					id = href.split('#').pop();
				} else {
					id = href.split('/').pop().replace(/\.[^/.]+$dc-/, '');
				}

				items.push(id);
			}

			return items.reverse();
		};

		/**
	  * Match the 'id' in the window location with the menu item, set menu item as active
	  */
		var setActive = function setActive() {

			var href = window.location.href,
			    items = parsedItems(),
			    id,
			    index;

			// get window 'id'
			if (href.indexOf('#') > -1) {
				id = window.location.hash.replace('#', '');
			} else {
				id = window.location.pathname.split('/').pop().replace(/\.[^/.]+$dc-/, '');
			}

			// In case the first menu item isn't the index page.
			if (id === '') {
				id = 'index';
			}

			// find the window id in the items array
			index = items.indexOf(id) > -1 ? items.indexOf(id) : 0;

			// set the matched item as active
			fabricator.dom.menuItems[index].classList.add('f-active');
		};

		window.addEventListener('hashchange', setActive);

		setActive();

		return this;
	};

	/**
	 * Click handler to primary menu toggle
	 * @return {Object} fabricator
	 */
	fabricator.menuToggle = function () {

		// shortcut menu DOM
		var toggle = fabricator.dom.menuToggle;

		var options = fabricator.getOptions();

		// toggle classes on certain elements
		var toggleClasses = function toggleClasses() {
			options.menu = !fabricator.dom.root.classList.contains('f-menu-active');
			fabricator.dom.root.classList.toggle('f-menu-active');

			if (fabricator.test.sessionStorage) {
				sessionStorage.setItem('fabricator', JSON.stringify(options));
			}
		};

		// toggle classes on click
		toggle.addEventListener('click', function () {
			toggleClasses();
		});

		// close menu when clicking on item (for collapsed menu view)
		var closeMenu = function closeMenu() {
			if (!window.matchMedia(fabricator.options.mq).matches) {
				toggleClasses();
			}
		};

		for (var i = 0; i < fabricator.dom.menuItems.length; i++) {
			fabricator.dom.menuItems[i].addEventListener('click', closeMenu);
		}

		return this;
	};

	/**
	 * Handler for preview and code toggles
	 * @return {Object} fabricator
	 */
	fabricator.allItemsToggles = function () {

		var items = {
			labels: document.querySelectorAll('[data-f-toggle="labels"]'),
			notes: document.querySelectorAll('[data-f-toggle="notes"]'),
			code: document.querySelectorAll('[data-f-toggle="code"]')
		};

		var toggleAllControls = document.querySelectorAll('.f-controls [data-f-toggle-control]');

		var options = fabricator.getOptions();

		// toggle all
		var toggleAllItems = function toggleAllItems(type, value) {

			var button = document.querySelector('.f-controls [data-f-toggle-control=' + type + ']'),
			    _items = items[type];

			for (var i = 0; i < _items.length; i++) {
				if (value) {
					_items[i].classList.remove('f-item-hidden');
				} else {
					_items[i].classList.add('f-item-hidden');
				}
			}

			// toggle styles
			if (value) {
				button.classList.add('f-active');
			} else {
				button.classList.remove('f-active');
			}

			// update options
			options.toggles[type] = value;

			if (fabricator.test.sessionStorage) {
				sessionStorage.setItem('fabricator', JSON.stringify(options));
			}
		};

		for (var i = 0; i < toggleAllControls.length; i++) {

			toggleAllControls[i].addEventListener('click', function (e) {

				// extract info from target node
				var type = e.currentTarget.getAttribute('data-f-toggle-control'),
				    value = e.currentTarget.className.indexOf('f-active') < 0;

				// toggle the items
				toggleAllItems(type, value);
			});
		}

		// persist toggle options from page to page
		for (var toggle in options.toggles) {
			if (options.toggles.hasOwnProperty(toggle)) {
				toggleAllItems(toggle, options.toggles[toggle]);
			}
		}

		return this;
	};

	/**
	 * Handler for single item code toggling
	 */
	fabricator.singleItemToggle = function () {

		var itemToggleSingle = document.querySelectorAll('.f-item-group [data-f-toggle-control]');

		// toggle single
		var toggleSingleItemCode = function toggleSingleItemCode(e) {
			var group = this.parentNode.parentNode.parentNode,
			    type = e.currentTarget.getAttribute('data-f-toggle-control');

			group.querySelector('[data-f-toggle=' + type + ']').classList.toggle('f-item-hidden');
		};

		for (var i = 0; i < itemToggleSingle.length; i++) {
			itemToggleSingle[i].addEventListener('click', toggleSingleItemCode);
		}

		return this;
	};

	/**
	 * Automatically select code when code block is clicked
	 */
	fabricator.bindCodeAutoSelect = function () {

		var codeBlocks = document.querySelectorAll('.f-item-code');

		var select = function select(block) {
			var selection = window.getSelection();
			var range = document.createRange();
			range.selectNodeContents(block.querySelector('code'));
			selection.removeAllRanges();
			selection.addRange(range);
		};

		for (var i = codeBlocks.length - 1; i >= 0; i--) {
			codeBlocks[i].addEventListener('click', select.bind(this, codeBlocks[i]));
		}

		return this;
	};

	/**
	 * Open/Close menu based on session var.
	 * Also attach a media query listener to close the menu when resizing to smaller screen.
	 */
	fabricator.setInitialMenuState = function () {

		// root element
		var root = document.querySelector('html');

		var mq = window.matchMedia(fabricator.options.mq);

		// if small screen
		var mediaChangeHandler = function mediaChangeHandler(list) {
			if (!list.matches) {
				root.classList.remove('f-menu-active');
			} else {
				if (fabricator.getOptions().menu) {
					root.classList.add('f-menu-active');
				} else {
					root.classList.remove('f-menu-active');
				}
			}
		};

		mq.addListener(mediaChangeHandler);
		mediaChangeHandler(mq);

		return this;
	};

	/**
	 * Show/hide breakpoints based on previous state.
	 * Also bind the event listeners to handle changes
	 */
	fabricator.setBreakpointsState = function () {
		var root = document.querySelector('html');

		// Set initial state
		if (localStorage.getItem("breakpoints") !== "shown") {
			root.classList.remove('dc-is-show-breakpoints');
		}

		// Breakpoint toggle
		var bpToggle = document.querySelectorAll('.js-toggle-breakpoints');

		for (var i = 0; i < bpToggle.length; i++) {
			bpToggle[i].addEventListener('click', function (e) {
				e.preventDefault();

				if (root.classList.contains("dc-is-show-breakpoints")) {
					localStorage.removeItem("breakpoints");
					root.classList.remove('dc-is-show-breakpoints');
				} else {
					localStorage.setItem("breakpoints", "shown");
					root.classList.add('dc-is-show-breakpoints');
				}
			});
		}
		return this;
	};

	/**
	 * Show/hide grid based on previous state.
	 * Also bind the event listeners to handle changes
	 */
	fabricator.setGridState = function () {
		var root = document.querySelector('html');

		// Set initial state
		if (localStorage.getItem("grid") !== "shown") {
			root.classList.remove('dc-is-show-grid');
		}

		// Breakpoint toggle
		var bpToggle = document.querySelectorAll('.js-toggle-grid');

		for (var i = 0; i < bpToggle.length; i++) {
			bpToggle[i].addEventListener('click', function (e) {
				e.preventDefault();

				if (root.classList.contains("dc-is-show-grid")) {
					localStorage.removeItem("grid");
					root.classList.remove('dc-is-show-grid');
				} else {
					localStorage.setItem("grid", "shown");
					root.classList.add('dc-is-show-grid');
				}
			});
		}
		return this;
	};

	/**
	 * Initialization
	 */
	(function () {

		// invoke
		fabricator.setInitialMenuState().menuToggle().allItemsToggles().singleItemToggle().buildColorChips().setActiveItem()
		// .bindCodeAutoSelect() [RB] commented, because is annoying for many users
		.setBreakpointsState().setGridState();
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript */
	self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);

	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */

	var Prism = (function(){

	// Private helper vars
	var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

	var _ = self.Prism = {
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			type: function (o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function (o) {
				var type = _.util.type(o);

				switch (type) {
					case 'Object':
						var clone = {};

						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}

						return clone;

					case 'Array':
						return o.map(function(v) { return _.util.clone(v); });
				}

				return o;
			}
		},

		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			/**
			 * Insert a token before another token in a language literal
			 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
			 * we cannot just provide an object, we need anobject and a key.
			 * @param inside The key (or language id) of the parent
			 * @param before The key to insert before. If not provided, the function appends instead.
			 * @param insert Object with the key/value pairs to insert
			 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
			 */
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];

				if (arguments.length == 2) {
					insert = arguments[1];

					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}

					return grammar;
				}

				var ret = {};

				for (var token in grammar) {

					if (grammar.hasOwnProperty(token)) {

						if (token == before) {

							for (var newToken in insert) {

								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						ret[token] = grammar[token];
					}
				}

				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});

				return root[inside] = ret;
			},

			// Traverse a language definition with Depth First Search
			DFS: function(o, callback, type) {
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);

						if (_.util.type(o[i]) === 'Object') {
							_.languages.DFS(o[i], callback);
						}
						else if (_.util.type(o[i]) === 'Array') {
							_.languages.DFS(o[i], callback, i);
						}
					}
				}
			}
		},

		highlightAll: function(async, callback) {
			var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, callback);
			}
		},

		highlightElement: function(element, async, callback) {
			// Find language
			var language, grammar, parent = element;

			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (parent.className.match(lang) || [,''])[1];
				grammar = _.languages[language];
			}

			if (!grammar) {
				return;
			}

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}

			var code = element.textContent;

			if(!code) {
				return;
			}

			code = code.replace(/^(?:\r?\n|\r)/,'');

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			_.hooks.run('before-highlight', env);

			if (async && self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function(evt) {
					env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

					_.hooks.run('before-insert', env);

					env.element.innerHTML = env.highlightedCode;

					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code
				}));
			}
			else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(element);

				_.hooks.run('after-highlight', env);
			}
		},

		highlight: function (text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},

		tokenize: function(text, grammar, language) {
			var Token = _.Token;

			var strarr = [text];

			var rest = grammar.rest;

			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			tokenloop: for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				var patterns = grammar[token];
				patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						lookbehindLength = 0,
						alias = pattern.alias;

					pattern = pattern.pattern || pattern;

					for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

						var str = strarr[i];

						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							break tokenloop;
						}

						if (str instanceof Token) {
							continue;
						}

						pattern.lastIndex = 0;

						var match = pattern.exec(str);

						if (match) {
							if(lookbehind) {
								lookbehindLength = match[1].length;
							}

							var from = match.index - 1 + lookbehindLength,
								match = match[0].slice(lookbehindLength),
								len = match.length,
								to = from + len,
								before = str.slice(0, from + 1),
								after = str.slice(to + 1);

							var args = [i, 1];

							if (before) {
								args.push(before);
							}

							var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias);

							args.push(wrapped);

							if (after) {
								args.push(after);
							}

							Array.prototype.splice.apply(strarr, args);
						}
					}
				}
			}

			return strarr;
		},

		hooks: {
			all: {},

			add: function (name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function (name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};

	var Token = _.Token = function(type, content, alias) {
		this.type = type;
		this.content = content;
		this.alias = alias;
	};

	Token.stringify = function(o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}

		if (_.util.type(o) === 'Array') {
			return o.map(function(element) {
				return Token.stringify(element, language, o);
			}).join('');
		}

		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};

		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}

		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}

		_.hooks.run('wrap', env);

		var attributes = '';

		for (var name in env.attributes) {
			attributes += name + '="' + (env.attributes[name] || '') + '"';
		}

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

	};

	if (!self.document) {
		if (!self.addEventListener) {
			// in Node.js
			return self.Prism;
		}
	 	// In worker
		self.addEventListener('message', function(evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code;

			self.postMessage(JSON.stringify(_.util.encode(_.tokenize(code, _.languages[lang]))));
			self.close();
		}, false);

		return self.Prism;
	}

	// Get current script and highlight
	var script = document.getElementsByTagName('script');

	script = script[script.length - 1];

	if (script) {
		_.filename = script.src;

		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}

	return self.Prism;

	})();

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}
	;
	Prism.languages.markup = {
		'comment': /<!--[\w\W]*?-->/,
		'prolog': /<\?.+?\?>/,
		'doctype': /<!DOCTYPE.+?>/,
		'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
		'tag': {
			pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/i,
			inside: {
				'tag': {
					pattern: /^<\/?[\w:-]+/i,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[\w-]+?:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
					inside: {
						'punctuation': /=|>|"/
					}
				},
				'punctuation': /\/?>/,
				'attr-name': {
					pattern: /[\w:-]+/,
					inside: {
						'namespace': /^[\w-]+?:/
					}
				}

			}
		},
		'entity': /&#?[\da-z]{1,8};/i
	};

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {

		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});
	;
	Prism.languages.css = {
		'comment': /\/\*[\w\W]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
			inside: {
				'punctuation': /[;:]/
			}
		},
		'url': /url\((?:(["'])(\\\n|\\?.)*?\1|.*?)\)/i,
		'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/,
		'string': /("|')(\\\n|\\?.)*?\1/,
		'property': /(\b|\B)[\w-]+(?=\s*:)/i,
		'important': /\B!important\b/i,
		'punctuation': /[\{\};:]/,
		'function': /[-a-z0-9]+(?=\()/i
	};

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/i,
				inside: {
					'tag': {
						pattern: /<style[\w\W]*?>|<\/style>/i,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.css
				},
				alias: 'language-css'
			}
		});

		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').*?\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: Prism.languages.markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$dc-/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, Prism.languages.markup.tag);
	};
	Prism.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.+/,
				lookbehind: true
			}
		],
		'string': /("|')(\\\n|\\?.)*?\1/,
		'class-name': {
			pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		'boolean': /\b(true|false)\b/,
		'function': {
			pattern: /[a-z0-9_]+\(/i,
			inside: {
				punctuation: /\(/
			}
		},
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,
		'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,
		'ignore': /&(lt|gt|amp);/i,
		'punctuation': /[{}[\];(),.:]/
	};
	;
	Prism.languages.javascript = Prism.languages.extend('clike', {
		'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/,
		'function': /(?!\d)[a-z0-9_$dc-]+(?=\()/i
	});

	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($dc-|[\r\n,.;})]))/,
			lookbehind: true
		}
	});

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'script': {
				pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/i,
				inside: {
					'tag': {
						pattern: /<script[\w\W]*?>|<\/script>/i,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.javascript
				},
				alias: 'language-javascript'
			}
		});
	}
	;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// /* Demo Dropdowns and Dropups (button-dropdown.html) */
	"use strict";

	$(document).ready(function () {
	    $("#dropdown-example").click(function (e) {
	        e.preventDefault();
	        $("#dropdown-example-list").toggle();
	    });
	    $("#dropup-example").click(function (e) {
	        e.preventDefault();
	        $("#dropup-example-list").toggle();
	    });
	});

/***/ }
/******/ ]);