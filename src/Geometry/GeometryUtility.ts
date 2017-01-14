export default class GeometryUtility {
  public static linesFromTriangles(indices: number[]): number[] {
    const ret: number[] = [];
    const ic: number[] = new Array(3);
    let i = 0;
    for (let index of indices) {
      ic[i % 3] = index;
      if (i % 3 === 2) {
        const a = ic[0], b = ic[1], c = ic[2];
        Array.prototype.push.apply(ret, [a, b, b, c, c, a]);
      }
      i++;
    }
    return ret;
  }
  public static plane(center: number[], normal: number[], up: number[], right: number[], hdiv: number = 1, vdiv: number = 1): number[] {
    const ret = new Array(8 * (hdiv + 1) * (vdiv + 1));
    const sp = [center[0] - up[0] - right[0], center[1] - up[1] - right[1], center[2] - up[2] - right[2]];
    const sr = [right[0] / hdiv * 2, right[1] / hdiv * 2, right[2] / hdiv * 2];
    const su = [up[0] / vdiv * 2, up[1] / vdiv * 2, up[2] / vdiv * 2];
    for (let v = 0; v < vdiv + 1; v++) {
      for (let h = 0; h < hdiv + 1; h++) {
        const fi = ((hdiv + 1) * v + h) * 8;
        ret[fi + 0] = sp[0] + sr[0] * h + su[0] * v;
        ret[fi + 1] = sp[1] + sr[1] * h + su[1] * v;
        ret[fi + 2] = sp[2] + sr[2] * h + su[2] * v;

        ret[fi + 3] = normal[0];
        ret[fi + 4] = normal[1];
        ret[fi + 5] = normal[2];

        ret[fi + 6] = 1 / hdiv * h;
        ret[fi + 7] = 1 - 1 / vdiv * v;
      }
    }
    return ret;
  }

  public static cylinderPlane(center: number[], normal: number[], up: number[], right: number[], divide: number, order: number): number[] {
    const ret = new Array(32);
    const sp = [center[0] - up[0] - right[0], center[1] - up[1] - right[1], center[2] - up[2] - right[2]];
    const sr = [right[0] * 2, right[1] * 2, right[2] * 2];
    const su = [up[0] * 2, up[1] * 2, up[2] * 2];
    for (let v = 0; v < 2; v++) {
      for (let h = 0; h < 2; h++) {
        const fi = (2 * v + h) * 8;
        ret[fi + 0] = sp[0] + sr[0] * h + su[0] * v;
        ret[fi + 1] = sp[1] + sr[1] * h + su[1] * v;
        ret[fi + 2] = sp[2] + sr[2] * h + su[2] * v;

        const l = Math.tan(Math.PI / divide) / Math.sin(Math.PI / divide);
        if (h == 0) {
          ret[fi + 3] = normal[0] - l * right[0];
          ret[fi + 4] = normal[1] - l * right[1];
          ret[fi + 5] = normal[2] - l * right[2];
        } else {
          ret[fi + 3] = normal[0] + l * right[0];
          ret[fi + 4] = normal[1] + l * right[1];
          ret[fi + 5] = normal[2] + l * right[2];
        }


        ret[fi + 6] = 1 / divide * (order + 1 + h);
        ret[fi + 7] = v == 0 ? 1 : 0;
      }
    }
    return ret;
  }
  public static triangle(center: number[], normal: number[], up: number[], right: number[]): number[] {
    const ret = new Array(24);
    const delta = 2 * Math.PI / 3;
    for (let i = 0; i < 3; i++) {
      const s = Math.sin(delta * i);
      const c = Math.cos(delta * i);
      ret[0 + 8 * i] = center[0] + c * up[0] + s * right[0];
      ret[1 + 8 * i] = center[1] + c * up[1] + s * right[1];
      ret[2 + 8 * i] = center[2] + c * up[2] + s * right[2];
      ret[3 + 8 * i] = normal[0];
      ret[4 + 8 * i] = normal[1];
      ret[5 + 8 * i] = normal[2];
      ret[6 + 8 * i] = 0.5 + (c * up[0] + s * right[0]) / 2;
      ret[7 + 8 * i] = 0.5 + (c * up[1] + s * right[1]) / 2;
    }
    return ret;
  }

  public static coneTriangle(center: number[], normal: number[], up: number[], right: number[], divide: number, order: number): number[] {
    const ret = new Array(24);
    const delta = 2 * Math.PI / 3;
    for (let i = 0; i < 3; i++) {
      const s = Math.sin(delta * i);
      const c = Math.cos(delta * i);
      ret[0 + 8 * i] = center[0] + c * up[0] + s * right[0];
      ret[1 + 8 * i] = center[1] + c * up[1] + s * right[1];
      ret[2 + 8 * i] = center[2] + c * up[2] + s * right[2];

      ret[3 + 8 * i] = normal[0];
      ret[4 + 8 * i] = normal[1];
      ret[5 + 8 * i] = normal[2];
      const k = Math.pow(2, 0.5);
      const l = Math.tan(Math.PI / divide) / Math.sin(Math.PI / divide) / Math.pow(3, 0.5) * 2;
      if (i == 0) {
        ret[3 + 8 * i] = normal[0];
        ret[4 + 8 * i] = normal[1];
        ret[5 + 8 * i] = normal[2];
        ret[6 + 8 * i] = 0;
        ret[7 + 8 * i] = 0;
      } else if (i == 1) {
        ret[3 + 8 * i] = normal[0] / k + l * right[0];
        ret[4 + 8 * i] = normal[1] / k + l * right[1];
        ret[5 + 8 * i] = normal[2] / k + l * right[2];
        ret[6 + 8 * i] = Math.cos(-Math.PI / divide / 2 * (order + 1));
        ret[7 + 8 * i] = Math.sin(-Math.PI / divide / 2 * (order + 1));
      } else {
        ret[3 + 8 * i] = normal[0] / k - l * right[0];
        ret[4 + 8 * i] = normal[1] / k - l * right[1];
        ret[5 + 8 * i] = normal[2] / k - l * right[2];
        ret[6 + 8 * i] = Math.cos(-Math.PI / divide / 2 * (order));
        ret[7 + 8 * i] = Math.sin(-Math.PI / divide / 2 * (order));
      }
    }
    return ret;
  }

  public static triangleIndex(offset: number) {
    const ret = new Array(3);
    ret[0] = offset;
    ret[1] = offset + 2;
    ret[2] = offset + 1;
    return ret;
  }

  public static planeIndex(offset: number = 0, hdiv: number = 0, vdiv: number = 0): number[] {
    const ret = new Array(6 * hdiv * vdiv);
    for (let v = 0; v < vdiv; v++) {
      for (let h = 0; h < hdiv; h++) {
        const fi = (hdiv * v + h) * 6;
        const ld = offset + (hdiv + 1) * v + h;
        const lu = offset + (hdiv + 1) * (v + 1) + h;
        ret[fi + 0] = ld;
        ret[fi + 1] = ld + 1;
        ret[fi + 2] = lu;
        ret[fi + 3] = lu;
        ret[fi + 4] = ld + 1;
        ret[fi + 5] = lu + 1;
      }
    }
    return ret;
  }

  public static circle(center: number[], normal: number[], up: number[], right: number[], divide: number = 5): number[] {
    const ret = new Array((3 + divide) * 6);
    // center
    ret[0] = center[0];
    ret[1] = center[1];
    ret[2] = center[2];

    ret[3] = normal[0];
    ret[4] = normal[1];
    ret[5] = normal[2];

    ret[6] = 0.5;
    ret[7] = 0.5;
    const delta = 2 * Math.PI / divide;
    for (let v = 0; v < divide + 1; v++) {
      const fi = 8 + v * 8;
      const s = Math.sin(delta * v);
      const c = Math.cos(delta * v);
      ret[fi + 0] = center[0] + c * up[0] + s * right[0];
      ret[fi + 1] = center[1] + c * up[1] + s * right[1];
      ret[fi + 2] = center[2] + c * up[2] + s * right[2];

      ret[fi + 3] = normal[0];
      ret[fi + 4] = normal[1];
      ret[fi + 5] = normal[2];

      ret[fi + 6] = 0.5 + 0.5 * s;
      ret[fi + 7] = 0.5 - 0.5 * c;
    }
    return ret;
  }

  public static circleIndex(offset: number, divide: number): number[] {
    const ret = new Array(3 * divide);
    for (let i = 0; i < divide; i++) {
      ret[3 * i + 0] = offset;
      ret[3 * i + 1] = offset + (i + 2);
      ret[3 * i + 2] = offset + (i + 1);
    }
    return ret;
  }

  public static sphere(center: number[], up: number[], right: number[], forward: number[], vdiv: number = 3, hdiv: number = 3): number[] {
    const ret = new Array((vdiv * hdiv + 2) * 8);
    //top(0)
    ret[0] = center[0] + up[0];
    ret[1] = center[1] + up[1];
    ret[2] = center[2] + up[2];

    ret[3] = up[0];
    ret[4] = up[1];
    ret[5] = up[2];

    ret[6] = 0;
    ret[7] = 0;
    // bottom(1)
    ret[8] = center[0] - up[0];
    ret[9] = center[1] - up[1];
    ret[10] = center[2] - up[2];

    ret[11] = -up[0];
    ret[12] = -up[1];
    ret[13] = -up[2];

    ret[14] = 0;
    ret[15] = 1;
    const vDelta = Math.PI / (vdiv + 1);
    const hDelta = Math.PI * 2 / hdiv;
    for (let v = 0; v < vdiv; v++) {
      const vc = Math.cos((v + 1) * vDelta);
      const vs = Math.sin((v + 1) * vDelta);
      const phi = vDelta * v;
      for (let h = 0; h < hdiv + 1; h++) {
        const hc = Math.cos(h * hDelta);
        const hs = Math.sin(h * hDelta);
        const fi = 16 + (v * (hdiv + 1) + h) * 8;
        ret[fi + 0] = center[0] + vc * up[0] + vs * (forward[0] * hc + right[0] * hs);
        ret[fi + 1] = center[1] + vc * up[1] + vs * (forward[1] * hc + right[1] * hs);
        ret[fi + 2] = center[2] + vc * up[2] + vs * (forward[2] * hc + right[2] * hs);
        ret[fi + 3] = center[0] + vc * up[0] + vs * (forward[0] * hc + right[0] * hs);
        ret[fi + 4] = center[1] + vc * up[1] + vs * (forward[1] * hc + right[1] * hs);
        ret[fi + 5] = (center[2] + vc * up[2] + vs * (forward[2] * hc + right[2] * hs));
        const theta = hDelta * h;
        ret[fi + 6] = theta / Math.PI / 2;
        ret[fi + 7] = phi / Math.PI;
      }
    }
    return ret;
  }

  public static sphereIndex(offset: number, vdiv: number = 3, hdiv: number = 3): number[] {

    const ret: number[] = new Array(hdiv * vdiv * 6);
    const getIndex = (i: number, j: number) => offset + (hdiv + 1) * j + 2 + i;
    const top = offset;
    const bottom = offset + 1;
    // upper side
    for (let i = 0; i < hdiv; i++) {
      ret[3 * i + 0] = top;
      ret[3 * i + 1] = getIndex(i + 1, 0);
      ret[3 * i + 2] = getIndex(i, 0);
    }
    const k = 3 * hdiv;
    // middle
    for (let j = 0; j < vdiv - 1; j++) {
      for (let i = 0; i < hdiv; i++) {
        ret[(hdiv * j + i) * 6 + k] = getIndex(i, j);
        ret[(hdiv * j + i) * 6 + k + 1] = getIndex(i + 1, j);
        ret[(hdiv * j + i) * 6 + k + 2] = getIndex(i , j + 1);
        ret[(hdiv * j + i) * 6 + k + 3] = getIndex(i, j + 1);
        ret[(hdiv * j + i) * 6 + k + 4] = getIndex(i + 1, j);
        ret[(hdiv * j + i) * 6 + k + 5] = getIndex(i + 1, j + 1);
      }
    }
    const l = hdiv * (vdiv - 1) * 6 + k;

    // lower side
    for (let i = 0; i < hdiv; i++) {
      ret[3 * i + l + 0] = bottom;
      ret[3 * i + l + 1] = getIndex(i, vdiv - 1);
      ret[3 * i + l + 2] = getIndex(i + 1, vdiv - 1);
    }
    return ret;
  }
}