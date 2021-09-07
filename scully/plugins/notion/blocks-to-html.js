"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRichTexts = exports.parseImage = exports.parseEmbedded = exports.parseList = exports.blocksToHtml = void 0;
const utils_1 = require("./utils");
function blocksToHtml(blocks, pluginOptions) {
    let html = '';
    let listItems = {
        type: '',
        items: '',
    };
    for (const block of blocks) {
        if (block.type !== 'bulleted_list_item' &&
            block.type !== 'numbered_list_item' &&
            listItems.type &&
            listItems.items) {
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
                utils_1.stringifyLog(block, 'to_do');
                break;
            case 'toggle':
                utils_1.stringifyLog(block, 'toggle');
                break;
            case 'child_page':
                utils_1.stringifyLog(block, 'child_page');
                break;
            case 'embed':
                html += pluginOptions.parsers.embed(block.embed);
                break;
            case 'image':
                html += pluginOptions.parsers.image(block.image);
                break;
            case 'video':
                utils_1.stringifyLog(block, 'video');
                break;
            case 'file':
                utils_1.stringifyLog(block, 'file');
                break;
            case 'pdf':
                utils_1.stringifyLog(block, 'pdf');
                break;
            case 'audio':
                utils_1.stringifyLog(block, 'audio');
                break;
        }
    }
    return html;
}
exports.blocksToHtml = blocksToHtml;
function linkify(original, text, linkTransformer) {
    if (text.link) {
        return linkTransformer(original, text);
    }
    return original;
}
function annotate(original, annotations, pluginAnnotate) {
    if (!annotations)
        return original;
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
function parseList(list, pluginOptions) {
    return `<li>${parseRichTexts(list.text, pluginOptions)}</li>`;
}
exports.parseList = parseList;
function parseEmbedded(embed) {
    if (embed.url.includes('gist.github')) {
        return `<script src='${embed.url}.js' type='text/javascript' async defer></script>`;
    }
    return `<iframe src='${embed.url}'></iframe>`;
}
exports.parseEmbedded = parseEmbedded;
function parseImage(image, imageTransformers) {
    function parseFileType(file) {
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
exports.parseImage = parseImage;
function parseRichTexts(richTexts, pluginOptions) {
    let parsedText = '';
    for (const richText of richTexts) {
        parsedText += parseRichText(richText, pluginOptions);
    }
    return parsedText;
}
exports.parseRichTexts = parseRichTexts;
function parseRichText(richText, pluginOptions) {
    function parseText(textInput) {
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
//# sourceMappingURL=blocks-to-html.js.map