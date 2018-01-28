import "../TestInit";
import test from "ava";
import { assert, spy } from "sinon";
import Geometry from "../../src/Geometry/Geometry";

function createGeometry() {
    const glMock = {
        createBuffer: () => { spy(); return {} },
        bindBuffer: spy(),
        bufferData: spy(),
    };
    return {
        geometry: new Geometry(glMock as any as WebGLRenderingContext),
        glMock: glMock
    };
}

test("Geometry#addAttribute with single attribute", (t) => {
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes([0, 1, 2, 3, 4, 5, 6, 7, 8], {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].bufferIndex === 0);
        t.truthy(geometry.accessors["POSITION"].offset === 0);
        t.truthy(geometry.accessors["POSITION"].normalized === false);
        t.truthy(geometry.accessors["POSITION"].stride === 12);
        t.truthy(geometry.accessors["POSITION"].size === 3);
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.FLOAT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Float32Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes([0, 1, 2, 3, 4, 5, 6, 7, 8], {
            POSITION: {
                size: 2, offset: 3, stride: 8, normalized: true
            }
        });
        t.truthy(geometry.accessors["POSITION"].bufferIndex === 0);
        t.truthy(geometry.accessors["POSITION"].offset === 3);
        t.truthy(geometry.accessors["POSITION"].normalized === true);
        t.truthy(geometry.accessors["POSITION"].stride === 8);
        t.truthy(geometry.accessors["POSITION"].size === 2);
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.FLOAT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Float32Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Float32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.FLOAT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Float32Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.UNSIGNED_BYTE);
        t.truthy(glMock.bufferData.args[0][1] instanceof Uint8Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.UNSIGNED_SHORT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Uint16Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Uint32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.UNSIGNED_INT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Uint32Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Int8Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.BYTE);
        t.truthy(glMock.bufferData.args[0][1] instanceof Int8Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.SHORT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Int16Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.INT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Int32Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
    {
        let { geometry, glMock } = createGeometry();
        geometry.addAttributes(new Int32Array([0, 1, 2, 3, 4, 5, 6, 7, 8]), {
            POSITION: {
                size: 3,
                type: WebGLRenderingContext.FLOAT
            }
        });
        t.truthy(geometry.accessors["POSITION"].type === WebGLRenderingContext.FLOAT);
        t.truthy(glMock.bufferData.args[0][1] instanceof Int32Array);
        t.truthy(glMock.bufferData.args[0][1][3] === 3);
        t.truthy(glMock.bufferData.args[0][1][6] === 6);
    }
});

