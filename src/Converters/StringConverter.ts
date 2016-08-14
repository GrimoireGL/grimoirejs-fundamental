function StringConverter(val: any): any {
  if (typeof val === "string") {
    return val;
  } else if (typeof val.toString === "function") {
    return val.toString();
  } else {
    throw new Error(`The provided object type(${typeof val}) couldn't be parsed as string. The object should either be 'string' or any object having toString method`);
  }
}

export default StringConverter;
