import React from 'react';
import moment from 'moment';

import { Link } from 'components/bases/Link/Link';
import { Tag } from 'components/bases/Tag';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { Image } from 'components/bases/Image/Image';
import { MapControl } from 'components/bases/MapControl/MapControl';

import { DisplayChart } from './DisplayChart';
import { DataTypes } from './DataTypes';

import './DynamicDisplay.scss';

export interface DynamicDisplayProps {
    schema: DataTypes;
    value: any;
    format?: string; // datetime
    locale?: string; // currency
    options?: any; // select
}

export const DynamicDisplay: React.FC<DynamicDisplayProps> = (props) =>
{
    const { schema, value, format, locale, options, ...rest } = props;

    if (value === undefined)
    {
        return null;
    }
    const displayComponent = () =>
    {

        switch (schema)
        {
            case DataTypes.Boolean:
                return (
                    <CheckBox checked={!!value} />
                );

            case DataTypes.Currency:
                return (
                    <div className='number'>
                        {formatCurrency(value, locale)}
                    </div>
                );

            case DataTypes.Datetime:
                return (
                    <div className='datetime'>
                        <span className='time'>
                            {moment(value).format(format || 'LT')}
                        </span>
                    </div>
                );

            case DataTypes.Date:
                return (
                    <div className='datetime'>
                        <span className='date'>
                            {moment(value).format(format || 'L')}
                        </span>
                    </div>
                );

            case DataTypes.Numeric:
                return (
                    <div className={'number'}>
                        {formatNumeric(value, format)}
                    </div>
                );

            case DataTypes.JSON:
                return (
                    <div className='text'>
                        { JSON.stringify(value)}
                    </div>
                );

            case DataTypes.Link:
                return (
                    <Link
                        href={value ?? '#'}
                    >
                        {value}
                    </Link>
                );

            case DataTypes.Select:
            {
                const option = options?.find((option: any) => option.id === value);
                const defaultColor = 'var(--default-color)';

                return option
                    ? (
                            <Tag
                                text={option.label}
                                color={option.color || defaultColor}
                            />
                        )
                    : (
                            <Tag
                                text={value}
                                color={defaultColor}
                            />
                        );
            }

            case DataTypes.MultiSelect:
                return options?.filter((option: any) => value?.includes(option.id)).map((option: any) => (
                    <Tag
                        key={option?.id}
                        text={option?.label}
                        color={option?.color}
                    />
                ),
                );

            case DataTypes.Image:
                return <Image src={value} />;

            case DataTypes.Chart:
                return (
                    <DisplayChart
                        value={value}
                        options={{ ...options, ...rest }}
                    />
                );
            case DataTypes.Map:
            case DataTypes.MapVN2000:
            {
                let geoJsonValue = value;

                if (value && typeof value !== 'string')
                {
                    geoJsonValue = JSON.stringify(value);
                }

                return (
                    <MapControl
                        placeholder={'Nhấp để đặt vị trí'}
                        value={geoJsonValue || ''}
                        readOnly
                    />
                );
            }

            default:
                return (
                    <div className='undefined'>
                        {value}
                    </div>
                ) ;
        }
    };

    return (
        <div className='dynamic-display'>
            {displayComponent()}
        </div>
    );
};

const formatCurrency = (number: number, locale?: string) =>
{
    switch (locale)
    {
        case 'vi':
        {
            const parts = number.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join('.') + 'đ';
        }
        default:
        {
            const parts = number.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return '$' + parts.join('.');
        }
    }
};

// format: \# or #.## or #,##
const formatNumeric = (number: number, format?: string) =>
{
    switch (format)
    {
        case '#,##':
            return Number(number).toFixed(2).toString().replaceAll('.', ',');
        case '#.##':
            return Number(number).toFixed(2);
        default:
            return number;
    }
};
