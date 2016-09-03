import ISORTPassInfo from "./ISORTPassInfo";
import CacheResolver from "../Asset/CacheResolver";

export default class SORTPassInfoResolver extends CacheResolver<ISORTPassInfo> {
  constructor() {
    super((r) => r);
  }
}
