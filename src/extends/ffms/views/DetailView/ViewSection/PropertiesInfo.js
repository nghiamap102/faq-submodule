import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withI18n } from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';
import { SVGIconPath } from 'extends/ffms/bases/IconSvg/SVGIcon';

class PropertiesInfo extends Component
{
    getIconByDataType = (dataType) =>
    {
        switch (dataType)
        {
            case 1: // Checkbox
                return 'data-checkbox';
            case 2: // Number
                return 'data-number';
            case 3: // Textbox
                return 'data-string';
            case 4: // Float/Double
                return 'data-decimal';
            case 5: // Datetime
                return 'data-date-time';
            case 6: // Area field
                return 'data-text-area';
            case 7: // Map
                return 'route-map';
            case 8: // Rich Text
                return 'data-rich-text';
            case 10: // Combobox
                return 'data-combo-box';
            default:
                return 'info-circle';
        }
    }

    render()
    {
        const { data = {}, properties = [] } = this.props;

        return (
            properties?.map((prop) =>
            {
                let value = `${data[prop.ColumnName]}`;
                if (isEmpty(data[prop.ColumnName]))
                {
                    value = 'Không có dữ liệu';
                }
                else if (prop.DataType === 5)
                {
                    value = moment(value).format('L')
                }

                return (
                    prop.DataType !== 7 && !isEmpty(data[prop.ColumnName]) ?
                    <PlainListItem
                        key={prop.ColumnName}
                        sub={value}
                        label={prop.DisplayName || 'Ghi chú'}
                        icon={
                            <SVGIconPath
                                name={this.getIconByDataType(prop.DataType)}
                                width={'18px'}
                                height={'18px'}
                                fill={'rgba(var(--contrast-color-rgb), 0.5)'}
                            />
                        }
                    /> : null
                );
            })
        );
    }
}

PropertiesInfo.propTypes = {
    data: PropTypes.object,
    properties: PropTypes.array,
};
PropertiesInfo = withI18n(inject('appStore', 'fieldForceStore')(observer(PropertiesInfo)));
export default PropertiesInfo;
