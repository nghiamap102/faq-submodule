export class StyleSwitcher extends React.Component<any, any, any> {
    static propTypes: {
        onChangeMapStyle: PropTypes.Validator<(...args: any[]) => any>;
        onToggleMapOverlay: PropTypes.Validator<(...args: any[]) => any>;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    handleToggleFab: () => void;
    onChangeMapStyle: (style: any) => void;
    onToggleMapOverlay: (overlay: any) => void;
}
export namespace StyleSwitcher {
    namespace defaultProps {
        const showOverlays: boolean;
    }
}
import React from "react";
import PropTypes from "prop-types";
//# sourceMappingURL=StyleSwitcher.d.ts.map