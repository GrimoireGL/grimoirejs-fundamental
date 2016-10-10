import "../TestInit";
import test from 'ava';
import Color3Converter from '../../lib-es5/Converters/Color3Converter';
import { Color3, Color4 } from "grimoirejs-math";
test('Color3Converter should convert collectly', (t) => {
  const c1 = new Color4(1, 1, 1, 1);
  const c2 = new Color3(1, 1, 1);
  t.truthy(c2.equalWith(Color3Converter(c1)));
  t.truthy(c2.equalWith(Color3Converter("#FFF")));
});