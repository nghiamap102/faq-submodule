import React, { useContext, useEffect, useRef } from 'react';
import { FormControlLabel } from 'components/bases/Form';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { Input } from 'components/bases/Input';
import { Col2 } from 'components/bases/Layout/Column';
import { Constants } from 'constant/Constants';
import { useMergeState } from 'hooks/useMergeState';
import { AdministrativeMap } from './AdministrativeMap';
import { AdministrativeSearch } from './AdministrativeSearch';
import { AdministrativeMapContext, AdministrativeMapProvider } from './AdministrativeMapContext';
import useConvertCoordinatesToOLC from './useConvertCoordinatesToOLC';

export enum AdminFields {
    location = 'location',
    province = 'province',
    district = 'district',
    ward = 'ward',
    street = 'street',
    address = 'address',
    shortAddress = 'shortAddress',
    floor = 'floor',
    postalCode = 'postalCode'
}

export type ReverseGeocodeResponse = {
    address: string,
    country: string,
    district: string,
    province: string,
    shortAddress: string,
    street: string,
    ward: string
}
export type GetChildByParentIdResponse = {
    AdminID: string | number,
    AdministrativeID: number,
    Id: string,
    Latitude: number,
    Longitude: number,
    Title: string
}[]

export type SearchResponse = {
    id: string,
    address: string,
    latitude: number,
    longitude: number,
    name: string,
    provider: string,
}[]

export type GetAdminIdByNameResponse = {
    province?: number,
    district?: number,
    ward?: number
}

export type Bounds = {
    north?: number,
    east?: number,
    south?: number,
    west?: number,
}

export interface AdministrativeSvc {
    search(text: string, bounds: Bounds): Promise<SearchResponse>

    getChildByParentId(parentId: number, type: string): Promise<GetChildByParentIdResponse>

    reverseGeocode(lng: number, lat: number): Promise<ReverseGeocodeResponse>

    getAdminIdByName(province: string, district: string, ward: string): Promise<GetAdminIdByNameResponse>
}

export type AdministrativeData = {
    location: any,
    province: number | null | undefined,
    district: number | null | undefined,
    ward: number | null | undefined,
    street?: string,
    address?: string,
    floor?: string,
    postalCode?: string,
}

type AdministrativeProps = {
    data?: AdministrativeData,
    required?: boolean
    isReadOnly?: boolean,
    onChange?: Function,
    fields?: AdminFields[],
    dirtyFields?: any,
    mapHeight?: string,
    lngLat?: {
        lng: number,
        lat: number
    }
    administrativeSvc: AdministrativeSvc,
    displayField: string,
    valueField: string,
    labelWidth?: string
}
const adminType = [Constants.TYPE_PROVINCE, Constants.TYPE_DISTRICT, Constants.TYPE_WARD];

