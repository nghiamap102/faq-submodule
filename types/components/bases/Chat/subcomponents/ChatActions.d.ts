export function ChatActions(props: any): JSX.Element;
export namespace ChatActions {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const onSendMessage: PropTypes.Requireable<(...args: any[]) => any>;
        const maxTextareaHeight: PropTypes.Requireable<string>;
        const scrollToBottom: PropTypes.Requireable<(...args: any[]) => any>;
        const groupId: PropTypes.Requireable<string>;
    }
    namespace defaultProps {
        const maxTextareaHeight_1: string;
        export { maxTextareaHeight_1 as maxTextareaHeight };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=ChatActions.d.ts.map