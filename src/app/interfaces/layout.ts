import { LayoutItem } from "./layout-item";

export interface Layout {
  name: string;
  gridColumns: number;
  cols: number;
  rows: number;
  layoutItem: LayoutItem[];
}