const AdministrativeComponent: React.FC<AdministrativeProps> = (props) =>
{
    const {
        data,
        fields = [
            AdminFields.location,
            AdminFields.province,
            AdminFields.district,
            AdminFields.ward,
            AdminFields.address,
            AdminFields.floor,
            AdminFields.postalCode,
        ],
        lngLat = {
            lng: 106.66887141635867,
            lat: 10.782883235202302,
        },
        isReadOnly = false,
        mapHeight,
        onChange,
        administrativeSvc,
        displayField,
        valueField,
        labelWidth,
    } = props;

    const [options, setOptions] = useMergeState<Record<string, any>>({
        stateOptions: [],
        districtOptions: [],
        wardOptions: [],
    });

    const [adminData, setAdminData] = useMergeState<Record<string, any>>(data || {
        location: undefined,
        province: undefined,
        district: undefined,
        ward: undefined,
        street: undefined,
        address: undefined,
        floor: undefined,
        postalCode: undefined,
    });

    const {
        mapCenter,
        location,
        setAdminMapState,
    } = useContext<any>(AdministrativeMapContext);

    const { postalCode } = useConvertCoordinatesToOLC({
        ...location,
        Tang: adminData?.floor,
    });

    const getChildByParentId = async (parentId: number, type: string) =>
    {
        return await administrativeSvc.getChildByParentId(parentId, type);
    };
    const bindAdminOptions = async (province?: number | null, district?: number | null) =>
    {
        if (!options.stateOptions.length)
        {
            const provinces = await getChildByParentId(0, Constants.TYPE_PROVINCE);
            setAdminOptions(Constants.LEVEL_PROVINCE, provinces);
        }
        if (province)
        {
            const districts = await getChildByParentId(province, Constants.TYPE_DISTRICT);

            setAdminOptions(Constants.LEVEL_DISTRICT, districts);
            if (district)
            {
                const wards = await getChildByParentId(district, Constants.TYPE_WARD);
                setAdminOptions(Constants.LEVEL_WARD, wards);
            }
        }
    };

    const setAdminOptions = (level: number, admins: any) =>
    {
        const adminOptions = mapAdminOptions(admins || []);

        switch (level)
        {
            case Constants.LEVEL_PROVINCE:
                setOptions({
                    stateOptions: adminOptions,
                    districtOptions: [],
                    wardOptions: [],
                });
                break;
            case Constants.LEVEL_DISTRICT:
                setOptions({
                    districtOptions: adminOptions,
                    wardOptions: [],
                });
                break;
            case Constants.LEVEL_WARD:
                setOptions({
                    wardOptions: adminOptions,
                });
                break;
        }
    };

    const mapAdminOptions = (admins = []) =>
    {
        return admins.map((admin: any) =>
        {
            return {
                id: Number(admin[valueField]),
                label: admin[displayField],
                ...admin,
            };
        });
    };
    useEffect(() =>
    {
        let location = data?.location || {
            coordinates: [lngLat.lng, lngLat.lat],
        };
        if (location)
        {
            if (typeof location === 'string')
            {
                location = JSON.parse(location);
            }
            setAdminMapState({
                location: {
                    longitude: location.coordinates[0],
                    latitude: location.coordinates[1],
                },
                mapCenter: {
                    lng: location.coordinates[0],
                    lat: location.coordinates[1],
                },
            });
        }

    }, []);
    const didMountRef = useRef(false);

    useEffect(() =>
    {
        if (Object.values(adminData).every((el: any) => el === undefined || isNaN(el)))
        {
            data && setAdminData(data);
            if (data?.location)
            {
                setAdminMapState({
                    location: {
                        longitude: data.location.coordinates[0],
                        latitude: data?.location?.coordinates[1],
                    },
                    mapCenter: {
                        lng: data.location.coordinates[0],
                        lat: data.location.coordinates[1],
                    },
                });
            }
        }

    }, [data]);

    useEffect(() =>
    {
        if (didMountRef.current)
        {
            onChange && onChange({ ...adminData, postalCode });
        }
        else
        {
            bindAdminOptions(Number(adminData?.province || ''), Number(adminData?.district || '')).then(() =>
            {
                didMountRef.current = true;
            });
        }

    }, [adminData]);

    useEffect(() =>
    {
        if (typeof adminData.province === 'string')
        {
            const province = options.stateOptions.find((option: Record<string, any>) => option.label === adminData.province)?.label;
            bindAdminOptions(Number(province));
            setAdminData({
                province,
            });
        }
        if (typeof adminData.district === 'string')
        {
            const district = options.districtOptions.find((option: Record<string, any>) => option.label === adminData.district)?.label;
            bindAdminOptions(Number(adminData?.province || ''), Number(district));
            setAdminData({
                district,
            });
        }
        if (typeof adminData.ward === 'string')
        {
            const ward = options.wardOptions.find((option: Record<string, any>) => option.label === adminData.ward)?.label;
            setAdminData({
                ward,
            });
        }
    }, [options]);

    const bindRegionField = (level: number, regions: any) =>
    {
        setAdminOptions(level, regions);
    };

    const handleSelectAdmin = async (level: number, adminId: any) =>
    {
        // get child regions of this selected value
        const childLevel = level + 1;
        const type = adminType[childLevel];

        if (type)
        {
            const regions = await getChildByParentId(adminId, type);
            bindRegionField(childLevel, regions);
        }
    };

    const handleLocationChange = async (location: any, changeMapCenter: boolean) =>
    {
        const { longitude, latitude } = location;
        const locationInfo = await administrativeSvc.reverseGeocode(longitude, latitude);

        setAdminMapState({
            location,
            ...changeMapCenter && {
                mapCenter: {
                    lng: longitude,
                    lat: latitude,
                },
            },
        });
        if (locationInfo)
        {
            const rs = await administrativeSvc.getAdminIdByName(locationInfo.province, locationInfo.district, locationInfo.ward);

            await bindAdminOptions(rs.province, rs.district);

            setTimeout(() =>
            {
                setAdminData({
                    location: JSON.stringify({ type: 'Point', coordinates: [longitude, latitude] }),
                    province: rs.province || locationInfo.province,
                    district: rs.district || locationInfo?.district,
                    ward: rs.ward || locationInfo.ward,
                    street: locationInfo?.street,
                    address: locationInfo?.shortAddress,
                    postalCode,
                });
            }, 100);
        }
    };

    const handleStateSelect = async (value: any) =>
    {
        const record = options.stateOptions.find((d: any) => d.id === value);
        let loc = null;
        if (record)
        {
            loc = [record.Longitude, record.Latitude];
            setAdminMapState({
                location: {
                    longitude: record.Longitude,
                    latitude: record.Latitude,
                },
                mapCenter: {
                    lng: record.Longitude,
                    lat: record.Latitude,
                },
            });
        }
        setAdminData({
            province: value,
            district: null,
            ward: null,
            location: JSON.stringify({ type: 'Point', coordinates: loc }),
            street: null,
            address: null,
            shortAddress: null,
            postalCode,
        });
        await handleSelectAdmin(0, value);
    };

    const handleDistrictSelect = async (value: any) =>
    {
        const record = options.districtOptions.find((d: any) => d.id === value);
        let loc = null;
        if (record)
        {
            loc = [record.Longitude, record.Latitude];
            setAdminMapState({
                location: {
                    longitude: record.Longitude,
                    latitude: record.Latitude,
                },
                mapCenter: {
                    lng: record.Longitude,
                    lat: record.Latitude,
                },
            });
        }
        setAdminData({
            district: value,
            ward: null,
            location: JSON.stringify({ type: 'Point', coordinates: loc }),
            postalCode,
        });
        await handleSelectAdmin(1, value);
    };

    const handleWardSelect = (value: any) =>
    {
        const record = options.wardOptions.find((d: any) => d.id === value);
        let loc = null;
        if (record)
        {
            loc = [record.Longitude, record.Latitude];
            setAdminMapState({
                location: {
                    longitude: record.Longitude,
                    latitude: record.Latitude,
                },
                mapCenter: {
                    lng: record.Longitude,
                    lat: record.Latitude,
                },
            });
        }
        setAdminData({
            ward: value,
            location: JSON.stringify({ type: 'Point', coordinates: loc }),
            postalCode,
        });
    };
    const handleAddressChange = (value: string) =>
    {
        setAdminData({
            address: value,
            shortAddress: value,
        });
    };
    const handleFloorChange = (value: string) =>
    {
        setAdminData({
            floor: value,
            postalCode,
        });
    };
    const defaultRules = [{}];

    return (
        <>
            {
                fields.indexOf(AdminFields.location) !== -1 && (
                    <>
                        <AdministrativeSearch
                            administrativeSvc={administrativeSvc}
                            label={'Tìm kiếm'}
                            direction={'row'}
                            onSelectionChange={async (location:any)=>
                            {
                                await handleLocationChange(location, true);
                            }}
                        />
                        <AdministrativeMap
                            height={mapHeight}
                            center={mapCenter || lngLat}
                            zoom={12}
                            scrollZoom={false}
                            isNotControl={false}
                            onLocationChange={handleLocationChange}
                        />
                    </>
                )}
            <Col2
                gap={1}
                sx={{ p: 1 }}
            >
                {
                    fields.indexOf(AdminFields.province) !== -1 && (
                        <FormControlLabel
                            key={AdminFields.province}
                            rules={defaultRules}
                            label={'Tỉnh/ thành'}
                            labelWidth={labelWidth}
                            control={(
                                <AdvanceSelect
                                    placeholder={'Nhập tỉnh/ thành'}
                                    name={AdminFields.province}
                                    value={adminData.province}
                                    options={options.stateOptions}
                                    disabled={isReadOnly}
                                    onChange={handleStateSelect}
                                />
                            )}
                            required
                        />
                    )
                }
                {
                    fields.indexOf(AdminFields.district) !== -1 && (
                        <FormControlLabel
                            key={AdminFields.district}
                            rules={defaultRules}
                            label={'Quận/ huyện'}
                            labelWidth={labelWidth}
                            control={(
                                <AdvanceSelect
                                    placeholder={'Nhập quận/ huyện'}
                                    name={AdminFields.district}
                                    value={adminData.district}
                                    options={options.districtOptions}
                                    disabled={isReadOnly}
                                    onChange={handleDistrictSelect}
                                />
                            )}
                            required
                        />
                    )
                }
                {
                    fields.indexOf(AdminFields.ward) !== -1 && (
                        <FormControlLabel
                            key={AdminFields.ward}
                            rules={defaultRules}
                            label={'Xã/ phường'}
                            labelWidth={labelWidth}
                            control={(
                                <AdvanceSelect
                                    placeholder={'Nhập xã/ phường'}
                                    name={AdminFields.ward}
                                    value={adminData.ward}
                                    options={options.wardOptions}
                                    disabled={isReadOnly}
                                    onChange={handleWardSelect}
                                />
                            )}
                            required
                        />
                    )
                }
                {
                    fields.indexOf(AdminFields.address) !== -1 && (
                        <FormControlLabel
                            key={AdminFields.address}
                            rules={defaultRules}
                            label={'Địa chỉ'}
                            labelWidth={labelWidth}
                            control={(
                                <Input
                                    placeholder={'Nhập địa chỉ'}
                                    name={AdminFields.address}
                                    value={adminData?.address || ''}
                                    disabled={isReadOnly}
                                    onChange={handleAddressChange}
                                />
                            )}
                        />
                    )
                }
                {
                    fields.indexOf(AdminFields.floor) !== -1 && (
                        <FormControlLabel
                            key={AdminFields.floor}
                            rules={defaultRules}
                            label={'Tầng (Chung cư, cao ốc)'}
                            labelWidth={labelWidth}
                            control={(
                                <Input
                                    name={AdminFields.floor}
                                    value={adminData?.floor | 0}
                                    onChange={handleFloorChange}
                                />
                            )}
                        />
                    )
                }
                {
                    fields.indexOf(AdminFields.postalCode) !== -1 && (
                        <FormControlLabel
                            key={AdminFields.postalCode}
                            rules={defaultRules}
                            label={'Postal code'}
                            labelWidth={labelWidth}
                            control={(
                                <Input
                                    name={AdminFields.postalCode}
                                    value={postalCode}
                                    disabled
                                />
                            )}
                        />
                    )
                }
            </Col2>
        </>
    );
};

export const Administrative = (props: AdministrativeProps) =>
{
    return (
        <AdministrativeMapProvider>
            <AdministrativeComponent {...props} />
        </AdministrativeMapProvider>
    );
};
