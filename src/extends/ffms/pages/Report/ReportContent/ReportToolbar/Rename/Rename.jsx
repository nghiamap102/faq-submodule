import './Rename.scss';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Button } from '@vbd/vui';
import { T } from '@vbd/vui';
import { Input } from '@vbd/vui';

import PopupWrapper, { PopupFooter } from 'extends/ffms/pages/base/Popup';
import reportService from 'extends/ffms/services/ReportService';

const Rename = ({ data, onCompleted , disabled }) =>
{
    const [reportName, setReportName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() =>
    {
        if (data)
        {
            setReportName(data.Title);
        }
    }, [data]);

    const handleClick = async () =>
    {
        setLoading(true);
        const result = await reportService.update(data.Id, {
            title: reportName.trim(),
            content: data.Content,
        });
        setLoading(false);
        if (result.errorMessage)
        {
            setError('Lỗi cập nhật dữ liệu.');
            return false;
        }
        else
        {
            _.isFunction(onCompleted) && onCompleted(result);
            return true;
        }
    };

    return (
        <>
            <PopupWrapper
                trigger={
                    <Button
                        icon='pencil'
                        label={'Rename'}
                        className='custom-button'
                        disabled={disabled}
                    />
                }
                title={'Rename current report'}
                modal
                width='30rem'
                padding={'1rem'}
            >
                <label required-label='*'><T>Tên báo cáo</T></label>
                <Input
                    type={'text'}
                    className={'form-control custom'}
                    value={reportName}
                    onChange={(value) =>
                    {
                        setReportName(value);
                        setError('');
                    }}
                />
                {error && <label><T>{error}</T></label>}
                <PopupFooter>
                    <Button
                        close
                        label={'Cancel'}
                    />
                    <Button
                        label={'Rename'}
                        color={'primary'}
                        disabled={_.size(reportName.trim()) == 0 || loading}
                        onClick={handleClick}
                    />
                </PopupFooter>
            </PopupWrapper>
        </>
    );
};

Rename.propTypes = {
    data: PropTypes.object,
    onCompleted: PropTypes.func,
    disabled: PropTypes.bool,
};

export default Rename;
