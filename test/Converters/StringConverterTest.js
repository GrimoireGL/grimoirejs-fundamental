import "../TestInit";
import test from 'ava';
import StringConverter from '../../lib-es5/Converters/StringConverter';

test('StringConverter should convert collectly',(t)=>{
  t.truthy(StringConverter("HELLO") === "HELLO" );
});

test('StringConverter should convert number collectly',(t)=>{
  t.truthy(StringConverter(10) === "10" );
});

test('StringConverter should convert object with calling toString method',(t)=>{
  t.truthy(StringConverter({
    toString:function(){
      return "Stringified";
    }
  }) === "Stringified" );
});
