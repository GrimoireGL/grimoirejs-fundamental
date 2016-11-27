import IRenderArgument from "./IRenderArgument";
import ICamera from "../Camera/ICamera";
import IRenderable from "./IRenderable";

type RenderQueueElement = {
  rendarable: IRenderable;
  priortyCache: number;
};

export default class RenderQueue {
  private _rendeables: RenderQueueElement[] = [];

  constructor() {

  }

  public add(rendarable: IRenderable): void {
    this._rendeables.push({
      rendarable: rendarable,
      priortyCache: Number.MIN_VALUE
    });
  }

  public remove(rendarable: IRenderable): void {
    let index = 0;
    for (; index < this._rendeables.length; index++) {
      const r = this._rendeables[index];
      if (r.rendarable.id === rendarable.id) {
        break;
      }
    }
    if (this._rendeables.length !== index) {
      this._rendeables.splice(index, 1);
    }
  }

  public renderAll(args: IRenderArgument, cameraMoved: boolean, frameNumber: number): void {
    for (let i = 0; i < this._rendeables.length; i++) {
      this._rendeables[i].priortyCache = this._rendeables[i].rendarable.getRenderingPriorty(args.camera, cameraMoved, this._rendeables[i].priortyCache);
    }
    this._rendeables.sort((a, b) => a.priortyCache - b.priortyCache);
    this._rendeables.forEach((r) => {
      r.rendarable.render(args);
    })
  }
}
