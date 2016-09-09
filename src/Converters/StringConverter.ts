function StringConverter(val: any): any {
  if (typeof val === "string") {
    return val;
  } else if (typeof val === "undefined") {
    return val;
  } else if (typeof val.toString === "function") {
    return val.toString();
  }
}

export default StringConverter;
