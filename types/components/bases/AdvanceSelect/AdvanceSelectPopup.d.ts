export class AdvanceSelectPopup extends React.Component<any, any, any> {
    static getDerivedStateFromProps(nextProps: any, prevState: any): {
        options: any;
        keyPressValue?: undefined;
    } | {
        options: any;
        keyPressValue: any;
    } | null;
    constructor(props: any);
    constructor(props: any, context: any);
    scrollRef: React.RefObject<any>;
    containerRef: React.RefObject<any>;
    clickable: boolean;
    numOfCol: number;
    preventScroll: (event: any) => void;
    handleKeyPress: (e: any) => void;
    onSelectItem: (e: any, optionId: any, active: any) => void;
    renderDropdownContent: (option: any, hasDividers: any) => JSX.Element;
}
export namespace AdvanceSelectPopup {
    namespace propTypes {
        const onSelectChange: PropTypes.Requireable<(...args: any[]) => any>;
        const multi: PropTypes.Requireable<boolean>;
        const isVisible: PropTypes.Requireable<boolean>;
        const isLoading: PropTypes.Requireable<boolean>;
        const options: PropTypes.Validator<any[]>;
        const selectedValue: PropTypes.Requireable<any>;
        const width: PropTypes.Requireable<string>;
        const noneSelectValue: PropTypes.Requireable<string>;
        const titleText: PropTypes.Requireable<string>;
        const searchable: PropTypes.Requireable<boolean>;
        const isGridView: PropTypes.Requireable<boolean>;
        const getInputRef: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const selectedValue_1: string;
        export { selectedValue_1 as selectedValue };
        const titleText_1: string;
        export { titleText_1 as titleText };
        const noneSelectValue_1: string;
        export { noneSelectValue_1 as noneSelectValue };
        const isVisible_1: boolean;
        export { isVisible_1 as isVisible };
        const isGridView_1: boolean;
        export { isGridView_1 as isGridView };
        export function onSelectChange_1(): void;
        export { onSelectChange_1 as onSelectChange };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=AdvanceSelectPopup.d.ts.map