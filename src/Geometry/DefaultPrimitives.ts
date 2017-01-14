import Geometry from "./Geometry";
import AABB from "grimoirejs-math/ref/AABB";
import Vector3 from "grimoirejs-math/ref/Vector3";
import GeometryUtility from "./GeometryUtility";
import GeometryFactory from "./GeometryFactory";

const unitBox = new AABB();
unitBox.expand(new Vector3(-1, -1, -1));
unitBox.expand(new Vector3(1, 1, 1));

const primitiveLayout = {
  POSITION: {
    size: 3,
    stride: 32
  },
  NORMAL: {
    size: 3,
    stride: 32,
    offset: 12
  },
  TEXCOORD: {
    size: 2,
    stride: 32,
    offset: 24
  }
};

export default class DefaultPrimitives {
  public static register(): void {
    DefaultPrimitives._registerQuad();
    DefaultPrimitives._registerCube();
    DefaultPrimitives._registerSphere();
    DefaultPrimitives._registerCircle();
    DefaultPrimitives._registerCylinder();
    DefaultPrimitives._registerCone();
    DefaultPrimitives._registerPlane();
    DefaultPrimitives._registerTriangle();
    DefaultPrimitives._registerCapsule();
  }

  private static _registerQuad(): void {
    GeometryFactory.addType("quad", {
    }, (gl, attrs) => {
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.plane([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], 1, 1), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.planeIndex(0, 1, 1));
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.planeIndex(0, 1, 1)), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerTriangle(): void {
    GeometryFactory.addType("triangle", {
    }, (gl, attrs) => {
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.triangle([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.triangleIndex(0));
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.triangleIndex(0)), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerCone(): void {
    GeometryFactory.addType("cone", {
      divide: {
        converter: "Number",
        default: 50
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      const geometry = new Geometry(gl);
      const theta = div % 2 != 0 ? Math.PI / div : 0;
      const vertices = [].concat.apply([], [
        GeometryUtility.circle([0, -0.5, 0], [0, -1, 0], [-Math.sin(theta), 0, Math.cos(theta)], [Math.cos(theta), 0, Math.sin(theta)], div),
      ]);
      const g = Math.cos(Math.PI / div) / 3;
      const length = Math.sin(Math.PI / div) / Math.pow(3, 0.5) * 2;
      const radius = Math.cos(Math.PI / div) - g;
      const s = Math.PI / div;

      for (let i = 0; i < div; i++) {
        let step = s * (i * 2 + 1);
        Array.prototype.push.apply(vertices, GeometryUtility.coneTriangle(
          [-Math.sin(step) * radius, 0, -Math.cos(step) * radius],
          [-Math.cos(Math.PI / 2 - step), 1, -Math.sin(Math.PI / 2 - step)],
          [Math.sin(step) * radius, 1, Math.cos(step) * radius],
          [-Math.cos(step) * length, 0, Math.sin(step) * length],
          div,
          i
        ));
      }
      geometry.addAttributes(vertices, primitiveLayout);
      const os = div + 2;
      const indices = [].concat.apply([], [
        GeometryUtility.circleIndex(0, div)
      ]);
      for (let i = 0; i < div; i++) {
        Array.prototype.push.apply(indices, GeometryUtility.triangleIndex(os + i * 3));
      }
      geometry.addIndex("default", indices);
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(indices), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerCylinder(): void {
    GeometryFactory.addType("cylinder", {
      divide: {
        converter: "Number",
        default: 50
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      const geometry = new Geometry(gl);
      const theta = div % 2 != 0 ? Math.PI / div : 0;
      const vertices = [].concat.apply([], [
        GeometryUtility.circle([0, 1, 0], [0, 1, 0], [0, 0, -1], [1, 0, 0], div),
        GeometryUtility.circle([0, -1, 0], [0, -1, 0], [-Math.sin(theta), 0, Math.cos(theta)], [Math.cos(theta), 0, Math.sin(theta)], div)
      ]);
      const length = Math.sin(Math.PI / div);
      const radius = Math.cos(Math.PI / div);
      const s = Math.PI / div;
      for (let i = 0; i < div; i++) {
        let step = s * (i * 2 + 1);
        Array.prototype.push.apply(vertices, GeometryUtility.cylinderPlane(
          [-Math.sin(step) * radius, 0, -Math.cos(step) * radius],
          [-Math.sin(step), 0, -Math.cos(step)],
          [0, 1, 0],
          [-Math.cos(step) * length, 0, Math.sin(step) * length],
          div, i));
      }
      geometry.addAttributes(vertices, primitiveLayout);
      const os = div + 2;
      const indices = [].concat.apply([], [
        GeometryUtility.circleIndex(0, div),
        GeometryUtility.circleIndex(os, div)
      ]);
      for (let i = 0; i < div; i++) {
        Array.prototype.push.apply(indices, GeometryUtility.planeIndex(os * 2 + i * 4, 1, 1));
      }
      geometry.addIndex("default", indices);
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(indices), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerCube(): void {
    GeometryFactory.addType("cube", {
      divHorizontal: {
        converter: "Number",
        default: 1
      },
      divVertical: {
        converter: "Number",
        default: 1
      }
    }, (gl, attrs) => {
      const hdiv = attrs["divHorizontal"];
      const vdiv = attrs["divVertical"];
      const geometry = new Geometry(gl);
      const vertices = [].concat.apply([], [
        GeometryUtility.plane([0, 0, 1], [0, 0, 1], [0, 1, 0], [1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([0, 0, -1], [0, 0, -1], [0, 1, 0], [-1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([0, 1, 0], [0, 1, 0], [0, 0, -1], [1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([0, -1, 0], [0, -1, 0], [0, 0, -1], [-1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, -1], hdiv, vdiv),
        GeometryUtility.plane([-1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], hdiv, vdiv)]);
      geometry.addAttributes(vertices, primitiveLayout);
      const os = (hdiv + 1) * (vdiv + 1);
      const indices = [].concat.apply([], [
        GeometryUtility.planeIndex(0, hdiv, vdiv),
        GeometryUtility.planeIndex(os, hdiv, vdiv),
        GeometryUtility.planeIndex(2 * os, hdiv, vdiv),
        GeometryUtility.planeIndex(3 * os, hdiv, vdiv),
        GeometryUtility.planeIndex(4 * os, hdiv, vdiv),
        GeometryUtility.planeIndex(5 * os, hdiv, vdiv)]);
      geometry.addIndex("default", indices);
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(indices), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerSphere(): void {
    GeometryFactory.addType("sphere", {
      divVertical: {
        converter: "Number",
        default: 50
      },
      divHorizontal: {
        converter: "Number",
        default: 50
      }
    }, (gl, attrs) => {
      const dH = attrs["divHorizontal"];
      const dV = attrs["divVertical"];
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.sphere([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, -1], dV, dH), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.sphereIndex(0, dV, dH));
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.sphereIndex(0, dV, dH)), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerCapsule(): void {
    GeometryFactory.addType("capsule", {
      divide: {
        converter: "Number",
        default: 50
      }
    }, (gl, attrs) => {
      const dH = attrs["divide"];
      const dV = attrs["divide"] % 2 == 1 ? attrs["divide"] + 1 : attrs["divide"];

      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.capsule([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, -1], dV, dH), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.sphereIndex(0, dV, dH));
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.sphereIndex(0, dV, dH)), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerCircle(): void {
    GeometryFactory.addType("circle", {
      divide: {
        converter: "Number",
        default: 30
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.circle([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], div), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.circleIndex(0, div));
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.circleIndex(0, div)), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
  private static _registerPlane(): void {
    GeometryFactory.addType("plane", {
      divide: {
        converter: "Number",
        default: 10
      }
    }, (gl, attrs) => {
      const hdiv = attrs["divide"];
      const vdiv = attrs["divide"];
      const geometry = new Geometry(gl);
      const vertices = [].concat.apply([], [
        GeometryUtility.plane([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], hdiv, vdiv), GeometryUtility.plane([0, 0, 0], [0, 0, -1], [0, 1, 0], [-1, 0, 0], hdiv, vdiv)
      ]);
      geometry.addAttributes(vertices, primitiveLayout);
      const indices = [].concat.apply([], [
        GeometryUtility.planeIndex(0, hdiv, vdiv),
        GeometryUtility.planeIndex((hdiv + 1) * (vdiv + 1), hdiv, vdiv)
      ]);
      geometry.addIndex("default", indices);
      geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(indices), WebGLRenderingContext.LINES);
      return geometry;
    });
  }
}
