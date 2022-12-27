import { Container, FAIcon, Flex, HD6, ResponsiveGrid, ResponsiveGridItem, T } from '@vbd/vui';
import React from 'react';
import { Link } from 'react-router-dom';
type Props = {
    data: any[];
};
export const BlockPreview: React.FC<Props> = ({
    data
}) => {
    return (
        <Container className='mb-3'>
            <ResponsiveGrid >
                {data?.map((ele) => (
                    <ResponsiveGridItem key={ele.title} >
                        <Flex
                            direction='col'
                            className={`block-item ${ele.bg}`}
                        >
                            <HD6 className='title'><T>{ele.title}</T></HD6>
                            <HD6 className='count'>{ele.count}</HD6>
                            <Flex
                                justify='end'
                            >
                                <Link
                                    className='more-in4'
                                    to={ele.linkTo}
                                >
                                    <T>more</T>
                                    <FAIcon
                                        icon='arrow-right'
                                        size="10px"
                                        className="mx-2"
                                    />
                                </Link>
                            </Flex>
                        </Flex>
                    </ResponsiveGridItem>
                ))}
            </ResponsiveGrid>
        </Container>
    );
};