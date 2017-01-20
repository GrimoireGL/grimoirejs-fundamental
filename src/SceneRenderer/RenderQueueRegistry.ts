import IRenderable from "./IRenderable";
import RenderQueue from "./RenderQueue";
export default class RenderQueueRegistry {
  private _queues: RenderQueue[] = [];

  private _renderables: IRenderable[] = [];

  public registerQueue(queue: RenderQueue): void {
    this._queues.push(queue);
    this._renderables.forEach(r => queue.add(r));
  }

  public unregisterQueue(queue: RenderQueue): void {
    const index = this._queues.indexOf(queue);
    if (index > -1) {
      this._queues.splice(index, 1);
    }
  }

  public addRenderable(rendarable: IRenderable): void {
    this._renderables.push(rendarable);
    this._queues.forEach(q => q.add(rendarable));
    rendarable.setRenderableIndex(this._renderables.length);
  }

  public removeRenderable(renderable: IRenderable): void {
    const index = this._renderables.indexOf(renderable);
    if (index === -1) {
      return; // Could not find specified renderable
    }
    this._renderables.splice(index, 1);
    this._renderables.forEach((r,i)=>{
      r.setRenderableIndex(i + 1);
    });
    this._queues.forEach(q => q.remove(renderable));
  }
}
