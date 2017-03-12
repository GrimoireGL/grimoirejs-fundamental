import "../TestInit";
import test from 'ava';
import TextureSizeCalculator from '../../lib-es5/Util/TextureSizeCalculator';
import Texture2D from "../../lib-es5/Resource/Texture2D";

test('TextureSizeCalculator should works well', (t) => {
  Texture2D.maxTextureSize = 4096;
  t.truthy(TextureSizeCalculator.getPow2Size(100,100).width === 128)
  t.truthy(TextureSizeCalculator.getPow2Size(128,128).width === 128)
  t.truthy(TextureSizeCalculator.getPow2Size(1,1).width === 1)
  t.truthy(TextureSizeCalculator.getPow2Size(2,2).width === 2)
  t.truthy(TextureSizeCalculator.getPow2Size(200,200).width === 256)
  t.truthy(TextureSizeCalculator.getPow2Size(1,256).width === 1)
  t.truthy(TextureSizeCalculator.getPow2Size(1,256).height === 256)
  t.truthy(TextureSizeCalculator.getPow2Size(1,255).height === 256)
  t.truthy(TextureSizeCalculator.getPow2Size(1,5000).width === 1)
  t.truthy(TextureSizeCalculator.getPow2Size(1,5000).height === 4096)
});
