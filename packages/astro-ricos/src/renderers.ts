import { renderNodeStyle, renderTextStyle } from "./styles";
import { DecorationType, type RicosNode, RicosNodeType } from "./types";
import { renderTag } from "./utils";

export const renderTextNode = (node: RicosNode): string => {
  const { text, decorations } = node.textData ?? {};

  return (
    decorations?.reduce((result, decoration) => {
      const styles = {
        [DecorationType.BOLD]: {
          "font-weight": `${decoration.fontWeightValue}`,
        },
        [DecorationType.ITALIC]: {
          "font-style": decoration.italicData ? "italic" : "normal",
        },
        [DecorationType.UNDERLINE]: {
          "text-decoration": decoration.underlineData ? "underline" : "none",
        },
        [DecorationType.SPOILER]: { cursor: "pointer", filter: "blur(0.25em)" },
        [DecorationType.COLOR]: {
          ...(decoration.colorData?.background && {
            "background-color": decoration.colorData.background,
          }),
          ...(decoration.colorData?.foreground && {
            color: decoration.colorData.foreground,
          }),
        },
        [DecorationType.FONT_SIZE]: {
          "font-size": `${decoration.fontSizeData?.value}${decoration.fontSizeData?.unit}`,
        },
      }[decoration.type];

      const tag = {
        [DecorationType.BOLD]: "strong",
        [DecorationType.ITALIC]: "em",
        [DecorationType.UNDERLINE]: "u",
        [DecorationType.SPOILER]: "span",
        [DecorationType.LINK]: "a",
        [DecorationType.COLOR]: "span",
        [DecorationType.FONT_SIZE]: "span",
      }[decoration.type];

      return renderTag({
        tag,
        children: result,
        style: styles ?? {},
        attributes:
          decoration.type === DecorationType.LINK
            ? {
                href: decoration.linkData?.link.url,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {},
      });
    }, text) ?? text
  );
};

const renderParagraphNode = (node: RicosNode) =>
  renderTag({
    tag: "p",
    children: renderRicosNode(node.nodes),
    attributes: {
      id: node.id,
    },
    style: {
      ...renderNodeStyle(node.style),
      ...renderTextStyle(node.paragraphData),
    },
  });

const renderHeadingNode = (node: RicosNode) =>
  renderTag({
    tag: `h${node.headingData.level || 1}`,
    style: {
      ...renderTextStyle(node.headingData),
    },
    children: renderRicosNode(node.nodes!),
  });

const renderOrderedListNode = (node: RicosNode) =>
  renderTag({
    tag: "ol",
    attributes: {
      ...(node.orderedListData?.start && {
        start: node.orderedListData?.start,
      }),
      "arial-level": node.orderedListData?.offset + 1 || "1",
    },
    children: renderRicosNode(node.nodes!),
  });

const renderBulletedListNode = (node: RicosNode) =>
  renderTag({
    tag: "ul",
    attributes: {
      "arial-level": node.orderedListData?.offset + 1 || "1",
    },
    children: renderRicosNode(node.nodes!),
  });

const renderListItemNode = (node: RicosNode) =>
  renderTag({ tag: "li", children: renderRicosNode(node.nodes!) });

const renderCaptionNode = (node: RicosNode) =>
  renderTag({
    tag: "figcaption",
    children: renderRicosNode(node.nodes!),
    style: {
      ...renderNodeStyle(node.style),
      ...renderTextStyle(node.captionData),
    },
  });

const renderImageNode = (node: RicosNode, helpers: any) => {
  const { src, width, height } = node.imageData.image;
  const imageUrl = helpers.media.getImageUrl(
    `https://static.wixstatic.com/media/${src.id}`
  ).url;
  const alignment = node.imageData.containerData.alignment.toLowerCase();
  const caption = renderRicosNode(node.nodes!, helpers);

  return renderTag({
    tag: "figure",
    style: {
      "text-align": alignment,
      ...(node.imageData.containerData.width.size === "ORIGINAL" && {
        width: `${width}px`,
        height: `${height}px`,
      }),
    },
    children:
      `<img src="${imageUrl}" width="${width}" height="${height}" alt="${node.imageData.altText}" />` +
      (caption
        ? renderTag({
            tag: "figcaption",
            children: caption,
          })
        : ""),
  });
};

const renderGifNode = (node: RicosNode) => {
  const { width, height } = node.gifData;
  const url = node.gifData.original.gif || node.gifData.original.mp4;
  const alignment = node.gifData.containerData.alignment.toLowerCase();

  return renderTag({
    tag: "figure",
    style: {
      "text-align": alignment,
      width: `${width}px`,
      height: `${height}px`,
    },
    children: `<img src="${url}" width="${width}" height="${height}" />`,
  });
};

const renderVideoNode = (node: RicosNode, helpers: any): string => {
  const { videoData } = node;
  const { src } = videoData.video;
  const alignment = videoData.containerData.alignment.toLowerCase();
  const isYouTube =
    src.url?.includes("youtube.com") || src.url?.includes("youtu.be");

  if (isYouTube) {
    const youtubeId =
      src.url.match(/[?&]v=([^&#]+)/)?.[1] || src.url.split("/").pop();
    return renderTag({
      tag: "figure",
      style: { "text-align": alignment },
      children: `
        <iframe
         loading="lazy"
          src="https://www.youtube.com/embed/${youtubeId}?autoplay=0" 
          frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen aria-label="Embedded YouTube video">
        </iframe>
      `,
    });
  } else {
    const videoUrl = helpers.media.getVideoUrl(
      `https://video.wixstatic.com/${src.id}`
    ).url;
    return renderTag({
      tag: "figure",
      style: { "text-align": alignment },
      children: `
        <video preload="none" controls>
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `,
    });
  }
};

const renderBlockquoteNode = (node: RicosNode) =>
  renderTag({
    tag: "blockquote",
    children: renderRicosNode(node.nodes!),
    style: {
      ...renderNodeStyle(node.style),
      ...(node.blockquoteData?.indentation && {
        "margin-inline-start": `${node.blockquoteData?.indentation * 1.5}em`,
      }),
    },
  });

const renderTableNode = (node: RicosNode) => {
  const { colsWidthRatio, colsMinWidth } = node.tableData.dimensions;
  const colGroup = colsWidthRatio
    .map(
      (width, index) =>
        `<col style="${width ? "width: " + width + "px;" : ""} ${
          colsMinWidth[index] ? "min-width: " + colsMinWidth[index] + "px;" : ""
        }">`
    )
    .join("");
  const tableRows = renderRicosNode(node.nodes!);
  return renderTag({
    tag: "table",
    style: { width: "100%" },
    children: `<colgroup>${colGroup}</colgroup><tbody>${tableRows}</tbody>`,
  });
};

const renderTableRowNode = (node: RicosNode) =>
  renderTag({ tag: "tr", children: renderRicosNode(node.nodes!) });

const renderTableCellNode = (node: RicosNode) =>
  renderTag({ tag: "td", children: renderRicosNode(node.nodes!) });

const renderCodeBlockNode = (node: RicosNode) =>
  renderTag({
    tag: "pre",
    children: renderTag({
      tag: "code",
      children: renderRicosNode(node.nodes!),
    }),
    style: {
      ...renderNodeStyle(node.style),
      ...renderTextStyle(node.codeBlockData),
    },
  });

const renderCollapsibleListNode = (node: RicosNode): string => {
  const { initialExpandedItems } = node.collapsibleListData;

  const children = node.nodes
    .map((childNode, index) => {
      if (childNode.type === RicosNodeType.COLLAPSIBLE_ITEM) {
        return renderCollapsibleItemNode(
          childNode,
          initialExpandedItems === "FIRST" && index === 0,
          {
            ...node.collapsibleListData,
          }
        );
      }
      return "";
    })
    .join("");

  return renderTag({
    tag: "div",
    children,
  });
};

const renderCollapsibleItemNode = (
  node: RicosNode,
  isOpen: boolean,
  collapsibleListData?: any
): string => {
  const titleNode = node.nodes.find(
    (child) => child.type === RicosNodeType.COLLAPSIBLE_ITEM_TITLE
  );
  const bodyNode = node.nodes.find(
    (child) => child.type === RicosNodeType.COLLAPSIBLE_ITEM_BODY
  );
  const title = titleNode ? renderRicosNode([titleNode]) : "";
  const body = bodyNode ? renderRicosNode([bodyNode]) : "";

  return renderTag({
    tag: "details",
    attributes: {
      ...(isOpen && { open: "true" }),
      ...(collapsibleListData.direction && {
        dir: collapsibleListData.direction.toLowerCase(),
      }),
    },
    children:
      renderTag({
        tag: "summary",
        children: title,

        style: {
          "list-style-position": "unset",
        },
      }) + body,
  });
};

const renderDividerNode = (node: RicosNode): string => {
  const { dividerData } = node;
  const { lineStyle, width, alignment } = dividerData;

  const alignmentStyles = {
    LEFT: {
      "margin-left": "0",
    },
    RIGHT: {
      "margin-left": "auto",
    },
    CENTER: {
      margin: "0 auto",
    },
  };

  const widthStyles = {
    SMALL: {
      width: "10%;",
    },
    MEDIUM: {
      width: "40%;",
    },
    LARGE: {
      width: "100%;",
    },
  };

  const lineStyles = {
    SINGLE: {
      "border-top": "1px solid #000;",
    },
    DOUBLE: {
      "border-top": "3px double #000;",
    },
    DASHED: {
      "border-top": "1px dashed #000;",
    },
    DOTTED: {
      "border-top": "1px dotted #000;",
    },
  };

  return renderTag({
    tag: "div",
    style: {
      ...alignmentStyles[alignment || "CENTER"],
      ...lineStyles[lineStyle || "SINGLE"],
      ...widthStyles[width || "LARGE"],
      padding: "14px 0",
    },
    attributes: {
      role: "separator",
      "aria-label": "divider",
    },
  });
};

const renderSpanNode = (node: RicosNode): string =>
  renderTag({
    tag: "span",
    children: renderRicosNode(node.nodes),
  });

export const renderRicosNode = (nodes: RicosNode[], helpers?: any): string =>
  nodes
    ?.map((node) => {
      switch (node.type) {
        case RicosNodeType.TEXT:
          return renderTextNode(node);
        case RicosNodeType.HEADING:
          return renderHeadingNode(node);
        case RicosNodeType.PARAGRAPH:
          return renderParagraphNode(node);
        case RicosNodeType.IMAGE:
          return renderImageNode(node, helpers!);
        case RicosNodeType.GIF:
          return renderGifNode(node);
        case RicosNodeType.VIDEO:
          return renderVideoNode(node, helpers!);
        case RicosNodeType.CAPTION:
          return renderCaptionNode(node);
        case RicosNodeType.ORDERED_LIST:
          return renderOrderedListNode(node);
        case RicosNodeType.BULLETED_LIST:
          return renderBulletedListNode(node);
        case RicosNodeType.LIST_ITEM:
          return renderListItemNode(node);
        case RicosNodeType.BLOCKQUOTE:
          return renderBlockquoteNode(node);
        case RicosNodeType.DIVIDER:
          return renderDividerNode(node);
        case RicosNodeType.TABLE:
          return renderTableNode(node);
        case RicosNodeType.TABLE_ROW:
          return renderTableRowNode(node);
        case RicosNodeType.TABLE_CELL:
          return renderTableCellNode(node);
        case RicosNodeType.CODE_BLOCK:
          return renderCodeBlockNode(node);
        case RicosNodeType.COLLAPSIBLE_LIST:
          return renderCollapsibleListNode(node);
        case RicosNodeType.COLLAPSIBLE_ITEM:
          return renderCollapsibleItemNode(node, false);
        default:
          return renderSpanNode(node);
      }
    })
    .join("");
