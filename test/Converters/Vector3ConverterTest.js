import "../TestInit";
import test from 'ava';
import Vector3Converter from '../../lib-es5/Converters/Vector3Converter';
import Vector3 from "grimoirejs-math/ref/Vector3"
test('Vector3Converter should convert collectly', (t) => {
  const vec = new Vector3(1, 1, 2);
  t.truthy(Vector3.equals(Vector3Converter("1, 1, 2"), vec));
});

test('Vector3Converter should convert collectly', (t) => {
  const vec = new Vector3(1, 1, 1);
  t.truthy(Vector3.equals(Vector3Converter(1), vec));
});
