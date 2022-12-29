export function ChatBoxComponent(props: any): JSX.Element;
export namespace ChatBoxComponent {
    namespace propTypes {
        const profile: PropTypes.Requireable<object>;
        const group: PropTypes.Requireable<object>;
        const messages: PropTypes.Requireable<any[]>;
        const noMoreMessage: PropTypes.Requireable<boolean>;
        const onSendMessage: PropTypes.Requireable<(...args: any[]) => any>;
        const onClickUser: PropTypes.Requireable<(...args: any[]) => any>;
        const onClose: PropTypes.Requireable<(...args: any[]) => any>;
        const onAddMember: PropTypes.Requireable<(...args: any[]) => any>;
        const onLoadMoreMessage: PropTypes.Requireable<(...args: any[]) => any>;
        const onSetting: PropTypes.Requireable<(...args: any[]) => any>;
        const onMute: PropTypes.Requireable<(...args: any[]) => any>;
        const trackingReadLatestMessage: PropTypes.Requireable<(...args: any[]) => any>;
        const draft: PropTypes.Requireable<string>;
        const setDraft: PropTypes.Requireable<(...args: any[]) => any>;
        const width: PropTypes.Requireable<string>;
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=ChatBoxComponent.d.ts.map