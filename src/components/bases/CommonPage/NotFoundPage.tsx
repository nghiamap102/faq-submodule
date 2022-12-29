
import React from 'react';

import { HD1, Sub1 } from 'components/bases/Text/Text';
import { Button } from 'components/bases/Button/Button';
import { Col2 } from 'components/bases/Layout/Column';
import { Box } from 'components/bases/Layout/Box';

import './NotFoundPage.scss';

export const NotFoundPage = ():JSX.Element =>
{
    return (
        <div className={'not-found-page'}>
            <Col2
                grow={0}
                items='center'
                item
            >
                <HD1 style={{ marginBottom: 0 }}>404</HD1>
                <Sub1>Không tìm thấy trang</Sub1>
            </Col2>
            <Box sx={{ mt: 10 }}>
                <Button
                    text={'Trang chủ'}
                    color={'primary'}
                    size="lg"
                    onClick={() =>
                    {
                        window.location.href = '/';
                    }}
                />
            </Box>
        </div>
    );
};
