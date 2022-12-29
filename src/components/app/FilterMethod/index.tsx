import { Container, Flex, T } from "@vbd/vui";
import React, { useState } from "react";

type FilterMethodProps = {
    title: string;
    count: number;
    onClick?: () => void;
    colorbg: string;
    color_text: string;
};
export const FilterMethod: React.FC<FilterMethodProps> = ({
    color_text,
    colorbg,
    count,
    title,
    onClick,
}) => {
    return (
        <>
            <Flex
                key={title}
                className={`items-center mr-10 py-2 cursor-pointer`}
                onClick={onClick}
            >
                <Container
                    className='px-3 mr-3'
                    style={{ lineHeight: 'normal', fontWeight: 600, backgroundColor: colorbg, color: color_text, borderRadius: '5px' }}
                >
                    {count}
                </Container>
                <Container className='capitalize font-semibold opacity-60'>
                    <T>{title}</T>
                </Container>
            </Flex>
        </>
    );
};