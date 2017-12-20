var _ = require('lodash');

/**
 * Get colors view model from sassdoc raw data
 *
 * @param  {Array} rawData - sassdoc items
 * @return {Object}
 */
function getColors(rawData) {

    // Regular expression matching colors variables naming pattern
    var REGEX = /^dc-(.*?)[0-9]+$/;

    var content = rawData
        .filter((item) => {
            var group = item.group[0];
            return group === 'colors'
                && item.context.type === 'variable'
                && item.context.name.match(REGEX);
        })
        .map((item) => {
            // extract color name (eg. `dc-magenta10 -> magenta`)
            item.color = item.context.name.replace(REGEX, '$1');
            item.color = _.capitalize(item.color);
            return item;
        });

    // transform colors array in a object, shaped as the view layer expect
    content = _.groupBy(content, (c) => c.color );
    Object.keys(content).forEach((color) => {
        content[color] = content[color].reduce((acc, c) => {
            acc['$' + c.context.name] = c.context.value;
            return acc;
        }, {});
    });
    return content;
}

/**
 * Get sass reference view model from sassdoc raw data
 *
 * @param  {Array} rawData - sassdoc items
 * @return {Object}
 */
function getSassReference(rawData) {
    // group sassdoc items (variables, mixins, functions, etc.) by @group
    var content = _.groupBy(rawData, (item) => item.group[0]);

    Object.keys(content).forEach((group) => {
        content[group] = content[group].map((item) => {
            // boolean flag for deprecated
            item.deprecated = typeof item.deprecated !== 'undefined'
            return item;
        });

        // group every sassdoc item by type
        content[group] = _.groupBy(content[group], (item) => item.context.type + 's');
    });

    return content;
}

module.exports = {getSassReference, getColors};
