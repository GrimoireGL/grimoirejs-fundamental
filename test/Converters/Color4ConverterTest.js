import "../TestInit";
import test from 'ava';
import Color4Converter from '../../lib-es5/Converters/Color4Converter';
import { Color4 } from "grimoirejs-math";
test('Color4Converter should convert collectly', (t) => {
  const c = new Color4(1, 1, 1, 1);
  t.truthy(c.equalWith(Color4Converter("#FFF")));
});