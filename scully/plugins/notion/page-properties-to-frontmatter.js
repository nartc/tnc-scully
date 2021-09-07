"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagePropertiesToFrontmatter = void 0;
const utils_1 = require("./utils");
function pagePropertiesToFrontmatter(properties) {
    const frontmatter = { published: false };
    for (const [propertyKey, propertyValue] of Object.entries(properties)) {
        const camelizedKey = utils_1.camelize(propertyKey);
        frontmatter[camelizedKey] = parsePropertyValue(propertyValue);
        if (propertyKey === 'Status') {
            frontmatter.published = propertyValue.select.name === 'Published';
        }
    }
    return frontmatter;
}
exports.pagePropertiesToFrontmatter = pagePropertiesToFrontmatter;
function parsePropertyValue(propertyValue) {
    var _a;
    switch (propertyValue.type) {
        case 'title':
            return propertyValue.title[0].plain_text;
        case 'rich_text':
            return propertyValue.rich_text[0].plain_text;
        case 'number':
            return propertyValue.number;
        case 'select':
            return (_a = propertyValue.select) === null || _a === void 0 ? void 0 : _a.name;
        case 'multi_select':
            return propertyValue.multi_select.map((multiSelectOption) => multiSelectOption.name);
        case 'date':
            const { date } = propertyValue || {};
            if (!date)
                return null;
            if (date.end) {
                return [new Date(date.start), new Date(date.end)];
            }
            return new Date(date.start);
        case 'formula':
            return formularize(propertyValue);
        case 'rollup':
            return rollup(propertyValue);
        case 'people':
            return propertyValue.people.map(personify);
        case 'files':
            return propertyValue.files.map((fileWithName) => fileWithName.name);
        case 'checkbox':
            return propertyValue.checkbox;
        case 'url':
            return propertyValue.url;
        case 'email':
            return propertyValue.email;
        case 'phone_number':
            return propertyValue.phone_number;
        case 'created_time':
            return new Date(propertyValue.created_time);
        case 'created_by':
            return personify(propertyValue.created_by);
        case 'last_edited_time':
            return new Date(propertyValue.last_edited_time);
        case 'last_edited_by':
            return personify(propertyValue.last_edited_by);
    }
}
function formularize(formulaValue) {
    let value;
    switch (formulaValue.formula.type) {
        case 'string':
            value = formulaValue.formula.string;
            break;
        case 'number':
            value = formulaValue.formula.number;
            break;
        case 'boolean':
            value = formulaValue.formula.boolean;
            break;
        case 'date':
            const { date: { start, end }, } = formulaValue.formula.date;
            if (end) {
                value = [start, end];
            }
            else {
                value = start;
            }
            break;
    }
    return value;
}
function rollup(rollupValue) {
    let value;
    switch (rollupValue.rollup.type) {
        case 'number':
            value = rollupValue.rollup.number;
            break;
        case 'date':
            const { date } = rollupValue.rollup.date || {};
            if (date.end) {
                value = [date.start, date.end];
            }
            else {
                value = date.start;
            }
            break;
        case 'array':
            value = rollupValue.rollup.array.map(parsePropertyValue);
            break;
    }
    return value;
}
function personify(user) {
    return {
        name: user.name,
        avatar: user.avatar_url,
    };
}
//# sourceMappingURL=page-properties-to-frontmatter.js.map