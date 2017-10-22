export default interface IViewportBaseMouseState {
  coords: { [coordSystem: string]: number[] };
  inside: boolean;
  left: boolean;
  right: boolean;
}
