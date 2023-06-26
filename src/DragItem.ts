export type CardDragItem = {
  id: string;
  index: number;
  text: string;
  columnId: string;
  type: "CARD";
};

export type ColumnDragItem = {
  id: string;
  index: number;
  text: string;
  type: "COLUMN";
};

export type DragItem = CardDragItem | ColumnDragItem;
