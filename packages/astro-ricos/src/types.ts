export enum DecorationType {
  BOLD = "BOLD",
  ITALIC = "ITALIC",
  UNDERLINE = "UNDERLINE",
  SPOILER = "SPOILER",
  ANCHOR = "ANCHOR",
  MENTION = "MENTION",
  LINK = "LINK",
  COLOR = "COLOR",
  FONT_SIZE = "FONT_SIZE",
}

export enum RicosAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export enum RicosNodeType {
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

export type RicosDecoration = {
  type: DecorationType;
  linkData?: {
    link: { url: string; target?: string; rel?: Record<string, boolean> };
  };
  colorData?: { background?: string; foreground?: string };
  fontWeightValue?: number;
  italicData?: boolean;
};

export type RicosNode = {
  type: RicosNodeType;
  id: string;
  textData?: { text: string; decorations: RicosDecoration[] };
  headingData?: {
    level: number;
    textStyle?: { textAlignment: RicosAlignment };
  };
  nodes?: RicosNode[];
  imageData?: {
    image: { src: { url: string }; width: number; height: number };
    containerData: {
      alignment: RicosAlignment;
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
