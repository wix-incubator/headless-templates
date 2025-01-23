export enum DecorationType {
  BOLD = "BOLD",
  ITALIC = "ITALIC",
  UNDERLINE = "UNDERLINE",
  LINK = "LINK",
  COLOR = "COLOR",
}

export enum RichContentAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export enum RichContentNodeType {
  TEXT = "TEXT",
  HEADING = "HEADING",
  PARAGRAPH = "PARAGRAPH",
  BULLETED_LIST = "BULLETED_LIST",
  LIST_ITEM = "LIST_ITEM",
  IMAGE = "IMAGE",
  TABLE = "TABLE",
  TABLE_ROW = "TABLE_ROW",
  TABLE_CELL = "TABLE_CELL",
  CAPTION = "CAPTION",
}

export type RichContentDecoration = {
  type: DecorationType;
  linkData?: {
    link: { url: string; target?: string; rel?: Record<string, boolean> };
  };
  colorData?: { background?: string; foreground?: string };
  fontWeightValue?: number;
  italicData?: boolean;
};

export type RichContentNode = {
  type: RichContentNodeType;
  id: string;
  textData?: { text: string; decorations: RichContentDecoration[] };
  headingData?: {
    level: number;
    textStyle?: { textAlignment: RichContentAlignment };
  };
  nodes?: RichContentNode[];
  imageData?: {
    image: { src: { url: string }; width: number; height: number };
    containerData: {
      alignment: RichContentAlignment;
      width: { size: string };
      textWrap: boolean;
    };
  };
  bulletedListData?: { indentation: number };
  tableData?: {
    dimensions: {
      colsWidthRatio: number[];
      rowsHeight: number[];
      colsMinWidth: number[];
    };
  };
  captionData?: {};
};
