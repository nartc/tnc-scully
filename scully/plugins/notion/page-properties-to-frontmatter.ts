import type { PropertyValueMap } from '@notionhq/client/build/src/api-endpoints';
import {
  FormulaPropertyValue,
  PropertyValue,
  RollupPropertyValue,
  SelectPropertyValue,
  User,
} from '@notionhq/client/build/src/api-types';
import { camelize } from './utils';

export function pagePropertiesToFrontmatter(properties: PropertyValueMap) {
  const frontmatter: Record<string, unknown> = { published: false };

  for (const [propertyKey, propertyValue] of Object.entries(properties)) {
    const camelizedKey = camelize(propertyKey);
    frontmatter[camelizedKey] = parsePropertyValue(propertyValue);

    if (propertyKey === 'Status') {
      frontmatter.published = (propertyValue as SelectPropertyValue).select.name === 'Published';
    }
  }

  return frontmatter;
}

function parsePropertyValue(propertyValue: PropertyValue) {
  switch (propertyValue.type) {
    case 'title':
      return propertyValue.title[0].plain_text;
    case 'rich_text':
      return propertyValue.rich_text[0].plain_text;
    case 'number':
      return propertyValue.number;
    case 'select':
      return propertyValue.select?.name;
    case 'multi_select':
      return propertyValue.multi_select.map((multiSelectOption) => multiSelectOption.name);
    case 'date':
      const { date } = propertyValue || {};

      if (!date) return null;

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

function formularize(formulaValue: FormulaPropertyValue) {
  let value: unknown;

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
      const {
        date: { start, end },
      } = formulaValue.formula.date;
      if (end) {
        value = [start, end];
      } else {
        value = start;
      }
      break;
  }
  return value;
}

function rollup(rollupValue: RollupPropertyValue) {
  let value: unknown;

  switch (rollupValue.rollup.type) {
    case 'number':
      value = rollupValue.rollup.number;
      break;
    case 'date':
      const { date } = rollupValue.rollup.date || {};
      if (date.end) {
        value = [date.start, date.end];
      } else {
        value = date.start;
      }
      break;
    case 'array':
      value = rollupValue.rollup.array.map(parsePropertyValue);
      break;
  }

  return value;
}

function personify(user: User) {
  return {
    name: user.name,
    avatar: user.avatar_url,
  };
}
