declare module 'react-plotly.js' {
    import * as React from 'react';
    import { Plotly } from 'plotly.js';
  
    interface PlotParams {
      data: Partial<Plotly.Data>[];
      layout: Partial<Plotly.Layout>;
      config?: Partial<Plotly.Config>;
      onInitialized?: (figure: any, graphDiv: HTMLElement) => void;
      onUpdate?: (figure: any, graphDiv: HTMLElement) => void;
      onPurge?: (figure: any, graphDiv: HTMLElement) => void;
      onError?: (error: any) => void;
      style?: React.CSSProperties;
      useResizeHandler?: boolean;
      debug?: boolean;
      className?: string;
    }
  
    const Plot: React.FunctionComponent<PlotParams>;
  
    export default Plot;
  }