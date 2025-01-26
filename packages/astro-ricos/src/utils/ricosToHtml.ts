import {
  DecorationType,
  RicosAlignment,
  type RicosDecoration,
  type RicosNode,
  RicosNodeType,
} from "../types";
import { media } from "@wix/sdk";

const wrapWithTag = (content: string, tag: string, attributes = "") =>
  `<${tag}${attributes ? ` ${attributes}` : ""}>${content}</${tag}>`;

const applyLinkDecoration = (text: string, linkData: any) => {
  const { url, target, rel } = linkData.link;
  const relAttrs = Object.keys(rel || {}).join(" ");
  return wrapWithTag(
    text,
    "a",
    `href="${url}" target="${target || "_self"}" rel="${relAttrs}"`
  );
};

const applyColorDecoration = (text: string, colorData: any) => {
  const { background, foreground } = colorData || {};
  const style = background
    ? `background-color: ${background}`
    : foreground
    ? `color: ${foreground}`
    : "";
  return style ? wrapWithTag(text, "span", `style="${style}"`) : text;
};

const applyDecorations = (
  text: string,
  decorations: RicosDecoration[] = []
): string =>
  decorations.reduce((result, decoration) => {
    switch (decoration.type) {
      case DecorationType.BOLD:
        return wrapWithTag(result, "strong");
      case DecorationType.ITALIC:
        return wrapWithTag(result, "em");
      case DecorationType.UNDERLINE:
        return wrapWithTag(result, "u");
      case DecorationType.LINK:
        return applyLinkDecoration(result, decoration.linkData);
      case DecorationType.COLOR:
        return applyColorDecoration(result, decoration.colorData);
      default:
        if (decoration.fontWeightValue) result = wrapWithTag(result, "strong");
        if (decoration.italicData) result = wrapWithTag(result, "em");
        return result;
    }
  }, text);

const renderTextNode = (node: RicosNode) =>
  applyDecorations(node.textData!.text, node.textData!.decorations);

const renderHeadingNode = (node: RicosNode) =>
  wrapWithTag(
    renderRicosNode(node.nodes!),
    `h${node.headingData!.level || 1}`,
    `style="text-align: ${
      node.headingData?.textStyle?.textAlignment || RicosAlignment.LEFT
    }"`
  );

const renderParagraphNode = (node: RicosNode) =>
  wrapWithTag(renderRicosNode(node.nodes!), "p");

const renderBulletedListNode = (node: RicosNode) =>
  wrapWithTag(
    renderRicosNode(node.nodes!),
    "ul",
    `style="margin-left: ${node.bulletedListData?.indentation || 0}em"`
  );

const renderListItemNode = (node: RicosNode) =>
  wrapWithTag(renderRicosNode(node.nodes!), "li");

const renderImageNode = (node: RicosNode, helpers: any) => {
  const { src, width, height } = node.imageData!.image;
  const imageUrl = helpers.media.getImageUrl(
    `https://static.wixstatic.com/media/${src._id}`
  ).url;
  const alignment = node.imageData!.containerData.alignment.toLowerCase();
  const caption = renderRicosNode(node.nodes!, helpers);
  return wrapWithTag(
    `<img src="${imageUrl}" width="${width}" height="${height}" alt="${
      node.imageData!.altText
    }" />` + (caption ? wrapWithTag(caption, "div", `class="caption"`) : ""),
    "div",
    `style="text-align: ${alignment}"`
  );
};

const renderTableNode = (node: RicosNode) => {
  const { colsWidthRatio, colsMinWidth } = node.tableData!.dimensions;
  const colGroup = colsWidthRatio
    .map(
      (width, index) =>
        `<col style="width: ${width}%; min-width: ${colsMinWidth[index]}px;">`
    )
    .join("");
  const tableRows = renderRicosNode(node.nodes!);
  return `
    <table style="width: 100%; border-collapse: collapse;">
      <colgroup>${colGroup}</colgroup>
      <tbody>${tableRows}</tbody>
    </table>`;
};

const renderTableRowNode = (node: RicosNode) =>
  wrapWithTag(renderRicosNode(node.nodes!), "tr");

const renderTableCellNode = (node: RicosNode) =>
  wrapWithTag(renderRicosNode(node.nodes!), "td");

const renderCaptionNode = (node: RicosNode) =>
  wrapWithTag(renderRicosNode(node.nodes!), "div", `class="caption"`);

const renderRicosNode = (nodes: RicosNode[], helpers?: any): string =>
  nodes
    .map((node) => {
      switch (node.type) {
        case RicosNodeType.TEXT:
          return renderTextNode(node);
        case RicosNodeType.HEADING:
          return renderHeadingNode(node);
        case RicosNodeType.PARAGRAPH:
          return renderParagraphNode(node);
        case RicosNodeType.BULLETED_LIST:
          return renderBulletedListNode(node);
        case RicosNodeType.LIST_ITEM:
          return renderListItemNode(node);
        case RicosNodeType.IMAGE:
          return renderImageNode(node, helpers!);
        case RicosNodeType.TABLE:
          return renderTableNode(node);
        case RicosNodeType.TABLE_ROW:
          return renderTableRowNode(node);
        case RicosNodeType.TABLE_CELL:
          return renderTableCellNode(node);
        case RicosNodeType.CAPTION:
          return renderCaptionNode(node);
        default:
          return "";
      }
    })
    .join("");

export const ricosToHtml = async (content: {
  nodes: RicosNode[];
}): Promise<string> => {
  const helpers = { media };
  return renderRicosNode(content.nodes, helpers);
};
