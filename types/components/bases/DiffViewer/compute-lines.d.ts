export declare const DiffType: {
    readonly DEFAULT: 0;
    readonly ADDED: 1;
    readonly REMOVED: 2;
};
export declare const DiffMethod: {
    readonly CHARS: "diffChars";
    readonly WORDS: "diffWords";
    readonly WORDS_WITH_SPACE: "diffWordsWithSpace";
    readonly LINES: "diffLines";
    readonly TRIMMED_LINES: "diffTrimmedLines";
    readonly SENTENCES: "diffSentences";
    readonly CSS: "diffCss";
};
export declare type DiffInformation = {
    value?: string | DiffInformation[];
    lineNumber?: number;
    type?: typeof DiffType[keyof typeof DiffType];
};
export declare type LineInformation = {
    left?: DiffInformation;
    right?: DiffInformation;
};
export declare type ComputedLineInformation = {
    lineInformation: LineInformation[];
    diffLines: number[];
};
export declare type ComputedDiffInformation = {
    left?: DiffInformation[];
    right?: DiffInformation[];
};
export declare type JsDiffChangeObject = {
    added?: boolean;
    removed?: boolean;
    value?: string;
};
/**
 * Computes line wise information based in the js diff information passed. Each
 * line contains information about left and right section. Left side denotes
 * deletion and right side denotes addition.
 *
 * @param oldString Old string to compare.
 * @param newString New string to compare with old string.
 * @param disableWordDiff Flag to enable/disable word diff.
 * @param compareMethod JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
 * @param linesOffset line number to start counting from
 */
declare const computeLineInformation: (oldString: string, newString: string, disableWordDiff?: boolean, compareMethod?: string, linesOffset?: number) => ComputedLineInformation;
export { computeLineInformation };
//# sourceMappingURL=compute-lines.d.ts.map