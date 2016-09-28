function StringArrayConverter(val: any): any {
  if (Array.isArray(val)) {
    return val; // should we check the elements are actualy string?
  } else if (typeof val === "string") {
    const splitted = val.split(",");
    return splitted.map(s => s);
  }
}

export default StringArrayConverter;
