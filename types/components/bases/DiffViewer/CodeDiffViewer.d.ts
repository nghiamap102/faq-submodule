import React from 'react';
import { DiffMethod } from './compute-lines';
import './CodeDiffViewer.scss';
export declare type CodeDiffViewerProps = {
    oldValue: string;
    newValue: string;
    leftTitle?: string | Element;
    rightTitle?: string | Element;
    splitView?: boolean;
    hideLineNumbers?: boolean;
    disableWordDiff?: boolean;
    compareMethod?: DiffMethod;
    linesOffset?: number;
    extraLinesSurroundingDiff?: number;
    showDiffOnly?: boolean;
    highlightLines?: string[];
    renderContent?: (source?: string) => JSX.Element;
    codeFoldMessageRenderer?: (totalFoldedLines: number, leftStartLineNumber?: number, rightStartLineNumber?: number) => JSX.Element;
    onLineNumberClick?: (lineId: string, event: React.MouseEvent<HTMLTableCellElement>) => void;
};
export declare enum LineNumberPrefix {
    LEFT = "L",
    RIGHT = "R"
}
export declare const CodeDiffViewer: (props: CodeDiffViewerProps) => JSX.Element;
//# sourceMappingURL=CodeDiffViewer.d.ts.map