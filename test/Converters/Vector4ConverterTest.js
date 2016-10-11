import "../TestInit";
import test from 'ava';
import Vector4Converter from '../../lib-es5/Converters/Vector4Converter';
import { Vector4 } from "grimoirejs-math"
test('Vector4Converter should convert collectly', (t) => {
  const vec = new Vector4(1, 1, 2, 1);
  t.truthy(Vector4.equals(Vector4Converter("1, 1, 2, 1"), vec));
});