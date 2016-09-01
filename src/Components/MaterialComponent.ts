import GLSLXPass from "../Material/GLSLXPass";
import PassFactory from "../Material/PassFactory";
import Material from "../Material/Material";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

import testShader from "../TestShader/Test.glsl";


export default class MaterialComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public material: Material;

  public materialArgs: { [key: string]: any } = {};

  public $mount(): void {
    this.material = new Material([PassFactory.fromGLSLX(this.companion.get("gl"), testShader)]);
    this._registerAttributes();
  }

  private async _registerAttributes(): Promise<void> {
    await this.material.initializePromise;
    this.material.pass.forEach(p => {
      if (p instanceof GLSLXPass) {
        for (let key in p.programInfo.gomlAttributes) {
          this.__addAtribute(key, p.programInfo.gomlAttributes[key]);
          this.attributes.get(key).addObserver((v) => {
            this.materialArgs[key] = v.Value;
          });
          this.materialArgs[key] = this.getValue(key);
        }
      }
    });
  }

}
