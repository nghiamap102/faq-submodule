import './Save.scss';
import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Button } from '@vbd/vui';
import { inject, observer } from 'mobx-react';
import PopupWrapper, { PopupFooter } from 'extends/ffms/pages/base/Popup';
import reportService from 'extends/ffms/services/ReportService';
import { T } from '@vbd/vui';


const Save = ({ fieldForceStore, data, onCompleted }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');

    const handleClick = async () =>
    {
        if (!_.get(data, 'Id'))
        {
            return false;
        }
        // console.log(toJS(reportStore.templateContent));
        const result = await reportService.update(data.Id, {
            title: data.Title,
            content: JSON.stringify(reportStore.templateContent)
        });
        if (result.errorMessage)
        {
            return false;
        }
        else
        {
            _.isFunction(onCompleted) && onCompleted(result.data, 'UPDATE');
            return true;
        }
    };

    return (
        <>
            <PopupWrapper
                trigger={
                    <Button
                        label={'Save report'}
                        backgroundColor={'var(--info-color)'}
                    />
                }
                title={'CONFIRM'}
                modal
                width='30rem'
                padding={'1rem'}
            >
                <T params={[data.Title]}>Bạn có chắc chắn muốn lưu báo cáo &apos;%0%&apos;?</T>
                <PopupFooter>
                    <Button
                        close
                        label={'Cancel'}
                    />
                    <Button
                        label={'Save report'}
                        color={'primary'}
                        onClick={handleClick}
                    />
                </PopupFooter>
            </PopupWrapper>
        </>
    );
};

Save.propTypes = {
    data: PropTypes.object,
    onCompleted: PropTypes.func
};
export default inject('fieldForceStore', 'appStore')(observer(Save));
