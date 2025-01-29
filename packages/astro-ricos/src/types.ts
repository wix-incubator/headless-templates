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
  IMAGE = "IMAGE",
  GIF = "GIF",
  VIDEO = "VIDEO",
  CAPTION = "CAPTION",
  ORDERED_LIST = "ORDERED_LIST",
  BULLETED_LIST = "BULLETED_LIST",
  LIST_ITEM = "LIST_ITEM",
  BLOCKQUOTE = "BLOCKQUOTE",
  TABLE = "TABLE",
  TABLE_ROW = "TABLE_ROW",
  TABLE_CELL = "TABLE_CELL",
  DIVIDER = "DIVIDER",
  CODE_BLOCK = "CODE_BLOCK",
  COLLAPSIBLE_LIST = "COLLAPSIBLE_LIST",
  COLLAPSIBLE_ITEM = "COLLAPSIBLE_ITEM",
  COLLAPSIBLE_ITEM_TITLE = "COLLAPSIBLE_ITEM_TITLE",
  COLLAPSIBLE_ITEM_BODY = "COLLAPSIBLE_ITEM_BODY",
}

export type RicosDecoration = {
  type: DecorationType;
  linkData?: {
    link?: {
      url: string;
    };
  };
  colorData?: { background?: string; foreground?: string };
  fontWeightValue?: number;
  italicData?: boolean;
  underlineData?: boolean;
  anchorData?: { anchor?: string };
  fontSizeData?: {
    value: number;
    unit: string;
  };
};

export type RicosNode = {
  type: RicosNodeType;
  id: string;
  textData?: { text: string; decorations: RicosDecoration[] };
  headingData?: {
    level: number;
    textStyle?: { textAlignment: RicosAlignment };
  };
  style?: {
    paddingTop?: string;
    paddingBottom?: string;
  };
  paragraphData?: {
    textStyle?: {
      lineHeight?: string;
    };
    indentation?: number;
  };
  blockquoteData?: {
    indentation?: number;
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
  gifData?: {
    original: { gif?: string; mp4?: string };
    width?: number;
    height?: number;
  };
  orderedListData?: { start?: string; offset?: string };
  bulletedListData?: { offset?: string };
  tableData?: {
    dimensions: {
      colsWidthRatio: number[];
      rowsHeight: number[];
      colsMinWidth: number[];
    };
  };
  codeBlockData?: {
    textStyle?: { textAlignment: RicosAlignment };
  };
  captionData?: {};
  collapsibleListData?: {
    initialExpandedItems: "FIRST" | "ALL" | "NONE";
    direction: "LTR" | "RTL";
  };
  dividerData?: {
    lineStyle?: "SINGLE" | "DOUBLE" | "DASHED" | "DOTTED";
    width?: "SMALL" | "MEDIUM" | "LARGE";
    alignment?: "RIGHT" | "CENTER" | "LEFT";
  };
};
