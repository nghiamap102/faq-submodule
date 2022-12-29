export class Paging extends React.Component<any, any, any> {
    constructor(props: any);
    constructor(props: any, context: any);
    getPager: (totalItems: any, currentPage?: number, _pageSize?: number) => {
        totalItems: any;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        startPage: number;
        endPage: number;
        startIndex: number;
        endIndex: number;
        pages: number[];
    };
    changePage: (page: any, isChange: any) => void;
}
export namespace Paging {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const total: PropTypes.Requireable<number>;
        const currentPage: PropTypes.Requireable<number>;
        const pageSize: PropTypes.Requireable<number>;
        const showFirstLast: PropTypes.Requireable<boolean>;
        const onChange: PropTypes.Requireable<(...args: any[]) => any>;
    }
    namespace defaultProps {
        const className_1: string;
        export { className_1 as className };
        const total_1: number;
        export { total_1 as total };
        const currentPage_1: number;
        export { currentPage_1 as currentPage };
        const pageSize_1: number;
        export { pageSize_1 as pageSize };
        const showFirstLast_1: boolean;
        export { showFirstLast_1 as showFirstLast };
        export function onChange_1(): void;
        export { onChange_1 as onChange };
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=Paging.d.ts.map