import "../TestInit";
import test from 'ava';
import Angle2DConverter from '../../lib-es5/Converters/Angle2DConverter';
import RotationParser from '../../lib-es5/Util/RotationParser';

test('RotationParser test', t => {
  const epc = 0.1;
  t.truthy(Math.abs(RotationParser.parseAngle("90") - Math.PI / 2) < epc);
  t.truthy(Math.abs(RotationParser.parseAngle("0.9e+2") - Math.PI / 2) < epc);
})
