import "../TestInit";
import test from 'ava';
import Color3Converter from '../../lib-es5/Converters/Color3Converter';
import { Color3, Color4 } from "grimoirejs-math";
const c1 = new Color4(1, 1, 0, 1);
const c2 = new Color3(1, 1, 0);
const w = new Color3(1, 1, 1, 1);

test('Color3Converter should convert color4 correctly', (t) => {
  t.truthy(c2.equalWith(Color3Converter(c1)));
});

test('Color3Converter should convert "#XXX" syntax correctly', (t) => {
  t.truthy(c2.equalWith(Color3Converter("#FF0")));
});

test('Color3Converter should convert "rgb(R,G,B)" syntax correctly', (t) => {
  t.truthy(c2.equalWith(Color3Converter("rgb(255,255,0)")));
});

test('Color3Converter should convert HTMLColorName correctly', (t) => {
  t.truthy(w.equalWith(Color3Converter("white")));
});
