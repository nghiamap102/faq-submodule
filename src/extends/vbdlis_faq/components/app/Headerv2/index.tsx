import { Container, Flex } from "@vbd/vui";
import React, { ReactChild, ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";
import './Headerv2.scss';
type Headerv2Props = {
    children?: ReactChild | ReactNode | ReactElement;
    background?: boolean;
    style?: any;
};
export const Headerv2: React.FC<Headerv2Props> = ({
    children,
    background,
    style,
}) => {
    return (
        <>
            <Container
                className={`header ${background ? 'background' : ''}`}
                {...style}
            >
                <Container className="container">
                    <Flex
                        justify="between"
                        items="center"
                    >
                        <Link
                            className={`logo ${background ? 'mini' : ''}`}
                            to="/"
                        >
                            Vbdlis-Faq
                        </Link>
                        {children}
                        {/* <Button
                            text="sign in"
                            className="btn-login"
                        /> */}
                    </Flex>
                </Container>
            </Container>
        </>
    );
};