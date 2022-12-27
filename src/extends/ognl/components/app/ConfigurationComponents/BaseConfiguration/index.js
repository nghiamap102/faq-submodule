import { FormControlLabel, Input, CheckBox } from "@vbd/vui";
import { useEffect, useState } from "react";

// export interface BaseConfigurationParameters {
//     label?: string,
//     showLabel?: boolean
// }

// interface BaseConfigurationParameterProp {
//     config?: BaseConfigurationParameters,
//     onChange?
// }

const BaseConfiguration = (props) => {
    const { onChange, config } = props;
    const [label, setLabel] = useState(config?.label || '');
    const [showLabel, setShowLabel] = useState(config?.showLabel || false);

    useEffect(() => {
        if (onChange) onChange({ label, showLabel });
    }, [label, showLabel]);

    return (<>
        <FormControlLabel
            label="Tiêu đề"
            direction="column"
            control={(
                <Input
                    placeholder="Nhập tiêu đề ..."
                    value={label}
                    onChange={(value) => {
                        //TODO:Assigning label config to the component
                        setLabel(value);
                    }} />
            )} />
        <CheckBox
            label="Hiển thị tiêu đề"
            checked={showLabel}
            onChange={(value) => {
                setShowLabel(value);
            }}
        />
    </>);
}

export default BaseConfiguration;

