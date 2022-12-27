import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Button } from '@vbd/vui';
import PopupWrapper, { PopupFooter } from 'extends/ffms/pages/base/Popup';
import reportService from 'extends/ffms/services/ReportService';
import { T } from '@vbd/vui';
import { useI18n } from '@vbd/vui';


const Delete = ({ data, onCompleted ,disabled }) =>
{
    const { t } = useI18n();

    const [reportName, setReportName] = useState();
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
        const result = await reportService.delete(data.Id);
        setLoading(false);
        if (result.errorMessage)
        {
            setError(`${t('Lỗi cập nhật dữ liệu.')}`);
            return false;
        }
        else
        {
            _.isFunction(onCompleted) && onCompleted(result.data, 'DELETE');
            return true;
        }
    };

    return (
        <>
            <PopupWrapper
                trigger={
                    <Button
                        icon='trash-alt'
                        label={'Delete'}
                        className='custom-button'
                        disabled={disabled}
                    />
                }
                title={'CONFIRM'}
                modal
                width='30rem'
                padding={'1rem'}
            >
                <T>Bạn có chắc chắn muốn xóa</T> {`'${reportName}'?`}
                <PopupFooter>
                    <Button
                        close
                        label={'Cancel'}
                    />
                    <Button
                        onClick={handleClick}
                        label={'OK'}
                        color={'primary'}
                    />
                </PopupFooter>
            </PopupWrapper>
        </>
    );
};

Delete.propTypes = {
    data: PropTypes.object,
    onCompleted: PropTypes.func,
    disabled: PropTypes.bool,
};

export default Delete;
