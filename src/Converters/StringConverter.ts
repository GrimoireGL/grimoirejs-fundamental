function StringConverter(input: any): any {
    if (typeof input === "string") {
        return input;
    } else if (typeof input.toString === "function") {
        return input.toString();
    } else {
     throw new Error(`The provided object type(${typeof input}) couldn't be parsed as string. The object should either be 'string' or any object having toString method`);
    }
}

export default StringConverter;
