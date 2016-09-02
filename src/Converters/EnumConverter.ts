function EnumConverter(val: any): any {
  if (!this.declaration.table) {
    throw new Error("Enum converter needs to be specified table in attribute dictionary");
  }
  if (typeof val === "string") {
    const result = this.declaration.table[val];
    if (!result) {
      throw new Error("Specified value is not exisiting in the relation table");
    } else {
      return result;
    }
  }
}

export default EnumConverter;
