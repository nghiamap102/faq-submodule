import { Container } from "@vbd/vui";
import React, { CSSProperties, useEffect, useState } from "react";
import './ToggleButton.scss';
type ToggleButtonProps = {
    style?: CSSProperties;
    color: string;
    value?: boolean;
    onChange: (public_status: any) => void;
};
const ToggleButton: React.FC<ToggleButtonProps> = ({
    style,
    onChange,
    value,
    color,
}) => {
    const [active, setActive] = useState(value);
    const handleClick = () => {
        setActive(!active);
        onChange(!active);
    }
    useEffect(() => {
        setActive(value)
    }, [value])
    return (
        <Container
            style={{ color: `${active ? color : 'white'}`, ...style }}
            className={`toggle-switch`}
            onClick={handleClick}
        >
            <Container className={`toggle-switch-button ${active ? 'active' : ''}`}>
                <Container className="toggle-switch-slide" />
            </Container>
            <Container className={`toggle-switch-bg ${active ? 'active-bg' : ''} `} />
        </Container>
    );
};

export default ToggleButton;