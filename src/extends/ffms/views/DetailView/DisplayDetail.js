import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Section, withI18n, withModal } from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';

import LocationViewer from 'extends/ffms/components/MiniMap/LocationViewer';
import PropertiesInfo from 'extends/ffms/views/DetailView/ViewSection/PropertiesInfo';

class DisplayDetail extends Component
{
    render()
    {
        const { data, properties, layerName, viewConfig = {} } = this.props;

        properties.forEach((prop) =>
        {
            const config = prop.Config ? (typeof (prop.Config) === 'string' ? JSON.parse(prop.Config) : prop.Config) : { custom: { isID: false, isSystem: false } };
            if (config && config.custom && config.custom.isSystem)
            {
                prop.IsSystem = true;
            }
        });

        const displayProperties = properties.filter((p) => p.ColumnName && !p.IsSystem);

        return (
            <>
                {
                    this.props.basicInfo &&
                    <Section header={viewConfig.basicInfoTitle || 'Thông tin cơ bản'} >
                        {this.props.basicInfo}
                    </Section>
                }

                {
                    !viewConfig.hideOtherInfo &&
                    <Section header={viewConfig.otherInfoTitle || 'Thông tin khác'}>
                        <PropertiesInfo
                            data={data}
                            properties={displayProperties}
                        />
                    </Section>
                }
                {
                    !viewConfig.hideMapLocation && data && !isEmpty(data) &&
                        <LocationViewer
                            data={data}
                            layer={layerName}
                            properties={properties}
                        />
                }

                {this.props.customInfo}
            </>
        );
    }
}

DisplayDetail.propTypes = {
    layerName: PropTypes.string,
    properties: PropTypes.array,
    data: PropTypes.object,
    basicInfo: PropTypes.any,

    viewConfig: PropTypes.shape({
        basicInfoTitle: PropTypes.string,
        hideOtherInfo: PropTypes.bool,
        otherInfoTitle: PropTypes.string,
        hideMapLocation: PropTypes.bool,
    }),

    customInfo: PropTypes.any,
};
DisplayDetail.defaultProps = {
    data: {},
    properties: [],
};

DisplayDetail = inject('appStore', 'fieldForceStore')(observer(DisplayDetail));
DisplayDetail = withModal(withI18n(withRouter(DisplayDetail)));
export default DisplayDetail;
