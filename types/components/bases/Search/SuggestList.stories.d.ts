declare namespace _default {
    export const title: string;
    export { SuggestList as component };
    export namespace subcomponents {
        export { SuggestItem };
    }
}
export default _default;
export function Default(args: any): JSX.Element;
export namespace Default {
    namespace args {
        export { data };
    }
}
export function HighlightedItem(args: any): JSX.Element;
export namespace HighlightedItem {
    export namespace args_1 {
        export { data };
        export const highlightIndex: number;
    }
    export { args_1 as args };
}
import { SuggestList } from "../../../components/bases/Search/SuggestList";
import { SuggestItem } from "../../../components/bases/Search/SuggestItem";
declare const data: ({
    favLocation: string;
    isMyLocation: boolean;
    query: string;
    hint: string;
    history?: undefined;
} | {
    query: string;
    hint: string;
    history: boolean;
    favLocation?: undefined;
    isMyLocation?: undefined;
} | {
    query: string;
    hint: string;
    favLocation?: undefined;
    isMyLocation?: undefined;
    history?: undefined;
})[];
//# sourceMappingURL=SuggestList.stories.d.ts.map