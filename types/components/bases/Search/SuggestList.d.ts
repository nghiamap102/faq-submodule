export class SuggestList extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleClick: (data: any, index: any) => void;
    handleClickSetting: (data: any) => void;
}
export namespace SuggestList {
    namespace propTypes {
        const data: PropTypes.Requireable<any[]>;
        const onClickSetting: PropTypes.Requireable<(...args: any[]) => any>;
        const onSelect: PropTypes.Requireable<(...args: any[]) => any>;
        const highlightIndex: PropTypes.Requireable<number>;
        const highlightId: PropTypes.Requireable<any>;
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=SuggestList.d.ts.map