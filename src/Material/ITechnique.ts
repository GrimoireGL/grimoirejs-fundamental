interface ITechniqueRecipe {
  fragment: string;
  vertex: string;
  uniforms: {
    [key: string]: {
      type: number;
      count: number;
      default: any;
      semantic: string;
      node?: string;
    };
  },
  attributes: {
    [key: string]: string; // variable-name to semantic key
  },
  states: {
    enable: number[]
  }
}
export default ITechniqueRecipe;