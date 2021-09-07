import type {
  Annotations,
  Block,
  ExternalFileWithCaption,
  FileWithCaption,
  RichText,
  RichTextTextInput,
} from '@notionhq/client/build/src/api-types';
import type {
  NotionPluginAnnotate,
  NotionPluginOptions,
  NotionPluginTransformers,
} from './notion-plugin-options';
import { stringifyLog } from './utils';

const defaultTransformersFactory: (pluginOptions: NotionPluginOptions) => NotionPluginTransformers =
  (pluginOptions) => ({
    file: (file) => `<img src='${file.url}' alt='${file.url}'>`,
    externalFile: (externalFile) => `<img src='${externalFile.url}' alt='${externalFile.url}'>`,
    imageCaption: (richTexts) => `<em>${parseRichTexts(richTexts, pluginOptions)}</em>`,
    link: (original, text) =>
      `<a href='${text.link.url}' rel='noopener noreferrer' target='_blank'>${original}</a>`,
  });

export const defaultPluginOptions: NotionPluginOptions = {
  parsers: {
    unorderedListWrapper: (listItemsHtml) => `<ul>${listItemsHtml}</ul>`,
    orderedListWrapper: (listItemsHtml) => `<ol>${listItemsHtml}</ol>`,
    embed: parseEmbedded,
    image: (image) => parseImage(image, defaultTransformersFactory(defaultPluginOptions)),
    heading1: (richTexts) => `<h1>${parseRichTexts(richTexts, defaultPluginOptions)}</h1>`,
    heading2: (richTexts) => `<h2>${parseRichTexts(richTexts, defaultPluginOptions)}</h2>`,
    heading3: (richTexts) => `<h3>${parseRichTexts(richTexts, defaultPluginOptions)}</h3>`,
    paragraph: (richTexts) => `<p>${parseRichTexts(richTexts, defaultPluginOptions)}</p>`,
    listItem: (list) => parseList(list, defaultPluginOptions),
  },
  annotate: {
    bold: (original) => `<strong>${original}</strong>`,
    code: (original) => `<code>${original}</code>`,
    italic: (original) => `<em>${original}</em>`,
    underline: (original) => `<span style='text-decoration: underline'>${original}</span>`,
    strikethrough: (original) => `<span style='text-decoration: line-through'>${original}</span>`,
  },
  transformers: defaultTransformersFactory(this),
};

export function blocksToHtml(
  blocks: Block[],
  pluginOptions: NotionPluginOptions = defaultPluginOptions,
): string {
  let html = '';
  let listItems = {
    type: '',
    items: '',
  };

  for (const block of blocks) {
    if (
      block.type !== 'bulleted_list_item' &&
      block.type !== 'numbered_list_item' &&
      listItems.type &&
      listItems.items
    ) {
      html +=
        listItems.type === 'bulleted_list_item'
          ? pluginOptions.parsers.unorderedListWrapper(listItems.items)
          : pluginOptions.parsers.orderedListWrapper(listItems.items);
      listItems = { type: '', items: '' };
    }

    switch (block.type) {
      case 'unsupported':
        html += `<p style='text-align: center'>Notion API Unsupported</p>`;
        break;
      case 'paragraph':
        html += pluginOptions.parsers.paragraph(block.paragraph.text);
        break;
      case 'heading_1':
        html += pluginOptions.parsers.heading1(block.heading_1.text);
        break;
      case 'heading_2':
        html += pluginOptions.parsers.heading2(block.heading_2.text);
        break;
      case 'heading_3':
        html += pluginOptions.parsers.heading3(block.heading_3.text);
        break;
      case 'bulleted_list_item':
      case 'numbered_list_item':
        listItems.type = block.type;
        listItems.items += pluginOptions.parsers.listItem(block[block.type]);
        break;
      case 'to_do':
        stringifyLog(block, 'to_do');
        break;
      case 'toggle':
        stringifyLog(block, 'toggle');
        break;
      case 'child_page':
        stringifyLog(block, 'child_page');
        break;
      case 'embed':
        html += pluginOptions.parsers.embed(block.embed);
        break;
      case 'image':
        html += pluginOptions.parsers.image(block.image);
        break;
      case 'video':
        stringifyLog(block, 'video');
        break;
      case 'file':
        stringifyLog(block, 'file');
        break;
      case 'pdf':
        stringifyLog(block, 'pdf');
        break;
      case 'audio':
        stringifyLog(block, 'audio');
        break;
    }
  }

  return html;
}

function linkify(
  original: string,
  text: RichTextTextInput['text'],
  linkTransformer: NotionPluginTransformers['link'],
) {
  if (text.link) {
    return linkTransformer(original, text);
  }

  return original;
}

function annotate(
  original: string,
  annotations: Annotations,
  pluginAnnotate: NotionPluginAnnotate,
) {
  if (!annotations) return original;

  if (annotations.bold) {
    original = pluginAnnotate.bold(original);
  }

  if (annotations.code) {
    original = pluginAnnotate.code(original);
  }

  if (annotations.italic) {
    original = pluginAnnotate.italic(original);
  }

  if (annotations.underline) {
    original = pluginAnnotate.underline(original);
  }

  if (annotations.strikethrough) {
    original = pluginAnnotate.strikethrough(original);
  }

  return original;
}

function parseList(
  list: { text: RichText[]; children?: Block[] },
  pluginOptions: NotionPluginOptions,
) {
  return `<li>${parseRichTexts(list.text, pluginOptions)}</li>`;
}

function parseEmbedded(embed: { url: string; caption?: RichText[] }) {
  if (embed.url.includes('gist.github')) {
    return `<script src='${embed.url}.js' type='text/javascript' async defer></script>`;
  }

  return `<iframe src='${embed.url}'></iframe>`;
}

function parseImage(
  image: ExternalFileWithCaption | FileWithCaption,
  imageTransformers: Omit<NotionPluginTransformers, 'link'>,
) {
  function parseFileType(file: ExternalFileWithCaption | FileWithCaption) {
    switch (file.type) {
      case 'external':
        return imageTransformers.externalFile(file.external);
      case 'file':
        return imageTransformers.file(file.file);
    }
  }

  let imageContent = parseFileType(image);

  if (image.caption) {
    imageContent += imageTransformers.imageCaption(image.caption);
  }

  return `<p>${imageContent}</p>`;
}

function parseRichTexts(richTexts: RichText[], pluginOptions: NotionPluginOptions): string {
  let parsedText = '';

  for (const richText of richTexts) {
    parsedText += parseRichText(richText, pluginOptions);
  }

  return parsedText;
}

function parseRichText(richText: RichText, pluginOptions: NotionPluginOptions) {

  function parseText(textInput: RichTextTextInput) {
    let content = textInput.text.content;
    content = linkify(content, textInput.text, pluginOptions.transformers.link);
    content = annotate(content, textInput.annotations, pluginOptions.annotate);
    return content;
  }

  switch (richText.type) {
    case 'text':
      return parseText(richText);
    case 'mention':
      break;
    case 'equation':
      break;
  }
}
