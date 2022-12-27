import './AdministrativeBoundary.scss';

import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Container, Row, MapControlButton, Positioned, FlexPanel, PanelHeader, Breadcrumb, Line, useI18n, useTenant, Expanded } from '@vbd/vui';

import PostalCodeBoundary from './PostalCodeBoundary';
import MainAdminBoundary from './MainAdminBoundary';
import AdministrativeLayers from './AdministrativeLayers';

import { MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';
import { CommonHelper } from 'helper/common.helper';


let AdministrativeBoundary = (props) =>
{
    const abStore = props.fieldForceStore.adminBoundaryStore;

    const { t } = useI18n();
    const config = useTenant();
    const mapOptions = config['mapOptions'] || MAP_OPTIONS;

    const mapButtonRef = React.useRef();
    const [isExpand, setExpand] = React.useState(false);
    const [areaMain, setAreaMain] = React.useState({});
    const mainAdminRef = React.useRef();

    React.useLayoutEffect(()=>
    {
        abStore.init();
    },[]);

    React.useEffect(() =>
    {
        if (isExpand)
        {
            togglePopup();
        }
    }, [props.location]);

    const togglePopup = ()=> setExpand(!isExpand);

    const getBreadcrumb = ()=>
    {
        if (abStore.selectedPath?.length > 0)
        {
            const abc = abStore.selectedPath.map(item => ({
                ...item,
                id: item.admin.Id,
                label: t(item.admin.Title),
            }));
            return abc;
        }
        return [];
    };

    const handleBreadcrumbClick = (item) =>
    {
        if (item.level === 0)
        {
            abStore.mapStore?.map.flyTo({
                center: [mapOptions.longitude, mapOptions.latitude],
                zoom: mapOptions.zoom,
            });
        }
        if (mainAdminRef?.current?.onSelect)
        {
            mainAdminRef?.current?.onSelect(item.level, item.admin);
        }
    };

    const handleMainAdminSelect = (type, AdminID) =>
    {
        setAreaMain({ type, AdminID });
    };

    const isPostalCode = CommonHelper.isPostalCode(config.country);

    return (
        <Container className="">
            <AdministrativeLayers />

            <MapControlButton
                onClick={togglePopup}
                active={isExpand}
                icon="sitemap"
                ref={mapButtonRef}
            />

            {isExpand &&
                <Positioned
                    top={'0.5rem'}
                    right={'4rem'}
                    className="action-menu"
                >
                    <FlexPanel className="admin-boundaries-popup-container ">
                        <PanelHeader >{props.title}</PanelHeader>
                        <Container className="admin-boundaries-breadcrumb">
                            <Breadcrumb onCommonClick={handleBreadcrumbClick} nodes={getBreadcrumb()}/>
                        </Container>
                        <Line color={'var(--border)'} />

                        <Row width={isPostalCode ? 450 : 250} >
                            <Expanded>
                                <MainAdminBoundary
                                    ref={mainAdminRef}
                                    onSelect ={handleMainAdminSelect}
                                    title={props.root}
                                />
                            </Expanded>
                            {
                                isPostalCode &&
                                <Expanded>
                                    <PostalCodeBoundary
                                        parent={areaMain}
                                    />
                                </Expanded>
                            }
                        </Row>
                    </FlexPanel>
                </Positioned>
            }
           
        </Container>
    );
};

AdministrativeBoundary.propTypes = {
    title: PropTypes.string,
    root: PropTypes.string,
};

AdministrativeBoundary.defaultProps = {
    title: 'Ranh giới hành chính',
    root: 'Việt Nam',
};

AdministrativeBoundary = inject('appStore', 'fieldForceStore')(observer(AdministrativeBoundary));
AdministrativeBoundary = withRouter(AdministrativeBoundary);
export default AdministrativeBoundary;
