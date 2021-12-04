import { Exome } from 'exome';

export const CanvasTools = {
  move: 'move',
  grab: 'grab',
} as const;

export class CanvasToolsStore extends Exome {
  public activeTool: keyof typeof CanvasTools = CanvasTools.move;

  public setActiveTool(tool: keyof typeof CanvasTools) {
    this.activeTool = tool;
  }
}

export const canvasToolsStore = new CanvasToolsStore();
