import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import { Loading, TB1, EmptyData, FAIcon, Field, Label, Info, ContainField } from '@vbd/vui';

import { FileField } from 'components/app/File/FileField';

import { AppConstant } from 'constant/app-constant';
import LayerService from 'services/layer.service';

const imageUrl = `${AppConstant.vdms.url}/App/Document/FileHandler.ashx?DocId=`;

class POIContent extends Component
{
    popupStore = this.props.appStore.popupStore;

    layerSvc = new LayerService();
    layerInfo = {};

    propExcludes = [
        'MimeType',
        'CreatedDate',
        'CreatedUserId',
        'Description',
        'Id',
        'NodeId',
        'Title',
        'Layer',
        'Location',
        'ModifiedDate',
        'ModifiedUserId',
        'Name',
        'Path',
        'Shape',
        'Type',
        'WKT',
        'WorkflowStatus',
    ];

    typeExcludes = [7];

    minDate = moment.utc('0001-01-01');

    state = {
        loading: true,
        filesChild: null,
        fileImageChild: null, // image have clicked
    };

    constructor(props)
    {
        super(props);

        this.layerSvc.getLayerProps(this.props.contents.Layer).then((layerInfo) =>
        {
            this.layerInfo = layerInfo.data;

            this.setState({ loading: false });
        });
    }

    componentDidMount()
    {
        const filesChild = [];

        // get file child
        this.layerSvc.getLayers({ path: this.props.contents.Path }).then((res) =>
        {
            res.data && res.data.forEach((node) =>
            {
                if (node.Type !== 'folder')
                {
                    filesChild.push(node);
                }
            });

            this.setState({ filesChild });
        });
    }

    handleOpenIframeImage = (fileContent) =>
    {
        fileContent.url = imageUrl + fileContent.Id;
        this.popupStore.setImagePopup(fileContent);
    };

    renderField = (fieldName) =>
    {
        if (this.propExcludes.includes(fieldName) || !this.props.contents[fieldName] || (this.props.displayFields && !this.props.displayFields.includes(fieldName)))
        {
            return null;
        }

        let displayName = fieldName;
        let fieldValue = this.props.contents[fieldName];

        if (this.layerInfo && this.layerInfo.Properties && this.layerInfo.Properties.length)
        {
            const propInfo = this.layerInfo.Properties.find((prop) => prop.ColumnName === fieldName);

            if (propInfo)
            {
                if (this.typeExcludes.includes(propInfo.DataType))
                {
                    return null;
                }

                if (propInfo.IsView === false)
                {
                    return null;
                }

                displayName = propInfo.DisplayName;

                if (propInfo.DataType === 1)
                {
                    fieldValue = fieldValue ? <FAIcon icon={'check'} /> : <FAIcon icon={'times'} />;
                }
                else if (propInfo.DataType === 5)
                {
                    if (!moment.utc(fieldValue).isAfter(this.minDate))
                    {
                        fieldValue = <TB1 secondary>Không có dữ liệu</TB1>;
                    }
                    else
                    {
                        fieldValue = moment(fieldValue).format(this.props.format?.[propInfo.DataType] || 'L LT');
                    }
                }
                else if (propInfo.DataType === 10)
                {
                    if (fieldValue.startsWith('[') && fieldValue.endsWith(']'))
                    {
                        const val = JSON.parse(fieldValue);
                        fieldValue = val.length === 1 ? val[0] : val;
                    }
                }
            }
        }

        return (
            <Field key={fieldName}>
                <Label width={this.props.labelWidth}>{displayName}</Label>
                <Info>{fieldValue}</Info>
            </Field>
        );
    };

    render()
    {
        const { filesChild } = this.state;

        const renderFields = Object.keys(this.props.contents).map(this.renderField).filter((x) => x);

        return (
            this.state.loading
                ? <Loading />
                : (
                        <ContainField className={this.props.className}>
                            {renderFields && renderFields.length > 0 ? renderFields : <EmptyData />}

                            {filesChild && filesChild.length > 0 && filesChild.map((fileInfo) => (
                                <FileField
                                    key={fileInfo.FileId}
                                    fileInfo={fileInfo}
                                    onLinkClick={this.handleOpenIframeImage}
                                />
                            ))}
                        </ContainField>
                    )
        );
    }
}

POIContent.propTypes = {
    labelWidth: PropTypes.string,
    className: PropTypes.string,
    contents: PropTypes.object,
    displayFields: PropTypes.arrayOf(PropTypes.string),
};

POIContent.defaultProps = {
    labelWidth: '120px',
};

POIContent = inject('appStore')(observer(POIContent));
export { POIContent };
