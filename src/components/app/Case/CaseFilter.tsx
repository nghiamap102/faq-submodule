import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { LayerHelper } from 'services/utilities/layerHelper';

import {
    Input, CheckBox, DateTimePicker, AdvanceSelect, Section,
    FormGroup, FormControlLabel,
    FlexPanel, PanelBody, PanelFooter,
    useMergeState,
} from '@vbd/vui';

import { CaseContext } from './CaseContext';

const CaseFilter: React.FC = () =>
{
    const {
        caseProps,
        spatialSearch,
        refetch,
        setCaseState,
        caseService,
    } = useContext<any>(CaseContext);

    const [searchState, setSearchState] = useMergeState({
        tenVuViec: '',
        phanLoai: '',
        idCanBo: '',
        trangThai: '',
        diaBan: '',
        nguonPhatHien: '',
        nguyCap: false,
        tinhChatVuViec: '',
        donViXuLy: '',
        idCanBoSua: '',
        spatialSearch: false,
        timePeriodSearch: false,
        from: moment().add(-1, 'months').toDate(),
        to: moment().endOf('date').toDate(),
        searchKey: '',
    });

    useEffect(() =>
    {
        caseService.getUsers();
        if (caseProps && JSON.stringify(caseProps) !== JSON.stringify({}))
        {
            buildAllFilterOption().then((rs: any) =>
            {
                setAllFilterOption(rs);
            });
        }
    }, [caseProps]);
    const [allFilterOption, setAllFilterOption] = useState({
        idCanBos: [],
        phanLoais: [],
        trangThais: [],
        diaBans: [],
        nguonPhatHiens: [],
        tinhChatVuViec: [],
        donViXuLys: [],
        idCanBoSuas: [],
    });

    useEffect(() =>
    {
        buildFilterQuery();
    }, [searchState]);

    const buildFilterQuery = () =>
    {
        const {
            tenVuViec,
            phanLoai,
            idCanBo,
            trangThai,
            diaBan,
            nguonPhatHien,
            nguyCap,
            tinhChatVuViec,
            donViXuLy,
            idCanBoSua,
            from,
            to,
            searchKey,
            spatialSearch,
            timePeriodSearch,
        } = searchState;

        const filterQuery = [];

        if (tenVuViec)
        {
            filterQuery.push(`TENVUVIEC:*${tenVuViec}*`);
        }
        if (phanLoai)
        {
            filterQuery.push(`PHANLOAI:${phanLoai}`);
        }
        if (idCanBo)
        {
            filterQuery.push(`ID_CANBO:${idCanBo}`);
        }
        if (trangThai)
        {
            filterQuery.push(`TRANGTHAI:${trangThai}`);
        }
        if (diaBan)
        {
            filterQuery.push(`DIABAN:${diaBan}`);
        }
        if (nguonPhatHien)
        {
            filterQuery.push(`NGUONPHATHIEN:${nguonPhatHien}`);
        }
        if (nguyCap)
        {
            filterQuery.push('NGUYCAP:(1)');
        }
        if (nguonPhatHien)
        {
            filterQuery.push(`NGUONPHATHIEN:${nguonPhatHien}`);
        }
        if (tinhChatVuViec)
        {
            filterQuery.push(`TINHCHATVUVIEC:${tinhChatVuViec}`);
        }
        if (donViXuLy)
        {
            filterQuery.push(`DONVIXULY:${donViXuLy}`);
        }
        if (idCanBoSua)
        {
            filterQuery.push(`ID_CANBO_SUA:${idCanBoSua}`);
        }
        if (timePeriodSearch && from && to)
        {
            filterQuery.push(`NGAYGHINHAN:[${new Date(from).toISOString()} TO ${new Date(to).toISOString()}]`);
        }
        setCaseState({
            filterQuery: filterQuery,
            searchKey,
        });
    };

    const buildAllFilterOption = async () =>
    {
        const defaultOption = { id: null, label: 'Tất cả' };
        return {
            idCanBos: [defaultOption, ...((await caseService.getUsers()).data?.map((user: any) =>
            {
                return {
                    id: user,
                    label: user,
                };
            }) || [])],
            trangThais: [defaultOption, ...(await LayerHelper.propsToOption(caseProps, '', caseProps['TRANGTHAI'].Config, false))],
            phanLoais: [defaultOption, ...(await LayerHelper.propsToOption(caseProps, '', caseProps['PHANLOAI'].Config, false))],
            diaBans: [defaultOption, ...(await LayerHelper.propsToOption(caseProps, '', caseProps['DIABAN'].Config, false))],
            nguonPhatHiens: [defaultOption, ...(await LayerHelper.propsToOption(caseProps, '', caseProps['NGUONPHATHIEN'].Config, false))],
            tinhChatVuViec: [defaultOption, ...(await LayerHelper.propsToOption(caseProps, '', caseProps['TINHCHATVUVIEC'].Config, false))],
            donViXuLys: [defaultOption, ...(await LayerHelper.propsToOption(caseProps, '', caseProps['DONVIXULY'].Config, false))],
            // idCanBoSuas: [defaultOption, ...(await commonService.layerPropsToOption(caseProps, '', caseProps['ID_CANBO_SUA'].Config, true))],
        };
    };

    const handleSearch = () =>
    {
        refetch();
    };
    return (
        <FlexPanel width={'20rem'}>
            <PanelBody scroll>
                <Section header={'Tìm theo từ khóa'}>
                    <FormGroup>
                        <FormControlLabel
                            // label={'Từ khóa'}
                            control={(
                                <Input
                                    value={searchState.searchKey}
                                    placeholder={'Nhập từ khóa'}
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ searchKey: value });
                                    }}
                                />
                            )}
                        />
                    </FormGroup>
                </Section>
                <Section header={'Thông tin vụ việc'}>
                    <FormGroup>
                        <FormControlLabel
                            label={'Tên vụ việc'}
                            control={(
                                <Input
                                    value={searchState.tenVuViec}
                                    placeholder={'Nhập tên vụ việc'}
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ tenVuViec: value });
                                    }}
                                />
                            )}
                        />
                        <FormControlLabel
                            label={'Loại vụ việc'}
                            control={(
                                <AdvanceSelect
                                    placeholder="Tất cả"
                                    options={allFilterOption.phanLoais}
                                    value={searchState.phanLoai}
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ phanLoai: value });
                                    }}
                                />
                            )}
                        />
                        <FormControlLabel
                            label={'Người tạo'}
                            control={(
                                <AdvanceSelect
                                    placeholder="Tất cả"
                                    options={allFilterOption.idCanBos}
                                    value={searchState.idCanBo}
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ idCanBo: value });
                                    }}
                                />
                            )}
                        />
                        <FormControlLabel
                            label={'Trạng thái'}
                            control={(
                                <AdvanceSelect
                                    placeholder="Tất cả"
                                    options={allFilterOption.trangThais}
                                    value={searchState.trangThai}
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ trangThai: value });
                                    }}
                                />
                            )}
                        />
                        <FormControlLabel
                            label={'Tính chất vụ việc'}
                            control={(
                                <AdvanceSelect
                                    placeholder="Tất cả"
                                    options={allFilterOption.tinhChatVuViec}
                                    value={searchState.tinhChatVuViec}
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ tinhChatVuViec: value });
                                    }}
                                />
                            )}
                        />
                        <CheckBox
                            label="Chuyển lên cho TTCH xử lý"
                            checked={searchState.nguyCap}
                            onChange={(value: boolean) =>
                            {
                                setSearchState({ nguyCap: value });
                            }}
                        />
                    </FormGroup>
                </Section>

                <Section header={'Khoảng thời gian'}>
                    <FormGroup>
                        <CheckBox
                            label="Tìm theo thời gian"
                            checked={searchState.timePeriodSearch}
                            onChange={(value: any) =>
                            {
                                setSearchState({ timePeriodSearch: value });
                            }}
                        />
                        <FormControlLabel
                            label={'Từ'}
                            labelWidth={'3rem'}
                            control={(
                                <DateTimePicker
                                    maxDate={searchState.to}
                                    disabled={!searchState.timePeriodSearch}
                                    value={searchState.from}
                                    showTimeSelect
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ from: value });
                                    }}
                                />
                            )}
                        />
                        <FormControlLabel
                            label={'Đến'}
                            labelWidth={'3rem'}
                            control={(
                                <DateTimePicker
                                    minDate={searchState.from}
                                    disabled={!searchState.timePeriodSearch}
                                    value={searchState.to}
                                    showTimeSelect
                                    onChange={(value: any) =>
                                    {
                                        setSearchState({ to: value });
                                    }}
                                />
                            )}
                        />
                    </FormGroup>
                </Section>

                <Section header={'Truy vấn không gian'}>
                    <FormGroup>
                        <CheckBox
                            label="Truy vấn không gian"
                            checked={spatialSearch}
                            onChange={(value: any) =>
                            {
                                setCaseState({ spatialSearch: value });
                            }}
                        />
                    </FormGroup>
                </Section>

            </PanelBody>

            <PanelFooter
                actions={[
                    {
                        text: 'Tìm kiếm', onClick: handleSearch,
                    },
                ]}
            />
        </FlexPanel>
    );
};
export default CaseFilter;
