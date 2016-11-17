import "../TestInit";
import test from 'ava';
import ObjectConverter from '../../lib-es5/Converters/ObjectConverter';

test('ObjectConverter should convert correctly', (t) => {
  const c = {};
    t.truthy(ObjectConverter(c) === c);
});
