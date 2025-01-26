import {
  DecorationType,
  RicosAlignment,
  type RicosDecoration,
  type RicosNode,
  RicosNodeType,
} from "../types";
import { media } from "@wix/sdk";

const objectToAttributes = (attributes: Record<string, string>): string =>
  Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

const objectToStyle = (style: Record<string, string>): string =>
  Object.entries(style)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");

const renderTag = ({
  tag,
  attributes = {},
  children = "",
  style = {},
}: {
  tag: string;
  children?: string;
  attributes?: Record<string, string>;
  style?: Record<string, string>;
}): string => {
  const attributesString = Object.keys(attributes).length
    ? ` ${objectToAttributes(attributes)}`
    : "";
  const styleString = Object.keys(style).length
    ? ` style="${objectToStyle(style)}"`
    : "";
  return `<${tag}${attributesString}${styleString}>${children}</${tag}>`;
};

const applyLinkDecoration = (text: string, linkData: any) => {
  const { url, target, rel } = linkData.link;
  const relAttrs = Object.keys(rel || {}).join(" ");
  return renderTag({
    tag: "a",
    attributes: {
      href: url,
      target: target || "_self",
      rel: relAttrs,
    },
    children: text,
  });
};

const applyColorDecoration = (text: string, colorData: any) => {
  const { background, foreground } = colorData || {};
  const style = background
    ? { "background-color": background }
    : foreground
    ? { color: foreground }
    : {};
  return Object.keys(style).length
    ? renderTag({ tag: "span", style, children: text })
    : text;
};

const applyDecorations = (
  text: string,
  decorations: RicosDecoration[] = []
): string =>
  decorations.reduce((result, decoration) => {
    switch (decoration.type) {
      case DecorationType.BOLD:
        return renderTag({
          tag: "strong",
          children: result,
          style: {
            "font-weight": `${decoration.fontWeightValue}`,
          },
        });
      case DecorationType.ITALIC:
        return renderTag({
          tag: "em",
          children: result,
          style: {
            "font-style": !decoration.italicData ? "normal" : "italic",
          },
        });
      case DecorationType.UNDERLINE:
        return renderTag({
          tag: "u",
          children: result,
          style: {
            "font-decoration": !decoration.underlineData ? "underline" : "none",
          },
        });
      case DecorationType.SPOILER:
        return renderTag({
          tag: "span",
          attributes: { role: "button" },
          style: {
            cursor: "pointer",
            filter: "blur(0.25em)",
          },
          children: result,
        });
      case DecorationType.ANCHOR:
        return renderTag({
          tag: "a",
          attributes: { name: decoration.anchorData.name },
          children: result,
        });
      case DecorationType.MENTION:
        return renderTag({
          tag: "span",
          attributes: {
            class: "mention",
            "data-mention-id": decoration.mentionData.id,
          },
          children: result,
        });
      case DecorationType.LINK:
        return applyLinkDecoration(result, decoration.linkData);
      case DecorationType.COLOR:
        return applyColorDecoration(result, decoration.colorData);
      case DecorationType.FONT_SIZE:
        return renderTag({
          tag: "span",
          style: { "font-size": `${decoration.fontSizeData.size}px` },
          children: result,
        });
      default:
        return result;
    }
  }, text);

const renderTextNode = (node: RicosNode) =>
  applyDecorations(node.textData.text, node.textData.decorations);

const renderHeadingNode = (node: RicosNode) =>
  renderTag({
    tag: `h${node.headingData.level || 1}`,
    style: {
      textAlign:
        node.headingData?.textStyle?.textAlignment || RicosAlignment.LEFT,
    },
    children: renderRicosNode(node.nodes!),
  });

const renderParagraphNode = (node: RicosNode) =>
  renderTag({ tag: "p", children: renderRicosNode(node.nodes!) });

const renderBulletedListNode = (node: RicosNode) =>
  renderTag({
    tag: "ul",
    style: { marginLeft: `${node.bulletedListData?.indentation || 0}em` },
    children: renderRicosNode(node.nodes!),
  });

const renderListItemNode = (node: RicosNode) =>
  renderTag({ tag: "li", children: renderRicosNode(node.nodes!) });

const renderImageNode = (node: RicosNode, helpers: any) => {
  const { src, width, height } = node.imageData.image;
  const imageUrl = helpers.media.getImageUrl(
    `https://static.wixstatic.com/media/${src.id}`
  ).url;
  const alignment = node.imageData.containerData.alignment.toLowerCase();
  const caption = renderRicosNode(node.nodes!, helpers);
  return renderTag({
    tag: "div",
    style: { textAlign: alignment },
    children:
      `<img src="${imageUrl}" width="${width}" height="${height}" alt="${node.imageData.altText}" />` +
      (caption
        ? renderTag({
            tag: "div",
            attributes: { class: "caption" },
            children: caption,
          })
        : ""),
  });
};

const renderTableNode = (node: RicosNode) => {
  const { colsWidthRatio, colsMinWidth } = node.tableData.dimensions;
  const colGroup = colsWidthRatio
    .map(
      (width, index) =>
        `<col style="width: ${width}%; min-width: ${colsMinWidth[index]}px;">`
    )
    .join("");
  const tableRows = renderRicosNode(node.nodes!);
  return renderTag({
    tag: "table",
    style: { width: "100%", borderCollapse: "collapse" },
    children: `<colgroup>${colGroup}</colgroup><tbody>${tableRows}</tbody>`,
  });
};

const renderTableRowNode = (node: RicosNode) =>
  renderTag({ tag: "tr", children: renderRicosNode(node.nodes!) });

const renderTableCellNode = (node: RicosNode) =>
  renderTag({ tag: "td", children: renderRicosNode(node.nodes!) });

const renderCaptionNode = (node: RicosNode) =>
  renderTag({
    tag: "div",
    attributes: { class: "caption" },
    children: renderRicosNode(node.nodes!),
  });

const renderRicosNode = (nodes: RicosNode[], helpers?: any): string =>
  nodes
    ?.map((node) => {
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
