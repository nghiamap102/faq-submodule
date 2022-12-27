import './JobTimeline.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import _omit from 'lodash/omit';
import Promise from 'bluebird';

import { Section, T } from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import MiniMapViewer from 'extends/ffms/components/MiniMap/MiniMapViewer';
import GeocodeService from 'extends/ffms/services/GeocodeService';
export class JobLocation extends Component
{
    geocodeSvc = new GeocodeService();
    comSvc = this.props.fieldForceStore.comSvc;

    datatypeSevenColumns = [];

    state = {
        isShowMapPopup: false,
        geoData: null,
        geocodedGeoData: null,
    };
    
    randomColors = ['cyan', 'pink', 'magenta', 'aquamarine', 'black', 'gray', 'yellow', 'green'];
    colorCounter = 0;

    buildAddressInfo = async (geoData) =>
    {
        const newGeoData = [];
        await Promise.mapSeries(geoData, async (data) =>
        {
            if (!data.addressString || data.addressString.length === 0)
            {
                const geocodeRes = await this.geocodeSvc.reverseGeocode([[data.lng, data.lat]]);

                if (geocodeRes && geocodeRes.data && geocodeRes.data.length > 0)
                {
                    const road = (geocodeRes.data[0].Road && geocodeRes.data[0].Road !== '') ? `${geocodeRes.data[0].Road}, ` : '';
                    const village = (geocodeRes.data[0].Village && geocodeRes.data[0].Village !== '') ? `${geocodeRes.data[0].Village}, ` : '';
                    const tehsil = (geocodeRes.data[0].Tehsil && geocodeRes.data[0].Tehsil !== '') ? `${geocodeRes.data[0].Tehsil}, ` : '';
                    const district = (geocodeRes.data[0].District && geocodeRes.data[0].District !== '') ? `${geocodeRes.data[0].District}, ` : '';
                    const state = (geocodeRes.data[0].State && geocodeRes.data[0].State !== '') ? `${geocodeRes.data[0].State}, ` : '';
    
                    const geocodeAddress = road + village + tehsil + district + state;
                    if (geocodeAddress.length === 0)
                    {
                        newGeoData.push({
                            ..._omit(data, 'addressString'),
                            addressString: 'Không có địa chỉ',
                        });
                    }
                    else
                    {
                        newGeoData.push({
                            ..._omit(data, 'addressString'),
                            addressString: geocodeAddress,
                        });
                    }
                }
                else
                {
                    newGeoData.push({
                        ..._omit(data, 'addressString'),
                        addressString: 'Không có địa chỉ',
                    });
                }
            }
            else
            {
                newGeoData.push(data);
            }
        });
        
        return newGeoData;
    };

    async componentDidMount()
    {
        const { data = {} } = this.props;
        const jobProps = await this.comSvc.getLayerProperties('JOB');
        jobProps.forEach((prp) =>
        {
            if (prp.DataType === 7)
            {
                this.datatypeSevenColumns.push({ column: prp.ColumnName, display: prp.DisplayName });
            }
        });

        // Create geoData to show on minimap
        const geoData = [];
        const datatypeSevenColumnNames = this.datatypeSevenColumns.map((col) => col.column);
        const datatypeSevenFieldNames = this.datatypeSevenColumns.reduce((all, col) =>
        {
            all[col.column] = col.display;
            return all;
        }, {});
        Object.keys(data).forEach((prp) =>
        {
            if (datatypeSevenColumnNames.includes(prp) && !CommonHelper.isFalsyValue(data[prp]))
            {
                let addressString = '';
                const fieldName = prp.substring(0, prp.length - 9);
                const road = (data[`${fieldName}_address_street`] && data[`${fieldName}_address_street`] !== '') ? `${data[`${fieldName}_address_street`]}, ` : '';
                const village = (data[`${fieldName}_address_village`] && data[`${fieldName}_address_village`] !== '') ? `${data[`${fieldName}_address_village`]}, ` : '';
                const tehsil = (data[`${fieldName}_address_tehsil`] && data[`${fieldName}_address_tehsil`] !== '') ? `${data[`${fieldName}_address_tehsil`]}, ` : '';
                const district = (data[`${fieldName}_address_district`] && data[`${fieldName}_address_district`] !== '') ? `${data[`${fieldName}_address_district`]}, ` : '';
                const state = (data[`${fieldName}_address_state`] && data[`${fieldName}_address_state`] !== '') ? `${data[`${fieldName}_address_state`]}, ` : '';
    
                addressString = road + village + tehsil + district + state;

                let lng = '';
                let lat = '';
                if (typeof data[prp] === 'string' && JSON.parse(data[prp]))
                {
                    lng = JSON.parse(data[prp]).coordinates[0];
                    lat = JSON.parse(data[prp]).coordinates[1];
                }
                else
                {
                    lng = data[prp].coordinates[0];
                    lat = data[prp].coordinates[1];
                }
                geoData.push({
                    lng,
                    lat,
                    fieldType: prp,
                    fieldName: datatypeSevenFieldNames[prp],
                    addressString,
                    markerColor: this.setMarkerColor(prp, this.randomColors[Math.round(Math.random() * 10)]),
                });
            }
        });

        const geocodedGeoData = await this.buildAddressInfo(geoData);

        this.setState({
            geoData,
            geocodedGeoData,
        });
    }

    
    setMarkerColor = (prp, randomColor) =>
    {
        let markerColor = '#0072dc';
        if (randomColor)
        {
            if (prp.includes('destination'))
            {
                markerColor = '#80d309';
            }
            else if (!prp.includes('origin'))
            {
                markerColor = randomColor[this.colorCounter];
                this.colorCounter++;
            }
        }
        return markerColor;
    };

    render()
    {
        const { data = {} } = this.props;
        
        return (
            <Section header={'Bản đồ các địa điểm'}>
                {
                    this.state.geoData ?
                        <>
                            {
                                this.state.geocodedGeoData ?
                                    <MiniMapViewer
                                        geoData={this.state.geocodedGeoData}
                                        // addressStrings={this.state.addressStrings}
                                        recordData={data}
                                    /> : null
                            }
                        </> :
                        <T>Không có dữ liệu vị trí</T>
                }

            </Section>
        );
    }
}

JobLocation.propTypes = {
    // data: PropTypes.shape({
    //     job_status_id: PropTypes.number,
    //     job_duration: PropTypes.number,
    //     job_distance: PropTypes.number,
    //     job_assignee_guid: PropTypes.string,
    //     job_destination_address_roomnumber: PropTypes.string,
    //     job_destination_address_floor: PropTypes.string,
    //     job_destination_address_block: PropTypes.string,
    //     job_destination_address_buiding: PropTypes.string,
    //     job_destination_address_buidingnumber: PropTypes.string,
    //     job_destination_address_street: PropTypes.string,
    //     job_destination_address_village: PropTypes.string,
    //     job_destination_address_tehsil: PropTypes.string,
    //     job_destination_address_district: PropTypes.string,
    //     job_destination_address_state: PropTypes.string,
    //     job_destination_address_pincode: PropTypes.string,

    //     activityLogs: PropTypes.arrayOf(PropTypes.object),
    //     jobReports: PropTypes.arrayOf(PropTypes.object),
    //     assignee: PropTypes.shape({
    //         employee_full_name: PropTypes.string
    //     }),
    //     customer: PropTypes.shape({
    //         customer_fullname: PropTypes.string
    //     }),
    // })
    data: PropTypes.object,
};

JobLocation = inject('appStore', 'fieldForceStore')(observer(JobLocation));
export default JobLocation;
