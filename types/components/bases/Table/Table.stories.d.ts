declare namespace _default {
    export const title: string;
    export { Table as component };
    export namespace subcomponents {
        export { TableRow };
        export { TableRowCell };
    }
    export const args: {};
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    export namespace args_1 {
        export { headers };
        export const width: string;
    }
    export { args_1 as args };
}
export function WithFixedHeader(args: any): JSX.Element;
export namespace WithFixedHeader {
    export namespace args_2 {
        export { headers };
        const width_1: string;
        export { width_1 as width };
        export const isFixedHeader: boolean;
    }
    export { args_2 as args };
}
import { Table } from "../../../components/bases/Table";
import { TableRow } from "../../../components/bases/Table";
import { TableRowCell } from "../../../components/bases/Table";
declare const headers: ({
    label: string;
    width: string;
    col: number;
    subCols?: undefined;
} | {
    label: string;
    width: string;
    subCols: {
        label: string;
    }[];
    col?: undefined;
} | {
    label: string;
    width: string;
    col?: undefined;
    subCols?: undefined;
})[];
//# sourceMappingURL=Table.stories.d.ts.map