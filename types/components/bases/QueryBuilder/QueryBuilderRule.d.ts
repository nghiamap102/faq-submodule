export class QueryBuilderRule extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    handlePropertyChanged: (property: any) => void;
    handleOperatorChanged: (operator: any) => void;
    handleValueChange: (value: any) => void;
    fillRuleStatus(data: any, props: any): void;
    queryFormStatus: () => {
        property: string;
        operator: null;
        value: string;
    };
    getOperators: (property: any) => {
        id: number;
        label: string;
    }[];
}
export namespace QueryBuilderRule {
    namespace propTypes {
        const ruleID: PropTypes.Requireable<string>;
        const options: PropTypes.Requireable<object>;
        const onClick: PropTypes.Requireable<(...args: any[]) => any>;
        const deleteRule: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const ruleID_1: string;
        export { ruleID_1 as ruleID };
        export function onClick_1(): void;
        export { onClick_1 as onClick };
        export function deleteRule_1(): void;
        export { deleteRule_1 as deleteRule };
        const options_1: {};
        export { options_1 as options };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=QueryBuilderRule.d.ts.map