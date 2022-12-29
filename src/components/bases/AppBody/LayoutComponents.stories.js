import React from 'react';

import { Box } from 'components/bases/Layout/Box';
import { PageTitle } from 'components/bases/Page/PageTitle';
import { Row2 } from 'components/bases/Layout/Row';
import { Col2 } from 'components/bases/Layout/Column';

export default {
    title: 'Layout/Row - Column',
    decorators: [(Story) => <Box sx={{ height: '1/2', border: 'px' }}><Story /></Box>],
};

export const Default = (args) =>
{
    return (
        <Col2
            height='full'
            divide
        >
            <PageTitle>Page title</PageTitle>
            <Row2 divide>
                <Col2 sx={{ p: 4 }}>
                    Column 1 - Row 1
                </Col2>
                <Col2 sx={{ p: 4 }}>
                    Column 2 - Row 1
                </Col2>
            </Row2>
            <Row2 divide>
                <Col2 sx={{ p: 4 }}>
                    Column 1 - Row 2
                </Col2>
                <Col2 sx={{ p: 4 }}>
                    Column 2 - Row 2
                </Col2>
            </Row2>
        </Col2>
    );
};

export const Alignment = (args) =>
{
    return (
        <>
            <Box sx={{ height: '1/2' }}>
                <Row2 height='full'>
                    <Col2
                        justify='center'
                        sx={{
                            p: 4,
                            bgColor: 'neutral500',
                        }}
                    >
                        Column mainAxisAlignment = center
                    </Col2>
                    <Col2
                        justify='end'
                        sx={{
                            p: 4,
                            bgColor: 'neutral400',
                        }}
                    >
                        Column mainAxisAlignment = end
                    </Col2>
                </Row2>
            </Box>
            <Box sx={{ height: '1/2' }}>
                <Row2
                    height='full'
                    justify='around'
                >
                    <Col2
                        sx={{
                            p: 4,
                            bgColor: 'neutral400',
                        }}
                    >
                        Row mainAxisAlignment = space-around
                    </Col2>
                    <Col2
                        sx={{
                            p: 4,
                            bgColor: 'neutral500',
                        }}
                    >
                        Row mainAxisAlignment = space-around
                    </Col2>
                </Row2>
            </Box>
        </>
    );
};
