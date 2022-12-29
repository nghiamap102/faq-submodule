export function ChatView(props: any): JSX.Element;
export namespace ChatView {
    namespace propTypes {
        const profile: PropTypes.Requireable<object>;
        const messages: PropTypes.Requireable<any[]>;
        const noMoreMessage: PropTypes.Requireable<boolean>;
        const group: PropTypes.Requireable<object>;
        const latestReadMessageId: PropTypes.Requireable<string>;
        const setScrollRef: PropTypes.Requireable<(...args: any[]) => any>;
        const onLoadMoreMessage: PropTypes.Requireable<(...args: any[]) => any>;
        const trackingReadLatestMessage: PropTypes.Requireable<(...args: any[]) => any>;
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=ChatView.d.ts.map