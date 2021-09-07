"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelize = exports.stringifyLog = void 0;
function stringifyLog(value, context = 'notion') {
    console.log(`${context} -->`, JSON.stringify(value, null, 2));
}
exports.stringifyLog = stringifyLog;
const STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;
/**
 Returns the lowerCamelCase form of a string.
 ```javascript
 camelize('innerHTML');          // 'innerHTML'
 camelize('action_name');        // 'actionName'
 camelize('css-class-name');     // 'cssClassName'
 camelize('my favorite items');  // 'myFavoriteItems'
 camelize('My Favorite Items');  // 'myFavoriteItems'
 ```
 @method camelize
 @param {String} str The string to camelize.
 @return {String} the camelized string.
 */
function camelize(str) {
    return str
        .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr) => {
        return chr ? chr.toUpperCase() : '';
    })
        .replace(/^([A-Z])/, (match) => match.toLowerCase());
}
exports.camelize = camelize;
//# sourceMappingURL=utils.js.map