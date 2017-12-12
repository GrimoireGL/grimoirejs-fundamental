import ImageSource from "./ImageSource";
export default interface ICubemapSource {
    posX: ImageSource;
    negX: ImageSource;
    posY: ImageSource;
    negY: ImageSource;
    posZ: ImageSource;
    negZ: ImageSource;
}
