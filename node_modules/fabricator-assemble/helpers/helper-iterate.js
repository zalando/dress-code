var Handlebars = require('handlebars');


/**
 * Block iteration
 * @description Repeat a block a given amount of times.
 * @example
 * {{#iterate 20}}
 *   <li>List Item {{@index}}</li>
 * {{/iterate}}
 */
module.exports = function (n, block) {
	var accum = '', data;
	for (var i = 0; i < n; ++i) {
		if (block.data) {
			data = Handlebars.createFrame(block.data || {});
			data.index = i;
		}
		accum += block.fn(i, {data: data});
	}
	return accum;
};
