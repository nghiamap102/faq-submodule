import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    SectionHeader,
    T, withI18n, Row,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import defaultPhoto from './images/photo.jpg';
import { FileImage } from 'extends/ffms/pages/base/File/FileImage';

export class JobReportGallery extends Component
{
    comSvc = this.props.fieldForceStore.comSvc;
    
    state = { collection: {} };

    componentDidMount = () =>
    {
        if (this.props.data)
        {
            const jobGuid = this.props.data.job_guid;

            this.comSvc.queryData('photos', { photo_job_guid: jobGuid }).then(async (rs) =>
            {
                if (rs && rs.data && rs.data.length)
                {
                    const defaultCollectionName = `${this.props.t('Hình ảnh')}`;
                    const collection = { [defaultCollectionName]: [] };
                    const jobTypeId = await this.comSvc.getDatabaseValue('JOB', 'job_type_id', this.props.data.job_type_id);
                    const jobType = await this.comSvc.getById('job-types', jobTypeId);

                    if (jobType && jobType.jobtype_config)
                    {
                        const jobTypeConfig = jobType.jobtype_config;
                        const config = JSON.parse(jobTypeConfig);
                        if (config.photo)
                        {
                            CommonHelper.getUniqueValues(config.photo, 'Name').forEach((name) =>
                            {
                                collection[name] = [];
                            });
                        }
                    }
                
                    rs.data.forEach((x) =>
                    {
                        // if (x.photo_link && typeof (x.photo_link) === 'string')
                        // {
                        //     const image = JSON.parse(x.photo_link);
                        //     x.photo_link = `/api/ffms/containers/file-stream?fileId=${image.guid}&mimeType=${image.mimetype}`;
                        // }
                        if (x.photo_collection && collection.hasOwnProperty(x.photo_collection))
                        {
                            collection[x.photo_collection].push(x);
                        }
                        else if (x.photo_type)
                        {
                            if (!collection[x.photo_type])
                            {
                                collection[x.photo_type] = [];
                            }
                            collection[x.photo_type].push(x);
                        }
                        else if (collection[defaultCollectionName])
                        {
                            collection[defaultCollectionName].push(x);
                        }
                    });

                    this.setState({ collection });
                }
            });
        }
    };

    render()
    {
        return Object.keys(this.state.collection).map((key) =>
        {
            return (
                this.state.collection[key] && this.state.collection[key].length > 0 &&
                    <>
                        <SectionHeader>
                            <T>{key}</T>
                        </SectionHeader>
                        <Row
                            mainAxisAlignment={'space-between'}
                        >
                            {
                                this.state.collection[key].map((p) =>
                                    <FileImage
                                        key={p.Id}
                                        width={'13rem'}
                                        height={'13rem'}
                                        fitMode={'cover'}
                                        className={'receipt'}
                                        altSrc={defaultPhoto}
                                        info={p.photo_link}
                                        canEnlarge
                                    />,
                                )
                            }
                        </Row>
                    </>
            );
        });
    }
}


JobReportGallery = withI18n(inject('appStore', 'fieldForceStore')(observer(JobReportGallery)));
export default JobReportGallery;

