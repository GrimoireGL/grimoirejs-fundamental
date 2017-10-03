export default interface ViewportBaseMouseState {
    coords: { [coordSystem: string]: number[] };
    inside: boolean;
}