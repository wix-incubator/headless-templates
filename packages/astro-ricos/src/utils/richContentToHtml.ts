const mapDecorations = (text: any, decorations = []) => {
  decorations.forEach((decoration: any) => {
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
        const { url, target, rel } = decoration.linkData.link;
        const relAttrs = Object.keys(rel || {}).join(" ");
        text = `<a href="${url}" target="${
          target || "_self"
        }" rel="${relAttrs}">${text}</a>`;
        break;
      case "COLOR":
        const bgColor = decoration.colorData.background;
        text = `<span style="background-color: ${bgColor};">${text}</span>`;
        break;
      default:
        break;
    }
  });
  return text;
};

export const richContentToHtml = (richContent: any) => {
  const processNodes = (nodes: any): any => {
    if (!nodes || !Array.isArray(nodes)) return "";

    return nodes
      .map((node) => {
        switch (node.type) {
          case "TEXT":
            return mapDecorations(
              node.textData.text,
              node.textData.decorations
            );
          case "HEADING":
            const level = node.headingData.level || 1;
            return `<h${level}>${processNodes(node.nodes)}</h${level}>`;
          case "PARAGRAPH":
            return `<p>${processNodes(node.nodes)}</p>`;
          case "BULLETED_LIST":
            return `<ul>${processNodes(node.nodes)}</ul>`;
          case "LIST_ITEM":
            return `<li>${processNodes(node.nodes)}</li>`;
          case "IMAGE":
            const { src, width, height } = node.imageData.image;
            const alignment =
              node.imageData.containerData.alignment.toLowerCase();
            return `<div style="text-align: ${alignment};"><img src="${src.id}" width="${width}" height="${height}" /></div>`;
          default:
            return "";
        }
      })
      .join("");
  };

  return processNodes(richContent.nodes);
};
