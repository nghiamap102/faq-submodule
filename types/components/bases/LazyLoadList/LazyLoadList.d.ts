export class LazyLoadList extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleClickItem(obj: any, index: any): void;
}
export namespace LazyLoadList {
    namespace propTypes {
        const items: PropTypes.Requireable<any>;
        const isSearching: PropTypes.Requireable<boolean>;
        const titleField: PropTypes.Requireable<string>;
        const subTitleField: PropTypes.Requireable<string>;
        const iconUrlField: PropTypes.Requireable<string>;
        const onItemClicked: PropTypes.Requireable<(...args: any[]) => any>;
        const onMenuClick: PropTypes.Requireable<(...args: any[]) => any>;
        const onYReachEnd: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=LazyLoadList.d.ts.map