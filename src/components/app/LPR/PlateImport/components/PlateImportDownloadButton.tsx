import React from 'react';

import { Button } from '@vbd/vui';

export const PlateImportDownloadButton: React.FC = () =>
{
    return (
        <a
            href='/c4i2/DanhSachBienSoXe.xlsx'
            target='_blank'
        >
            <Button
                size='sm'
                style={{
                    display: 'inline-block',
                    marginLeft: '0.5rem',
                    marginTop: 'unset',
                    color: 'var(--contrast-color)',
                    backgroundColor: 'unset',
                }}
                text='Tải mẫu'
            />
        </a>
    );
};
