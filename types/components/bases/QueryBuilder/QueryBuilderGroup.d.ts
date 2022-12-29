export class QueryBuilderGroup extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    ruleRefs: any[];
    groupRefs: any[];
    clickCondition: (value: any) => void;
    clickNo: () => void;
    addRule: () => void;
    addGroup: () => void;
    deleteSelf: () => void;
    deleteRule: (idRandom: any) => void;
    deleteGroup: (idRandom: any) => void;
    setRuleRef: (ref: any) => void;
    setGroupRef: (ref: any) => void;
    fillFormStatus: (data: any) => void;
    queryFormStatus: () => {
        no: boolean;
        condition: string;
        rules: any[];
        layer: any;
    };
}
export namespace QueryBuilderGroup {
    namespace propTypes {
        const layerData: PropTypes.Requireable<any[]>;
        const idGroup: PropTypes.Requireable<string>;
        const queryData: PropTypes.Requireable<object>;
        const isFirst: PropTypes.Requireable<boolean>;
        const deleteGroup: PropTypes.Requireable<(...args: any[]) => any>;
        const deleteRule: PropTypes.Requireable<(...args: any[]) => any>;
        const props: PropTypes.Validator<any[]>;
    }
    namespace defaultProps {
        const layerData_1: never[];
        export { layerData_1 as layerData };
        const idGroup_1: string;
        export { idGroup_1 as idGroup };
        const isFirst_1: boolean;
        export { isFirst_1 as isFirst };
        export function deleteGroup_1(): void;
        export { deleteGroup_1 as deleteGroup };
        export function deleteRule_1(): void;
        export { deleteRule_1 as deleteRule };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=QueryBuilderGroup.d.ts.map