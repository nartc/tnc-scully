import type {
  Block,
  ExternalFileWithCaption,
  FileWithCaption,
  RichText,
  RichTextTextInput,
} from '@notionhq/client/build/src/api-types';

export interface NotionPluginParsers {
  unorderedListWrapper?: (listItemsHtml: string) => string;
  orderedListWrapper?: (listItemsHtml: string) => string;
  paragraph?: (richTexts: RichText[]) => string;
  heading1?: (richTexts: RichText[]) => string;
  heading2?: (richTexts: RichText[]) => string;
  heading3?: (richTexts: RichText[]) => string;
  listItem?: (list: { text: RichText[]; children?: Block[] }) => string;
  embed?: (embed: { url: string; caption?: RichText[] }) => string;
  image?: (image: ExternalFileWithCaption | FileWithCaption) => string;
}

export interface NotionPluginTransformers {
  link?: (original: string, text: RichTextTextInput['text']) => string;
  file?: (file: { url: string } & { expiry_time: string }) => string;
  externalFile?: (externalFile: { url: string }) => string;
  imageCaption?: (richTexts: RichText[]) => string;
}

export interface NotionPluginAnnotate {
  bold?: (original: string) => string;
  code?: (original: string) => string;
  italic?: (original: string) => string;
  underline?: (original: string) => string;
  strikethrough?: (original: string) => string;
}

export interface NotionPluginOptions {
  parsers?: NotionPluginParsers;
  transformers?: NotionPluginTransformers;
  annotate?: NotionPluginAnnotate;
}
