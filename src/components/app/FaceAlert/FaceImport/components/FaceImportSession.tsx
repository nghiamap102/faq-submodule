import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import {
    Button,
    Paging,
    FlexPanel, PanelBody, PanelFooter,
} from '@vbd/vui';

import { FaceImportContext } from '../FaceImportContext';

import { SessionList } from './SessionList';
import UploadGalleryButton from './UploadGalleryButton';
import UploadImageFolderButton from './UploadImagesButton';

export let FaceImportSession: React.FC = (props) =>
{
    const { totalSessions, sessionPageSize, sessionPageIndex, setSessionPageIndex } = useContext(FaceImportContext);
    return (
        <FlexPanel width={'27rem'}>
            <PanelBody>
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                    <UploadImageFolderButton />
                    <UploadGalleryButton />

                    <a
                        href='/c4i2/DanhSachDoiTuong.xlsx'
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
                            icon='download'
                            text='Tải mẫu'
                        />
                    </a>
                </div>
                <SessionList />
                <PanelFooter>
                    <Paging
                        total={totalSessions}
                        currentPage={sessionPageIndex}
                        pageSize={sessionPageSize}
                        onChange={(value: number) =>
                        {
                            setSessionPageIndex(value);
                        }}
                    />
                </PanelFooter>
            </PanelBody>
        </FlexPanel>
    );
};

FaceImportSession = observer(FaceImportSession);
