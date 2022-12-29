import { Container, Flex, HD6, T } from "@vbd/vui";
import React, { ReactChild, ReactElement, ReactNode } from "react";
import './Banner.scss';
type BannerProps = {
    children?: ReactChild | ReactNode | ReactElement;
};
export const Banner: React.FC<BannerProps> = ({
    children,
}) => {
    return (
        <>
            <Container className="banner relative">
                <Flex
                    justify="center"
                    items="center"
                    direction="col"
                    className="banner-inner container"
                >
                    <HD6 className="heading"><T>Chúng tôi có thể giúp gì cho bạn?</T></HD6>
                    {children}
                </Flex>
            </Container>
        </>
    );
};