import React from 'react';
import { DiffMethod } from './compute-lines';
import './DiffViewer.scss';
export declare type DiffViewerProps = {
    /**
     * Old value to compare.
     */
    oldValue: string;
    /**
     * New value to compare.
     */
    newValue: string;
    /**
     * Column title for left section of the diff in split view. This will be used as the only title in inline view.
     */
    leftTitle?: string | Element;
    /**
     * Column title for right section of the diff in split view. This will be ignored in inline view.
     */
    rightTitle?: string | Element;
    /**
     * Enable/Disable split view.
     * @default
     * true
     */
    splitView?: boolean;
    /**
     * Show/hide line number.
     * @default
     * false
     */
    hideLineNumbers?: boolean;
    /**
     * Enable/Disable word diff.
     * @default
     * false
     */
    disableWordDiff?: boolean;
    /**
     * JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
     * @default
     * diffChars
     */
    compareMethod?: typeof DiffMethod[keyof typeof DiffMethod];
    /**
     * Set line Offset
     */
    linesOffset?: number;
    /**
     * Number of extra unchanged lines surrounding the diff. Works along with `showDiffOnly`.
     * @default
     * 3
     */
    extraLinesSurroundingDiff?: number;
    /**
     * Shows only the diffed lines and folds the unchanged lines
     * @default
     * true
     */
    showDiffOnly?: boolean;
    /**
     * List of lines to be highlighted. Works together with `onLineNumberClick`.
     * Line number are prefixed with `L` and `R` for the left and right section of the diff viewer, respectively.
     * For example, `L-20` means 20th line in the left pane. To highlight a range of line numbers, pass the prefixed line number as an array.
     * For example, `[L-2, L-3, L-4, L-5]` will highlight the lines `2-5` in the left pane.
     * @default
     * []
     */
    highlightLines?: string[];
    /**
     * Render prop to format final string before displaying them in the UI. Helpful for syntax highlighting
     */
    renderContent?: (source?: string) => JSX.Element;
    /**
     * Render prop to render code fold message..
     */
    codeFoldMessageRenderer?: (totalFoldedLines: number, leftStartLineNumber?: number, rightStartLineNumber?: number) => JSX.Element;
    /**
     * Event handler for line number click.
     */
    onLineNumberClick?: (lineId: string, event: React.MouseEvent<HTMLTableCellElement>) => void;
};
export declare enum LineNumberPrefix {
    LEFT = "L",
    RIGHT = "R"
}
export declare const DiffViewer: (props: DiffViewerProps) => JSX.Element;
//# sourceMappingURL=DiffViewer.d.ts.map