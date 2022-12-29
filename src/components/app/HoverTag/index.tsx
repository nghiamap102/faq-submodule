import { Container } from "@vbd/vui";
import React, { ReactChild, ReactNode, useState } from "react";
import './HoverTag.scss';
type HoverProps = {
    handleClickFilter?: (id: string) => void;
    children?: ReactChild | ReactNode;
};
const HoverTag: React.FC<HoverProps> = ({
    handleClickFilter,
    children,
}) => {
    const [enter, setEnter] = useState(false);
    return (
        <Container
            className={`tag ${enter ? 'bg-purple' : ''}`}
            onClick={handleClickFilter}
            onMouseEnter={() => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
        >
            {children}
        </Container>
    );
};

export default HoverTag;