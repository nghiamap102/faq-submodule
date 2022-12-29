export class SuggestItem extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleClick: () => void;
    handleClickSetting: (e: any) => void;
    renderContent: () => JSX.Element;
}
export namespace SuggestItem {
    namespace propTypes {
        const data: PropTypes.Requireable<any>;
        const onClickSetting: PropTypes.Requireable<(...args: any[]) => any>;
        const highlight: PropTypes.Requireable<boolean>;
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=SuggestItem.d.ts.map