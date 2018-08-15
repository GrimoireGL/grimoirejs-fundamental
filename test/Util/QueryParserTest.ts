import "../TestInit";
// tslint:disable-next-line:ordered-imports
import test from "ava";
import QueryParser from "../../src/Util/QueryParser";

test("FunctionalQuery can parse with function", (t) => {
    const arr = QueryParser.parseFunctionalQuery("function(1,32,ABC)");
    t.truthy(arr[0] === "function");
    t.truthy(arr[1] === "1");
    t.truthy(arr[2] === "32");
    t.truthy(arr[3] === "ABC");
});

test("FunctionalQuery can parse without function", (t) => {
    t.throws(() => QueryParser.parseFunctionalQuery("1,32,ABC"));
});

test("FunctionalQuery can parse without function and specified default function", (t) => {
    const arr = QueryParser.parseFunctionalQuery("1,32,ABC", "default");
    t.truthy(arr[0] === "default");
    t.truthy(arr[1] === "1");
    t.truthy(arr[2] === "32");
    t.truthy(arr[3] === "ABC");
});

test("FunctionalQuery can parse without function and specified default function and default arguments", (t) => {
    let arr = QueryParser.parseFunctionalQuery("1,32,ABC", "default", "1", "2", "32", "40");
    t.truthy(arr[0] === "default");
    t.truthy(arr[1] === "1");
    t.truthy(arr[2] === "32");
    t.truthy(arr[3] === "ABC");
    t.truthy(arr[4] === "40");
    arr = QueryParser.parseFunctionalQuery("function(1,32,ABC)", "default", "1", "2", "32", "40");
    t.truthy(arr[0] === "function");
    t.truthy(arr[1] === "1");
    t.truthy(arr[2] === "32");
    t.truthy(arr[3] === "ABC");
    t.truthy(arr[4] === "40");
});
