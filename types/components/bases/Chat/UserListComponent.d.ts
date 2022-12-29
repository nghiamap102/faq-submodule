export function UserListComponent(props: any): JSX.Element;
export namespace UserListComponent {
    namespace propTypes {
        const userList: PropTypes.Requireable<any[]>;
        const userSelectedList: PropTypes.Requireable<any[]>;
        const onClickUser: PropTypes.Requireable<(...args: any[]) => any>;
        const getAction: PropTypes.Requireable<(...args: any[]) => any>;
        const getInfo: PropTypes.Requireable<(...args: any[]) => any>;
        const hideCheckbox: PropTypes.Requireable<boolean>;
    }
    namespace defaultProps {
        const userList_1: never[];
        export { userList_1 as userList };
        const userSelectedList_1: never[];
        export { userSelectedList_1 as userSelectedList };
    }
}
import PropTypes from "prop-types";
//# sourceMappingURL=UserListComponent.d.ts.map