type Decoration = {
  type: string;
  linkData?: {
    link: { url: string; target?: string; rel?: Record<string, boolean> };
  };
  colorData?: { background?: string; foreground?: string };
  fontWeightValue?: number; // For BOLD
  italicData?: boolean; // For ITALIC
};

type Node = {
  type: string;
  id: string;
  textData?: { text: string; decorations: Decoration[] };
  headingData?: { level: number; textStyle?: { textAlignment: string } };
  nodes?: Node[];
  imageData?: {
    image: { src: { url: string }; width: number; height: number };
    containerData: {
      alignment: string;
      width: { size: string };
      textWrap: boolean;
    };
  };
  bulletedListData?: { indentation: number }; // For BULLETED_LIST
  tableData?: {
    dimensions: {
      colsWidthRatio: number[];
      rowsHeight: number[];
      colsMinWidth: number[];
    };
  }; // For TABLE
  captionData?: {}; // For CAPTION
};

const mapDecorations = (
  text: string,
  decorations: Decoration[] = []
): string => {
  decorations.forEach((decoration) => {
    switch (decoration.type) {
      case "BOLD":
        text = `<strong>${text}</strong>`;
        break;
      case "ITALIC":
        text = `<em>${text}</em>`;
        break;
      case "UNDERLINE":
        text = `<u>${text}</u>`;
        break;
      case "LINK":
        const { url, target, rel } = decoration.linkData!.link;
        const relAttrs = Object.keys(rel || {}).join(" ");
        text = `<a href="${url}" target="${
          target || "_self"
        }" rel="${relAttrs}">${text}</a>`;
        break;
      case "COLOR":
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

const processNodes = (nodes: Node[]): string =>
  nodes
    ?.map((node) => {
      switch (node.type) {
        case "TEXT":
          return mapDecorations(
            node.textData!.text,
            node.textData!.decorations
          );
        case "HEADING":
          return `<h${node.headingData!.level || 1} style="text-align: ${
            node.headingData?.textStyle?.textAlignment || "left"
          }">${processNodes(node.nodes!)}</h${node.headingData!.level || 1}>`;
        case "PARAGRAPH":
          return `<p>${processNodes(node.nodes!)}</p>`;
        case "BULLETED_LIST":
          return `<ul style="margin-left: ${
            node.bulletedListData?.indentation || 0
          }em">${processNodes(node.nodes!)}</ul>`;
        case "LIST_ITEM":
          return `<li>${processNodes(node.nodes!)}</li>`;
        case "IMAGE":
          const { src, width, height } = node.imageData!.image;
          const alignment =
            node.imageData!.containerData.alignment.toLowerCase();
          const caption = processNodes(node.nodes!); // Process caption text
          return `
            <div style="text-align: ${alignment};">
              <img src="${src.url}" width="${width}" height="${height}" alt="${
            node.imageData!.altText
          }" />
              ${caption ? `<div class="caption">${caption}</div>` : ""}
            </div>`;
        case "TABLE":
          const { colsWidthRatio, rowsHeight, colsMinWidth } =
            node.tableData!.dimensions;
          const rows = processNodes(node.nodes!);
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
                <tr>${rows
                  .split("<tr>")
                  .map((row) => row.replace("</tr>", ""))}</tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>`;
        case "TABLE_ROW":
          return `<tr>${processNodes(node.nodes!)}</tr>`;
        case "TABLE_CELL":
          return `<td>${processNodes(node.nodes!)}</td>`;
        default:
          return "";
      }
    })
    .join("") || "";

export const richContentToHtml = (richContent: { nodes: Node[] }): string =>
  processNodes(richContent.nodes);
