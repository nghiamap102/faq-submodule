import clsx from 'clsx';
import React, { useState } from 'react';

import {
    computeLineInformation,
    LineInformation,
    DiffInformation,
    DiffType,
    DiffMethod,
} from './compute-lines';

import './DiffViewer.scss';

export type DiffViewerProps = {
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
    codeFoldMessageRenderer?: (totalFoldedLines: number, leftStartLineNumber?: number, rightStartLineNumber?: number,) => JSX.Element;
    /**
     * Event handler for line number click.
     */
    onLineNumberClick?: (lineId: string, event: React.MouseEvent<HTMLTableCellElement>) => void;

}

export enum LineNumberPrefix {
	LEFT = 'L',
	RIGHT = 'R',
}

export const DiffViewer = (props: DiffViewerProps): JSX.Element =>
{
    const {
        oldValue,
        newValue,
        leftTitle,
        rightTitle,
        splitView = true,
        hideLineNumbers = false,
        disableWordDiff = false,
        compareMethod = 'diffChars',
        linesOffset,
        extraLinesSurroundingDiff = 3,
        showDiffOnly = true,
        highlightLines,
        renderContent,
        codeFoldMessageRenderer,
        onLineNumberClick,
    } = props;

    // Array holding the expanded code folding.
    const [expandedBlocks, setExpandedBlocks] = useState<number[]>([]);

    /**
     * Maps over the word diff and constructs the required React elements to show word diff.
     *
     * @param diffArray Word diff information derived from line information.
     * @param renderer Optional renderer to format diff words. Useful for syntax highlighting.
     */
    const renderWordDiff = (diffArray: DiffInformation[], renderer?: (chunk: string) => JSX.Element) =>
    {
        return diffArray.map(
            (wordDiff, i): JSX.Element =>
            {
                const classes = clsx(
                    'diff__work-diff',
                    wordDiff.type === DiffType.ADDED && 'diff__work-added',
                    wordDiff.type === DiffType.REMOVED && 'diff__work-removed',
                );
                return (
                    <span
                        key={i}
                        className={classes}
                    >
                        {renderer ? renderer(wordDiff.value as string) : wordDiff.value}
                    </span>
                );
            },
        );
    };

    const onLineNumberClickProxy = (id: string): any =>
    {
        if (onLineNumberClick)
        {
            return (e: any): void => onLineNumberClick(id, e);
        }
        return (): void => {};
    };

    /**
     * Maps over the line diff and constructs the required react elements to show line diff. It calls
     * renderWordDiff when encountering word diff. This takes care of both inline and split view line
     * renders.
     *
     * @param lineNumber Line number of the current line.
     * @param type Type of diff of the current line.
     * @param prefix Unique id to prefix with the line numbers.
     * @param value Content of the line. It can be a string or a word diff array.
     * @param additionalLineNumber Additional line number to be shown. Useful for rendering inline
     *  diff view. Right line number will be passed as additionalLineNumber.
     * @param additionalPrefix Similar to prefix but for additional line number.
     */
    const renderLine = (
        lineNumber?: number,
        type?: typeof DiffType[keyof typeof DiffType],
        prefix?: LineNumberPrefix,
        value?: string | DiffInformation[],
        additionalLineNumber?: number,
        additionalPrefix?: LineNumberPrefix,
    ) =>
    {
        const lineNumberTemplate = `${prefix}-${lineNumber}`;
        const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
        const highlightLine = highlightLines?.includes(lineNumberTemplate) || highlightLines?.includes(additionalLineNumberTemplate);
        const added = type === DiffType.ADDED;
        const removed = type === DiffType.REMOVED;
        let content;
        if (Array.isArray(value))
        {
            content = renderWordDiff(value, renderContent);
        }
        else if (renderContent)
        {
            content = renderContent(value);
        }
        else
        {
            content = value;
        }

        const diffClasses = clsx(
            added && 'diff__line--added',
            removed && 'diff__line--removed',
        );

        const gutterClasses = clsx(
            'diff__gutter',
            !lineNumber && 'diff__gutter-empty',
            highlightLine && 'diff__gutter--highlight',
            diffClasses,
        );

        const markerClasses = clsx(
            'diff__marker',
            !content && 'diff__line--empty',
            highlightLine && 'diff__line--highlighted',
            diffClasses,
        );

        const contentClasses = clsx(
            'diff__content',
            !content && 'diff__line--empty',
            highlightLine && 'diff__line--highlighted',
            diffClasses,
        );

        return (
            <React.Fragment>
                {!hideLineNumbers && (
                    <td
                        className={gutterClasses}
                        onClick={
                            lineNumber && onLineNumberClickProxy(lineNumberTemplate)
                        }
                    >
                        <pre className='diff__line-number'>{lineNumber}</pre>
                    </td>
                )}
                {!splitView && !hideLineNumbers && (
                    <td
                        className={gutterClasses}
                        onClick={
                            additionalLineNumber &&
							onLineNumberClickProxy(additionalLineNumberTemplate)
                        }
                    >
                        <pre className='diff__line-number'>{additionalLineNumber}</pre>
                    </td>
                )}
                <td
                    className={markerClasses}
                >
                    <pre>
                        {added && '+'}
                        {removed && '-'}
                    </pre>
                </td>
                <td
                    className={contentClasses}
                >
                    <pre className='diff__content-text'>{content}</pre>
                </td>
            </React.Fragment>
        );
    };

    /**
     * Generates lines for split view.
     *
     * @param obj Line diff information.
     * @param obj.left Life diff information for the left pane of the split view.
     * @param obj.right Life diff information for the right pane of the split view.
     * @param index React key for the lines.
     */
    const renderSplitView = ({ left, right }: LineInformation, index: number) =>
    {
        return (
            <tr
                key={index}
                className='diff__line'
            >
                {renderLine(left?.lineNumber, left?.type, LineNumberPrefix.LEFT, left?.value)}
                {renderLine(left?.lineNumber, right?.type, LineNumberPrefix.RIGHT, right?.value,
                )}
            </tr>
        );
    };

    /**
     * Generates lines for inline view.
     *
     * @param obj Line diff information.
     * @param obj.left Life diff information for the added section of the inline view.
     * @param obj.right Life diff information for the removed section of the inline view.
     * @param index React key for the lines.
     */
    const renderInlineView = ({ left, right }: LineInformation, index: number): JSX.Element =>
    {
        let content;
        if (left?.type === DiffType.REMOVED && right?.type === DiffType.ADDED)
        {
            return (
                <React.Fragment key={index}>
                    <tr className='diff__line'>
                        {renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, undefined)}
                    </tr>
                    <tr className='diff__line'>
                        {renderLine(undefined, right.type, LineNumberPrefix.RIGHT, right.value, right.lineNumber)}
                    </tr>
                </React.Fragment>
            );
        }
        if (left?.type === DiffType.REMOVED)
        {
            content = renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, undefined);
        }
        if (left?.type === DiffType.DEFAULT)
        {
            content = renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, right?.lineNumber, LineNumberPrefix.RIGHT);
        }
        if (right?.type === DiffType.ADDED)
        {
            content = renderLine(undefined, right.type, LineNumberPrefix.RIGHT, right.value, right.lineNumber);
        }

        return (
            <tr
                key={index}
                className='diff__line'
            >
                {content}
            </tr>
        );
    };

    /**
     * Pushes the target expanded code block to the state. During the re-render,
     * this value is used to expand/fold unmodified code.
     */
    const onBlockExpand = (id: number): void =>
    {
        const newExpandedBlocks = expandedBlocks.slice();
        newExpandedBlocks.push(id);

        setExpandedBlocks(newExpandedBlocks);
    };

    /**
     * Generates cold fold block. It also uses the custom message renderer when available to show
     * cold fold messages.
     *
     * @param num Number of skipped lines between two blocks.
     * @param blockNumber Code fold block id.
     * @param leftBlockLineNumber First left line number after the current code fold block.
     * @param rightBlockLineNumber First right line number after the current code fold block.
     */
    const renderSkippedLineIndicator = (num: number, blockNumber: number, leftBlockLineNumber?: number, rightBlockLineNumber?: number): JSX.Element =>
    {
        const message = codeFoldMessageRenderer
            ? (
                    codeFoldMessageRenderer(
                        num,
                        leftBlockLineNumber,
                        rightBlockLineNumber,
                    )
                )
            : (
                    <pre className='diff__code-fold-content'>Expand {num} lines ...</pre>
                );
        const content = (
            <td>
                <a
                    tabIndex={0}
                    onClick={() => onBlockExpand(blockNumber)}
                >
                    {message}
                </a>
            </td>
        );
        const isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
        return (
            <tr
                key={`${leftBlockLineNumber}-${rightBlockLineNumber}`}
                className='diff__code-fold'
            >
                {!hideLineNumbers && <td className='diff__code-fold-gutter' />}
                <td
                    className={clsx(isUnifiedViewWithoutLineNumbers && 'diff__code-fold-gutter')}
                />

                {/* Swap columns only for unified view without line numbers */}
                {isUnifiedViewWithoutLineNumbers
                    ? (
                            <React.Fragment>
                                <td />
                                {content}
                            </React.Fragment>
                        )
                    : (
                            <React.Fragment>
                                {content}
                                <td />
                            </React.Fragment>
                        )}

                <td />
                <td />
            </tr>
        );
    };

    /**
     * Generates the entire diff view.
     */
    const renderDiff = () =>
    {
        const { lineInformation, diffLines } = computeLineInformation(
            oldValue,
            newValue,
            disableWordDiff,
            compareMethod,
            linesOffset,
        );
        const extraLines = extraLinesSurroundingDiff < 0 ? 0 : extraLinesSurroundingDiff;
        let skippedLines: number[] = [];

        return lineInformation.map((line: LineInformation, i: number) =>
        {
            const diffBlockStart = diffLines[0];
            const currentPosition = diffBlockStart - i;

            if (showDiffOnly)
            {
                if (currentPosition === -extraLines)
                {
                    skippedLines = [];
                    diffLines.shift();
                }

                if (line.left?.type === DiffType.DEFAULT && (currentPosition > extraLines || typeof diffBlockStart === 'undefined') && !expandedBlocks.includes((diffBlockStart)))
                {
                    skippedLines.push(i + 1);
                    if (i === lineInformation.length - 1 && skippedLines.length > 1)
                    {
                        return renderSkippedLineIndicator(skippedLines.length, diffBlockStart, line.left.lineNumber, line.right?.lineNumber);
                    }
                    return null;
                }
            }

            const diffNodes = splitView ? renderSplitView(line, i) : renderInlineView(line, i);

            if (currentPosition === extraLines && skippedLines.length > 0)
            {
                const { length } = skippedLines;
                skippedLines = [];
                return (
                    <React.Fragment key={i}>
                        {renderSkippedLineIndicator(length, diffBlockStart, line.left?.lineNumber, line.right?.lineNumber)}
                        {diffNodes}
                    </React.Fragment>
                );
            }
            return diffNodes;
        },
        );
    };

    const colSpanOnSplitView = hideLineNumbers ? 2 : 3;
    const colSpanOnInlineView = hideLineNumbers ? 2 : 4;

    const title = (leftTitle || rightTitle) && (
        <tr>
            <td
                colSpan={splitView ? colSpanOnSplitView : colSpanOnInlineView}
                className='diff__title-block'
            >
                <pre className='diff__title-left'>{leftTitle}</pre>
            </td>
            {splitView && (
                <td
                    colSpan={colSpanOnSplitView}
                    className='diff__title-block'
                >
                    <pre className='diff__title-right'>{rightTitle}</pre>
                </td>
            )}
        </tr>
    );

    const nodes = renderDiff();

    const containerClasses = clsx(
        'diff__container',
        splitView && 'diff__split-view',
    );

    return (
        <table className={containerClasses}>
            <tbody>
                {title}
                {nodes}
            </tbody>
        </table>
    );
};
