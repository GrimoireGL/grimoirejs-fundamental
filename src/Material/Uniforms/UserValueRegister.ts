import Texture2D from "../../Resource/Texture2D";
import TextureReference from "../TextureReference";
import Material from "../Material";
import IVariableInfo from "../IVariableInfo";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import UniformResolverRegistry from "../UniformResolverRegistry";
const gl = WebGLRenderingContext;
const _userValueRegisterers = {
    array: {},
    single: {}
};

UniformResolverRegistry.add("USER_VALUE", (valInfo: IVariableInfo, material: Material) => {
    let register;
    if (valInfo.count) {
        register = _userValueRegisterers.array[valInfo.type];
        if (!register) {
            throw new Error(`No user_value registerer was registered for ${valInfo.type}[]`);
        }
    } else {
        register = _userValueRegisterers.single[valInfo.type];
        if (!register) {
            throw new Error(`No user_value registerer was registered for ${valInfo.type}`);
        }
    }
    return register(valInfo, material);
});

function basicRegister(type: number, isArray: boolean, converter: string, defaultValue: any, register: (proxy: UniformProxy, name: string, value, matArg: IMaterialArgument) => void) {
    let registerTarget;
    if (isArray) {
        registerTarget = _userValueRegisterers.array;
    } else {
        registerTarget = _userValueRegisterers.single;
    }
    registerTarget[type] = function(valInfo: IVariableInfo, material: Material) {
        material.addArgument(valInfo.name, {
            converter: converter,
            default: valInfo.attributes["default"] ? valInfo.attributes["default"] : defaultValue
        });
        return {
            register: (proxy: UniformProxy, args: IMaterialArgument) => {
                register(proxy, valInfo.name, material.arguments[valInfo.name], args);
            },
            dispose: () => {
                material.deleteArgument(valInfo.name);
            }
        };
    };
}

basicRegister(gl.FLOAT, false, "Number", 0, (proxy, name, value) => proxy.uniformFloat(name, value));
basicRegister(gl.INT, false, "Number", 0, (proxy, name, value) => proxy.uniformInt(name, value));
basicRegister(gl.BOOL, false, "Boolean", false, (proxy, name, value) => proxy.uniformBool(name, value));
basicRegister(gl.INT_VEC2, false, "Vector2", [0, 0], (proxy, name, value) => proxy.uniformVector2(name, value));
basicRegister(gl.INT_VEC3, false, "Vector3", [0, 0, 0], (proxy, name, value) => proxy.uniformVector3(name, value));
basicRegister(gl.INT_VEC4, false, "Vector4", [0, 0, 0, 0], (proxy, name, value) => proxy.uniformVector4(name, value));
basicRegister(gl.FLOAT_VEC2, false, "Vector2", [0, 0], (proxy, name, value) => proxy.uniformVector2(name, value));
basicRegister(gl.FLOAT_MAT4, true, "Object", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], (proxy, name, value) => proxy.uniformMatrixArray(name, value));
basicRegister(gl.SAMPLER_2D, false, "Texture", null, (proxy, name, value: TextureReference, args) => {
    let texture;
    if (value && (texture = value.get(args.buffers))) {
        proxy.uniformTexture2D(name, texture);
    } else {
        proxy.uniformTexture2D(name, Texture2D.defaultTextures.get(proxy.program.gl));
    }
});

_userValueRegisterers.single[gl.FLOAT_VEC3] = function(valInfo: IVariableInfo, material: Material) {
    const isColor = valInfo.attributes["type"] === "color";
    const attrDefault = valInfo.attributes["default"];
    const defaultValue = attrDefault ? attrDefault : (isColor ? [1, 1, 1] : [0, 0, 0]);
    material.addArgument(valInfo.name, {
        converter: isColor ? "Color3" : "Vector3",
        default: defaultValue
    });
    return {
        register: isColor ? (proxy: UniformProxy, args: IMaterialArgument) => {
            proxy.uniformColor3(valInfo.name, material.arguments[valInfo.name]);
        } : (proxy: UniformProxy, args: IMaterialArgument) => {
            proxy.uniformVector3(valInfo.name, material.arguments[valInfo.name]);
        },
        dispose: () => {
            material.deleteArgument(valInfo.name);
        }
    };
};

_userValueRegisterers.single[gl.FLOAT_VEC4] = function(valInfo: IVariableInfo, material: Material) {
    const isColor = valInfo.attributes["type"] === "color";
    const attrDefault = valInfo.attributes["default"];
    const defaultValue = attrDefault ? attrDefault : (isColor ? [1, 1, 1, 1] : [0, 0, 0, 0]);
    material.addArgument(valInfo.name, {
        converter: isColor ? "Color4" : "Vector4",
        default: defaultValue
    });
    return {
        register: isColor ? (proxy: UniformProxy, args: IMaterialArgument) => {
            proxy.uniformColor4(valInfo.name, material.arguments[valInfo.name]);
        } : (proxy: UniformProxy, args: IMaterialArgument) => {
            proxy.uniformVector4(valInfo.name, material.arguments[valInfo.name]);
        },
        dispose: () => {
            material.deleteArgument(valInfo.name);
        }
    };
};
export default null;
