import { inject, observer } from 'mobx-react';

import {
    FlexPanel, PanelBody, PanelHeader,
    Tab, Tabs,
    T,
} from '@vbd/vui';

import { FSImageDetail } from 'components/app/FSImageDeatail/FSImageDetail';

import { FaceRecognition } from './FaceRecognition/FaceRecognition';
import { FaceDetection } from './FaceDetection/FaceDetection';
import { FaceGallery } from './FaceGallery/FaceGallery';
import AddOrUpdateGalleryWatchList from './FaceGallery/AddOrUpdateGalleryWatchList';
import FaceGalleryAddOrUpdate from './FaceGallery/FaceGalleryAddOrUpdate';
import { FaceImport } from './FaceImport/FaceImport';
import { LiveView } from './LiveView/LiveView';
import { FaceIndex } from './FSManagement/FaceIndex';
import FaceConfig from './FaceConfig/FaceConfig';

import './FaceAlert.scss';

const FACE_TAB = {
    RECOGNIZE: 'recognize',
    DETECT: 'detect',
    GALLERY: 'gallery',
    IMPORT: 'import',
    INDEX: 'index',
    VIEW: 'live',
    CONFIG: 'config',
};

let FaceAlert = (props) =>
{
    const { faceAlertStore, profile } = props.appStore;

    const handleSearchState = () => faceAlertStore.setSearchCollapse(!faceAlertStore.isCollapseSearch);

    return (
        <FlexPanel
            className={'face-alert'}
            flex={1}
        >
            <PanelHeader
                actions={[{
                    icon: faceAlertStore.isCollapseSearch ? 'forward' : 'backward',
                    onClick: handleSearchState,
                }]}
            >
                <T>Nhận dạng gương mặt</T> - Vigilant ©
            </PanelHeader>

            <PanelBody>
                <Tabs
                    selected={faceAlertStore.tabSelected}
                    renderOnActive
                    onSelect={(tabSelected) => faceAlertStore.setTab(tabSelected)}
                >
                    <Tab
                        route={FACE_TAB.RECOGNIZE}
                        title="Nhận dạng"
                    >
                        <FaceRecognition />
                    </Tab>
                    <Tab
                        route={FACE_TAB.DETECT}
                        title="Phát hiện"
                    >
                        <FaceDetection />
                    </Tab>
                    <Tab
                        route={FACE_TAB.GALLERY}
                        title="Thư viện"
                    >
                        <FaceGallery />
                    </Tab>
                    <Tab
                        route={FACE_TAB.IMPORT}
                        title="Nhập liệu"
                    >
                        <FaceImport />
                    </Tab>
                    {profile.roles?.Administrator && (
                        <Tab
                            route={FACE_TAB.INDEX}
                            title="Quản lý chỉ mục"
                        >
                            <FaceIndex />
                        </Tab>
                    )}
                    <Tab
                        route={FACE_TAB.VIEW}
                        title="Trực tiếp"
                    >
                        <LiveView />
                    </Tab>
                    <Tab
                        route={FACE_TAB.CONFIG}
                        title="Thiết lập"
                    >
                        <FaceConfig />
                    </Tab>
                </Tabs>
            </PanelBody>

            <FSImageDetail gallery={[]} />

            <AddOrUpdateGalleryWatchList />
            <FaceGalleryAddOrUpdate />
        </FlexPanel>
    );
};

FaceAlert = inject('appStore')(observer(FaceAlert));
export default FaceAlert;
