import "../TestInit";
import test from 'ava';
import Vector2Converter from '../../lib-es5/Converters/Vector2Converter';
import Vector2 from "grimoirejs-math/ref/Vector2"
test('Vector2Converter should convert collectly', (t) => {
  const vec = new Vector2(1, 1);
  t.truthy(Vector2.equals(Vector2Converter("1,1"), vec));
});
