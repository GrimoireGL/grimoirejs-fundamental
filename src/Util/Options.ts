import { Undef } from "grimoirejs/ref/Tool/Types";

type Options<T> = {
    [key in keyof T]?: T[key];
};

export default Options;