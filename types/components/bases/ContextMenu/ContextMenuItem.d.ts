/// <reference types="react" />
import { IContactMenuAction } from '../../../components/bases/ContextMenu/ContextMenu';
export declare type ContextMenuItemProps = {
    index: number;
    onClose: () => void;
} & IContactMenuAction;
export declare const ContextMenuItem: (props: ContextMenuItemProps) => JSX.Element | null;
//# sourceMappingURL=ContextMenuItem.d.ts.map