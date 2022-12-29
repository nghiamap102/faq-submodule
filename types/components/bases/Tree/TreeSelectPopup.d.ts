export class TreeSelectPopup extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handleTreeChecked: (nodeSelected: any) => void;
    nodeSelected: any;
    handleSave: () => void;
}
export namespace TreeSelectPopup {
    namespace propTypes {
        const data: PropTypes.Requireable<any[]>;
        const expandAll: PropTypes.Requireable<boolean>;
        const onSave: PropTypes.Requireable<(...args: any[]) => any>;
        const onClose: PropTypes.Requireable<(...args: any[]) => any>;
        const nodeSelected: PropTypes.Requireable<any[]>;
    }
    namespace defaultProps {
        const data_1: never[];
        export { data_1 as data };
        const expandAll_1: boolean;
        export { expandAll_1 as expandAll };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=TreeSelectPopup.d.ts.map