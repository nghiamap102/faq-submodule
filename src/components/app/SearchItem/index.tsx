import { Container, Flex, HD6, Li, T } from "@vbd/vui";
import React from "react";
import { Link } from "react-router-dom";
import './SearchItem.scss';
type SearchItemProps = {
    link: string;
    title?: string;
};
export const SearchItem: React.FC<SearchItemProps> = ({
    link,
    title,
}) => {
    return (
        <>
            <Container className="search_item">
                <Link
                    to={link}
                    className="link"
                >
                    <Flex
                        className="items"
                        direction="col"
                    >
                        <HD6 className="caption">VBDLIS-FAQ</HD6>
                        <HD6>{title}</HD6>
                    </Flex>
                </Link>
            </Container>
        </>
    );
};