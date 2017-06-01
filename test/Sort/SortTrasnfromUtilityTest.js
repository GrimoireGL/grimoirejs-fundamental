import "../TestInit";
import test from 'ava';
import SortTransformUtility from '../../lib-es5/Sort/SortTransformUtility';
import Parser from '../../lib-es5/Sort/Parser';
import fs from "fs";

test('separateTechniqueSource works correctly when @Technique was not specified', (t) => {
  const result = SortTransformUtility.separateTechniqueSource("");
  t.truthy(result.default === "");
});

test('separateTechniqueSource works correctly when @Technique was specified', (t) => {
  const result = SortTransformUtility.separateTechniqueSource("@Technique A{ABC}\n@Technique B{XYZ}");
  t.truthy(result.A === "ABC");
  t.truthy(result.B === "XYZ");
});

test('removeComment works correctly', (t) => {
  let result = SortTransformUtility.removeComment("//ABC");
  t.truthy(result === "");
  result = SortTransformUtility.removeComment("/*A\nB\nC*/");
  t.truthy(result === "\n\n");
  result = SortTransformUtility.removeComment("/*A\nB\nC*/ABC/**/");
  t.truthy(result === "\n\nABC");
});


test('asValidJSON works correctly', (t) => {
  let result = SortTransformUtility.asValidJSON(`{abc:"abc"}`);
  t.truthy(result === `{"abc":"abc"}`);
  result = SortTransformUtility.asValidJSON(`{"abc":"abc"}`);
  t.truthy(result === `{"abc":"abc"}`);
  result = SortTransformUtility.asValidJSON(`{"abc":"abc",\ndef:"aaa"}`);
  t.truthy(result === `{"abc":"abc",\n"def":"aaa"}`);
});

test('parse case1.sort correctly', async(t) => {
  const input = fs.readFileSync("./test/Sort/TestShaders/case2.sort", "utf-8");
  await Parser.parse(input);
  t.notThrows(()=>Parser.parse(input));
});
