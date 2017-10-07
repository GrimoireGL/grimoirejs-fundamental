import IRenderable from "./IRenderable";
import IRenderArgument from "./IRenderArgument";
type RenderElement = {
  renderable: IRenderable;
  priortyCache: number;
};

type SortedRenderablesDictionary = {
  rendarables: RenderElement[];
  lastFrame: number;
};

export default class RenderQueue {
  private _sortedRenderablesByTechniques: { [technique: string]: SortedRenderablesDictionary } = {};

  private _rendeables: IRenderable[] = [];

  public add (rendarable: IRenderable): void {
    this._rendeables.push(rendarable);
    for (const technique in this._sortedRenderablesByTechniques) {
      this._sortedRenderablesByTechniques[technique].rendarables.push({ renderable: rendarable, priortyCache: 0 });
    }
  }

  public remove (rendarable: IRenderable): void {
    this._removeFromRenderables(rendarable, this._rendeables);
    for (const tech in this._sortedRenderablesByTechniques) {
      this._removeFromRenderables(rendarable, this._sortedRenderablesByTechniques[tech].rendarables);
    }
  }

  public renderAll (args: IRenderArgument): void {
    const targetTechnique = args.sortingTechnique || args.technique;
    this._ensureCacheForTechnique(targetTechnique);
    this._sortForTechnique(args, targetTechnique);
    this._sortedRenderablesByTechniques[targetTechnique].rendarables.forEach((r) => {
      r.renderable.render(args);
    });
  }

  private _sortForTechnique (args: IRenderArgument, technique: string): void {
    const techniqueCache = this._sortedRenderablesByTechniques[technique];
    if (techniqueCache.lastFrame === args.timer.frameCount) {
      return;
    } else {
      for (let i = 0; i < techniqueCache.rendarables.length; i++) {
        techniqueCache.rendarables[i].priortyCache = techniqueCache.rendarables[i].renderable.getRenderingPriorty(args.camera, technique);
      }
      techniqueCache.rendarables.sort((a, b) => a.priortyCache - b.priortyCache);
      techniqueCache.lastFrame = args.timer.frameCount;
    }
  }

  private _ensureCacheForTechnique (technique: string): void {
    if (this._sortedRenderablesByTechniques[technique]) {
      return;
    }
    this._sortedRenderablesByTechniques[technique] = {
      lastFrame: -1,
      rendarables: this._rendeables.map(r => {
        return {
          renderable: r,
          priortyCache: -1,
        };
      }),
    };
  }

  private _removeFromRenderables (renderable: IRenderable, source: IRenderable[] | RenderElement[]): void {
    let index = 0;
    for (; index < source.length; index++) {
      const r = source[index];
      const rIndex = (r as IRenderable).index || (r as RenderElement).renderable.index;
      if (rIndex === renderable.index) {
        break;
      }
    }
    if (source.length !== index) {
      source.splice(index, 1);
    }
  }
}
