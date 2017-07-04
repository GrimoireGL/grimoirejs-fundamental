import Texture2D from "../../Resource/Texture2D";
import TextureReference from "../TextureReference";
import Material from "../Material";
import IVariableInfo from "../Schema/IVariableInfo";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import UniformResolverRegistry from "../UniformResolverRegistry";
import { IUniformRegisterOnUpdate } from "../UniformResolverRegistry";
import PassProgram from "../PassProgram";
import Pass from "../Pass";
import Technique from "../Technique";
const gl = WebGLRenderingContext;
const _userValueRegisterers = {
  array: {},
  single: {}
};

UniformResolverRegistry.add("USER_VALUE", (valInfo: IVariableInfo, pass: Pass, technique: Technique, material: Material) => {
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
  return register(valInfo, pass);
});

function basicRegister(type: number, isArray: boolean, converter: string, defaultValue: any, register: (proxy: UniformProxy, name: string, value, matArg: IMaterialArgument) => void, update?: (valInfo: IVariableInfo, passProgram: PassProgram, n: any, o: any) => void) {
  let registerTarget;
  if (isArray) {
    registerTarget = _userValueRegisterers.array;
  } else {
    registerTarget = _userValueRegisterers.single;
  }
  registerTarget[type] = function(valInfo: IVariableInfo, pass: Pass) {
    pass.addArgument(valInfo.name, {
      converter: converter,
      default: valInfo.attributes["default"] ? valInfo.attributes["default"] : defaultValue
    });
    const updator = update ? (p, n, o) => {
      update(valInfo, p, n, o);
    } : undefined;
    return {
      register: (proxy: UniformProxy, args: IMaterialArgument) => {
        register(proxy, valInfo.name, pass.arguments[valInfo.name], args);
      },
      update: updator
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
  let texture: Texture2D;
  if (value) {
    const fetched = value.get(args.buffers);
    if (fetched.valid) {
      texture = fetched;
    }
  }
  if (!texture) {
    texture = Texture2D.defaultTextures.get(proxy.program.gl);
  }
  proxy.uniformTexture2D(name, texture);
}, (v, p, n, o) => {
  if (v.attributes["flag"] === void 0) return;
  let used = false;
  if (n) {
    if (n.isFunctionalProxy) {
      used = true;
    } else {
      const fetched = n.get({});
      if (fetched.valid) {
        used = true;
      } else {
        fetched.validPromise.then(() => {
          p.setMacro(v.attributes["flag"], true);
        });
      }
    }
  }
  p.setMacro(v.attributes["flag"], used);
});

// vec3 or vec4 should consider the arguments are color or vector.

_userValueRegisterers.single[gl.FLOAT_VEC3] = function(valInfo: IVariableInfo, pass: Pass) {
  const isColor = valInfo.attributes["type"] === "color";
  const attrDefault = valInfo.attributes["default"];
  const defaultValue = attrDefault ? attrDefault : (isColor ? [1, 1, 1] : [0, 0, 0]);
  pass.addArgument(valInfo.name, {
    converter: isColor ? "Color3" : "Vector3",
    default: defaultValue
  });
  return {
    register: isColor ? (proxy: UniformProxy, args: IMaterialArgument) => {
      proxy.uniformColor3(valInfo.name, pass.arguments[valInfo.name]);
    } : (proxy: UniformProxy, args: IMaterialArgument) => {
      proxy.uniformVector3(valInfo.name, pass.arguments[valInfo.name]);
    }
  };
};

_userValueRegisterers.single[gl.FLOAT_VEC4] = function(valInfo: IVariableInfo, pass: Pass) {
  const isColor = valInfo.attributes["type"] === "color";
  const attrDefault = valInfo.attributes["default"];
  const defaultValue = attrDefault ? attrDefault : (isColor ? [1, 1, 1, 1] : [0, 0, 0, 0]);
  pass.addArgument(valInfo.name, {
    converter: isColor ? "Color4" : "Vector4",
    default: defaultValue
  });
  return {
    register: isColor ? (proxy: UniformProxy, args: IMaterialArgument) => {
      proxy.uniformColor4(valInfo.name, pass.arguments[valInfo.name]);
    } : (proxy: UniformProxy, args: IMaterialArgument) => {
      proxy.uniformVector4(valInfo.name, pass.arguments[valInfo.name]);
    }
  };
};
export default null;
