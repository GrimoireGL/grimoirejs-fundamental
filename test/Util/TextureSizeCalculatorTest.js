import "../TestInit";
import test from 'ava';
import TextureSizeCalculator from '../../lib-es5/Util/TextureSizeCalculator';

test('TextureSizeCalculator should works well', (t) => {
  t.truthy(TextureSizeCalculator.getPow2Size(100,100).width === 128)
  t.truthy(TextureSizeCalculator.getPow2Size(128,128).width === 128)
  t.truthy(TextureSizeCalculator.getPow2Size(1,1).width === 1)
  t.truthy(TextureSizeCalculator.getPow2Size(2,2).width === 2)
  t.truthy(TextureSizeCalculator.getPow2Size(200,200).width === 256)
});
