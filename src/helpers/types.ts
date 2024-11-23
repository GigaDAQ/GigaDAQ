// helpers/types.ts

export interface DataPoint {
  time: number;
  value: number;
}
  
export interface ExportOptions {
  format: 'csv' | 'json';
  includeHeaders: boolean;
}
  
export interface ChannelData {
  channelIndex: number;
  data: DataPoint[];
}

export interface XCursor {
  id: number;
  position: number; // X-axis position in time units
  label: string;
  refCursorId: number | null; // ID of the reference cursor
}
  