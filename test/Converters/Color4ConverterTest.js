import "../TestInit";
import test from 'ava';
import Color4Converter from '../../lib-es5/Converters/Color4Converter';
import  Color4 from "grimoirejs-math/ref/Color4";
const c = new Color4(1, 1, 0, 1);
const c2 = new Color4(1, 1, 0, 0.5);
const w = new Color4(1,1,1,1);

test('Color3Converter should convert color4 correctly', (t) => {
  t.truthy(c.equalWith(Color4Converter(c)));
});

test('Color4Converter should convert "#XXX" syntax correctly', (t) => {
  t.truthy(c.equalWith(Color4Converter("#FF0")));
});

test('Color4Converter should convert "rgb(R,G,B)" syntax correctly', (t) => {
  t.truthy(c.equalWith(Color4Converter("rgb(255,255,0)")));
});

test('Color4Converter should convert HTMLColorName correctly', (t) => {
  t.truthy(w.equalWith(Color4Converter("white")));
});

test('Color3Converter should convert color4 correctly with alpha', (t) => {
  t.truthy(c2.equalWith(Color4Converter(c2)));
});
