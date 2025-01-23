type Decoration = {
  type: string;
  linkData?: {
    link: { url: string; target?: string; rel?: Record<string, boolean> };
  };
  colorData?: { background: string };
};

type Node = {
  type: string;
  id: string;
  textData?: { text: string; decorations: Decoration[] };
  headingData?: { level: number; textStyle?: { textAlignment: string } };
  nodes?: Node[];
  imageData?: {
    image: { src: { id: string }; width: number; height: number };
    containerData: {
      alignment: string;
      width: { size: string };
      textWrap: boolean;
    };
  };
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
        text = `<span style="background-color: ${
          decoration.colorData!.background
        };">${text}</span>`;
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
          return `<ul>${processNodes(node.nodes!)}</ul>`;
        case "LIST_ITEM":
          return `<li>${processNodes(node.nodes!)}</li>`;
        case "IMAGE":
          const { src, width, height } = node.imageData!.image;
          const alignment =
            node.imageData!.containerData.alignment.toLowerCase();
          return `<div style="text-align: ${alignment};"><img src="${src.id}" width="${width}" height="${height}" /></div>`;
        default:
          return "";
      }
    })
    .join("") || "";

export const richContentToHtml = (richContent: { nodes: Node[] }): string =>
  processNodes(richContent.nodes);
