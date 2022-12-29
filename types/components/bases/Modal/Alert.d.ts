import { PopupProps } from '../../../components/bases/Popup/Popup';
import './Dialog.scss';
export declare type AlertProps = {
    message: string;
} & Pick<PopupProps, 'title' | 'onOk'>;
export declare const Alert: (props: AlertProps) => JSX.Element;
//# sourceMappingURL=Alert.d.ts.map