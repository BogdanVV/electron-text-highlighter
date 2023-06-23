export type Highlight = {
  id: number;
  text: string;
  originUrl: string;
};

export type StoreSchema = {
  highlights: Highlight[];
};
