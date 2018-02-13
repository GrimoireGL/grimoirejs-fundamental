import { Nullable } from "grimoirejs/ref/Tool/Types";

/**
 * Parser for query used in converter
 *
 */
export default class QueryParser {
    public static parseFunctionalQuery(query: string, defaultFunc: Nullable<string> = null, ...defaultArgs: string[]): string[] {
        const regex = /([a-zA-Z0-9]+)\((.*)\)/gm;
        const regexResult = regex.exec(query);
        if (regexResult) {
            return [regexResult[1], ...QueryParser.collectArgsWithDefault(regexResult[2].split(","), defaultArgs)];
        } else {
            return [defaultFunc, ...QueryParser.collectArgsWithDefault(query.split(","), defaultArgs)];
        }
    }

    /**
     * Fill argument with specified argument and default argument.
     * If specified argument don't have an element at an index, default value is assigned.
     * @param args
     * @param defaultArgs
     */
    public static collectArgsWithDefault(args: string[], defaultArgs: string[]): string[] {
        const result = [] as string[];
        for (let i = 0; i < Math.max(defaultArgs.length, args.length); i++) {
            result.push(args[i] || defaultArgs[i]);
        }
        return result;
    }
}
