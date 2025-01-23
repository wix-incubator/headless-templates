import {
  DecorationType,
  RichContentAlignment,
  type RichContentDecoration,
  type RichContentNode,
  RichContentNodeType,
} from "../types";

const applyDecorations = (
  text: string,
  decorations: RichContentDecoration[] = []
): string => {
  decorations.forEach((decoration) => {
    switch (decoration.type) {
      case DecorationType.BOLD:
        text = `<strong>${text}</strong>`;
        break;
      case DecorationType.ITALIC:
        text = `<em>${text}</em>`;
        break;
      case DecorationType.UNDERLINE:
        text = `<u>${text}</u>`;
        break;
      case DecorationType.LINK:
        const { url, target, rel } = decoration.linkData!.link;
        const relAttrs = Object.keys(rel || {}).join(" ");
        text = `<a href="${url}" target="${
          target || "_self"
        }" rel="${relAttrs}">${text}</a>`;
        break;
      case DecorationType.COLOR:
        const bgColor = decoration.colorData?.background;
        const fgColor = decoration.colorData?.foreground;
        if (bgColor) {
          text = `<span style="background-color: ${bgColor};">${text}</span>`;
        } else if (fgColor) {
          text = `<span style="color: ${fgColor};">${text}</span>`;
        }
        break;
      default:
        if (decoration.fontWeightValue) {
          text = `<strong>${text}</strong>`;
        }
        if (decoration.italicData) {
          text = `<em>${text}</em>`;
        }
        break;
    }
  });
  return text;
};

const processNodeChildren = (nodes: RichContentNode[]): string =>
  nodes
    ?.map((node) => {
      switch (node.type) {
        case RichContentNodeType.TEXT:
          return applyDecorations(
            node.textData!.text,
            node.textData!.decorations
          );
        case RichContentNodeType.HEADING:
          return `<h${node.headingData!.level || 1} style="text-align: ${
            node.headingData?.textStyle?.textAlignment ||
            RichContentAlignment.LEFT
          }">${processNodeChildren(node.nodes!)}</h${
            node.headingData!.level || 1
          }>`;
        case RichContentNodeType.PARAGRAPH:
          return `<p>${processNodeChildren(node.nodes!)}</p>`;
        case RichContentNodeType.BULLETED_LIST:
          return `<ul style="margin-left: ${
            node.bulletedListData?.indentation || 0
          }em">${processNodeChildren(node.nodes!)}</ul>`;
        case RichContentNodeType.LIST_ITEM:
          return `<li>${processNodeChildren(node.nodes!)}</li>`;
        case RichContentNodeType.IMAGE:
          const { src, width, height } = node.imageData!.image;
          const alignment =
            node.imageData!.containerData.alignment.toLowerCase();
          const caption = processNodeChildren(node.nodes!);
          return `
            <div style="text-align: ${alignment};">
              <img src="${src.url}" width="${width}" height="${height}" alt="${
            node.imageData!.altText
          }" />
              ${caption ? `<div class="caption">${caption}</div>` : ""}
            </div>`;
        case RichContentNodeType.TABLE:
          const { colsWidthRatio, rowsHeight, colsMinWidth } =
            node.tableData!.dimensions;
          const tableRows = processNodeChildren(node.nodes!);
          return `
            <table style="width: 100%; border-collapse: collapse;">
              <colgroup>
                ${colsWidthRatio
                  .map(
                    (width, index) =>
                      `<col style="width: ${width}%; min-width: ${colsMinWidth[index]}px;">`
                  )
                  .join("")}
              </colgroup>
              <thead>
                <tr>${tableRows
                  .split("<tr>")
                  .map((row) => row.replace("</tr>", ""))}</tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>`;
        case RichContentNodeType.TABLE_ROW:
          return `<tr>${processNodeChildren(node.nodes!)}</tr>`;
        case RichContentNodeType.TABLE_CELL:
          return `<td>${processNodeChildren(node.nodes!)}</td>`;
        case RichContentNodeType.CAPTION:
          return `<div class="caption">${processNodeChildren(
            node.nodes!
          )}</div>`;
        default:
          return "";
      }
    })
    .join("") || "";

export const richContentToHtml = (content: {
  nodes: RichContentNode[];
}): string => processNodeChildren(content.nodes);
