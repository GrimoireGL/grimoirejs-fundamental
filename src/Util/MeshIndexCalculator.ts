import Vector4 from "grimoirejs-math/ref/Vector4";
const rc = 511;
const gc = rc << 8;
const bc = gc << 8;
const ac = bc << 8;
export default class MeshIndexCalculator{
  public static fromIndex(index:number):Vector4{
    return new Vector4((index & rc)/255,((index & gc)>>8)/255,((index & bc)>>16)/255,((index & ac) >> 24)/255);
  }

  public static fromColor(color:Uint8Array):number{
    return color[0] + (color[1] << 8) + (color[2] << 16) + (color[3] << 24);
  }
}
