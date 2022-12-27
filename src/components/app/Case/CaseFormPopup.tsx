import './CaseForm.scss';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    useModal,
    Input, InputAppend,
    InputGroup, RichText,
    Button, CheckBox,
    FormGroup, FormControlLabel,
    Spacer, Row, Column,
    Loading,
    AdvanceSelect, Section,
    DateTimePicker,
    Expanded,
    FlexPanel, PanelBody,
    Popup, PopupFooter,
    Confirm,
    Administrative,
    AdminFields,
    AdministrativeData,
    GetAdminIdByNameResponse, GetChildByParentIdResponse, ReverseGeocodeResponse,
    SearchResponse,
    useMergeState, ScrollView,
} from '@vbd/vui';

import { CaseContext, CaseFormMode } from './CaseContext';
import SuspectsForm from './SuspectForm';
import VictimsForm from './Victims/VictimsForm';
import { WorkflowReview } from './Workflow/WorkflowReview/WorkflowReview';
import { CommonHelper } from 'helper/common.helper';
import { DirectionService } from 'services/direction.service';
import { WorkflowService } from 'services/workflow.service';
import { LayerHelper } from 'services/utilities/layerHelper';
import { AdministrativeService } from 'services/administrative.service';
import { CaseService } from 'services/case.service';

type CaseFormProps = {
    formType: CaseFormMode.NEW | CaseFormMode.EDIT,
    data?: any,
    eventId?: string,
    callback?: Function,
    onClose?: () => void
}

export type VictimData = {
    Id: string,
    Title: string,
    ID_NANNHAN: string,
    SO_CANCUOC: number | string,
    HOVATEN: string,
    NOI_THUONGTRU: string,
    DIENTHOAI: string,
}

export type SuspectData = {
    Id: string,
    Title: string,
    ID_DOITUONG: string,
    HOVATEN: string,
    SO_CANCUOC: number | string,
    NOI_THUONGTRU: string,
    DIENTHOAI: string,
}

type VictimFormState = {
    open: boolean,
    data: VictimData[],
    cacheData: VictimData[],
}
type SuspectFormState = {
    open: boolean,
    data: SuspectData[],
    cacheData: SuspectData[],
}

const administrativeSvc = {
    getChildByParentId: async (parentId: number, type: string): Promise<GetChildByParentIdResponse> =>
    {
        return await new AdministrativeService().getRegion(type, parentId);
    },
    search: async (text: string, bounds: any): Promise<SearchResponse> =>
    {
        return await new DirectionService().searchAll(text, bounds);
    },
    reverseGeocode: async (lng: number, lat: number): Promise<ReverseGeocodeResponse> =>
    {
        return await new DirectionService().reverseGeocode(lng, lat);
    },
    getAdminIdByName: async (province: string, district: string, ward: string): Promise<GetAdminIdByNameResponse> =>
    {
        const rs = await new CaseService().getAdminIdByName(province, district, ward);
        return {
            province: rs?.data.province,
            district: rs?.data.district,
            ward: rs?.data.ward,
        };
    },
};

const CaseFormPopup: React.FC<CaseFormProps> = (props) =>
{
    const {
        formType,
        data = {},
        eventId,
        callback = () =>
        {
        },
        onClose = () =>
        {
        },
    } = props;

    const {
        caseProps,
        caseService,
        genVictimId,
        genSuspectId,
        allSelectionFieldOptions,
        userOU,
    } = useContext<any>(CaseContext);

    const { toast } = useModal();

    const [victimsForm, setVictimsForm] = useMergeState<VictimFormState>({
        open: false,
        data: [],
        cacheData: [],
    });

    const [suspectsForm, setSuspectsForm] = useMergeState<SuspectFormState>({
        open: false,
        data: [],
        cacheData: [],
    });

    const [changeWfConfirmModel, setChangeWfConfirmModel] = useMergeState({
        open: false,
        loading: false,
        value: null,
    });

    const [wfReviewData, setWfReviewData] = useState<any>();

    const [submitting, setSubmitting] = useState(false);

    const initNewCaseState = {
        APPLICATION: null,
        CAPCHIDAO: null,
        CHUYENDE: null,
        COCAUTOCHUC: null,
        COTOCHUC: null,
        DIABAN: null,
        DIACHI: null,
        DONVIXULY: null,
        Description: null,
        GHICHU: null,
        HINHTHUCCHITIET: null,
        HINHTHUCXULY: null,
        HUYEN: null,
        ID_CANBO: null,
        ID_CANBO_DUYET: null,
        ID_CANBO_SUA: null,
        ID_CANBO_TUCHOI: null,
        ID_DOITUONG: null,
        ID_NANNHAN: null,
        KETQUACHITIET: null,
        KETQUAXULY: null,
        KHAMPHA: null,
        KHOITOVUAN: null,
        LYDO: null,
        Location: null,
        MOTA: null,
        NGAYGHINHAN: null,
        NGAYTHUCHIEN: null,
        NGAYKETTHUC: null,
        NGAYPHANCONG: null,
        NGAYPHEDUYET: null,
        NGAYSUA: null,
        NGAYTAO: new Date(),
        NGAYTUCHOI: null,
        NGUOIPHATHIEN: null,
        NGUONPHATHIEN: null,
        NGUYCAP: null,
        NGUYENNHANCHITIET: null,
        NGUYENNHANXAYRA: null,
        NOIDUNGKHOITO: null,
        NUOC: null,
        PHANLOAI: undefined,
        LOAIVUVIECCHITIET: null,
        PHUONGTHUCCHITIET: null,
        PHUONGTHUCTHUDOAN: null,
        PHUONGTIENCHITIET: null,
        PHUONGTIENGAYAN: null,
        SODOITUONG: '',
        SONANNHAN: '',
        TENVUVIEC: null,
        THIETHAI: null,
        THON: null,
        THUHOITAISAN: null,
        TINH: null,
        TINHCHATVUVIEC: null,
        TRANGTHAI: null,
        Title: null,
        XA: null,
        QUYTRINHXULY: null,
        wfInstanceId: null,
        YKIENCHIDAO: '',
        CREATION_OU: userOU,
        eventId: eventId,
        ...formType === CaseFormMode.EDIT && data,
    };

    const [caseState, setCaseState] = useMergeState(initNewCaseState);

    const [caseTypeDetailOptions, setCaseTypeDetailOptions] = useState([]);

    const [validation, setValidation] = useState({
        TENVUVIEC: true,
        ID_CANBO: true,
        NGAYTAO: true,
        PHANLOAI: true,
        TRANGTHAI: true,
        TINH: true,
        HUYEN: true,
        XA: true,
    });

    const checkValid = () =>
    {
        setValidation({
            TENVUVIEC: !!caseState.TENVUVIEC,
            ID_CANBO: !!caseState.ID_CANBO,
            NGAYTAO: !!caseState.NGAYTAO,
            PHANLOAI: !!caseState.PHANLOAI,
            TRANGTHAI: !!caseState.TRANGTHAI,
            TINH: !!caseState.TINH,
            HUYEN: !!caseState.HUYEN,
            XA: !!caseState.XA,
        });
        return (
            caseState.TENVUVIEC &&
            caseState.ID_CANBO &&
            caseState.NGAYTAO &&
            caseState.PHANLOAI &&
            caseState.TRANGTHAI &&
            caseState.TINH &&
            caseState.HUYEN &&
            caseState.XA
        );
    };

    const getCaseTypeDetailOptions = (parent: string) =>
    {
        caseService.getCaseTypeDetails(parent).then((rs: any) =>
        {
            if (rs?.data)
            {
                setCaseTypeDetailOptions(
                    rs.data.map((option: any) =>
                    {
                        return {
                            id: option.Id,
                            label: option.Title,
                        };
                    }),
                );
            }
        });
    };

    useEffect(() =>
    {
        if (formType === CaseFormMode.NEW)
        {
            caseService.getCreator().then((rs: any) =>
            {
                if (rs)
                {
                    setCaseState({
                        ID_CANBO: rs.UserName,
                    });
                }
            });
        }
        else if (data?.wfCode)
        {
            getWfReviewData(data.wfCode);
        }
    }, []);

    useEffect(() =>
    {
        if (caseState.PHANLOAI)
        {
            getCaseTypeDetailOptions(caseState.PHANLOAI);
        }
    }, [caseState.PHANLOAI]);

    useEffect(() =>
    {
        setVictimIdFieldValue();
    }, [victimsForm.data]);

    useEffect(() =>
    {
        setSuspectIdFieldValue();
    }, [suspectsForm.data]);

    const getVictims = async (ids: string) =>
    {
        const rs = await caseService.getVictims(ids);
        if (rs?.data?.length)
        {
            const formattedData = rs.data.map((d: any) => LayerHelper.removeStringArr(d));
            setVictimsForm({
                ...victimsForm,
                data: formattedData,
                cacheData: formattedData,
            });
        }
    };

    const getSuspects = async (ids: string) =>
    {
        const rs = await caseService.getSuspects(ids);
        if (rs?.data?.length)
        {
            setSuspectsForm({
                ...suspectsForm,
                data: rs.data,
                cacheData: rs.data,
            });
        }
    };

    useEffect(() =>
    {
        if (formType === CaseFormMode.EDIT)
        {
            getVictims(caseState.ID_NANNHAN);
            getSuspects(caseState.ID_DOITUONG);
        }
    }, []);

    const handleCreateCase = async () =>
    {
        try
        {
            await caseService.addVictims(victimsForm.data);
            await caseService.addSuspects(suspectsForm.data);
            await caseService.add({
                ...caseState,
                ID_NANNHAN: victimsForm.data.map((v: VictimData) => v.ID_NANNHAN),
                ID_DOITUONG: suspectsForm.data.map((s: SuspectData) => s.ID_DOITUONG),
            });
        }
        catch (e: any)
        {
            throw new Error(e.message);
        }
    };

    const handleUpdateCase = async (id: string) =>
    {
        try
        {
            await caseService.updateVictims(victimsForm.data);
            await caseService.updateSuspects(suspectsForm.data);
            await caseService.update(id, {
                ...caseState,
                ID_NANNHAN: victimsForm.data.map((v: VictimData) => v.ID_NANNHAN),
                ID_DOITUONG: suspectsForm.data.map((s: SuspectData) => s.ID_DOITUONG),
            });
        }
        catch (e: any)
        {
            throw new Error(e.message);
        }
    };

    const onSubmit = () =>
    {
        if (checkValid())
        {
            setSubmitting(true);
            if (formType === CaseFormMode.NEW)
            {
                handleCreateCase().then((rs: any) =>
                {
                    setSubmitting(false);
                    callback();
                }).catch((err: any) =>
                {
                    toast({ type: 'error', message: err.message });
                });
            }
            else if (formType === CaseFormMode.EDIT)
            {
                handleUpdateCase(data.Id)
                    .then((rs: any) =>
                    {
                        setSubmitting(false);
                        callback();
                    }).catch((err: any) =>
                    {
                        toast({ type: 'error', message: err.message });
                    });
            }
        }
    };

    const onAdministrativeChange = async (data: AdministrativeData) =>
    {
        setCaseState({
            Location: data.location,
            TINH: data.province,
            HUYEN: data.district,
            XA: data.ward,
            THON: data.street,
            DIACHI: data.address,
        });
    };

    const onVictimCountChange = (value: any) =>
    {
        setCaseState({
            SONANNHAN: value,
        });
        const numberOfVictims = Number(value);
        const allVictimsCount = victimsForm.cacheData.length;

        if (numberOfVictims >= allVictimsCount)
        {
            for (let i = 0; i < numberOfVictims - allVictimsCount; i++)
            {
                const newVictim = { ...initVictim, ID_NANNHAN: genVictimId() };
                victimsForm.cacheData.push(newVictim);
            }
            victimsForm.data = victimsForm.cacheData;
        }
        else if (numberOfVictims < allVictimsCount)
        {
            victimsForm.data = victimsForm.cacheData.filter((v: VictimData, i: number) => i < numberOfVictims);
        }
        setVictimsForm({ ...victimsForm });
    };

    const openVictimsForm = () =>
    {
        setVictimsForm({
            ...victimsForm,
            open: true,
        });
    };

    const closeVictimsForm = () =>
    {
        setVictimsForm({
            ...victimsForm,
            open: false,
        });
    };

    const setVictimIdFieldValue = () =>
    {
        const value = victimsForm.data.map((v: VictimData) =>
        {
            return v.HOVATEN || v.ID_NANNHAN;
        }).join(', ');
        setCaseState({

            ID_NANNHAN: value,
        });
        return value;
    };

    const initVictim = useRef<VictimData>({
        Id: '',
        Title: '',
        ID_NANNHAN: genVictimId(),
        SO_CANCUOC: '',
        HOVATEN: '',
        NOI_THUONGTRU: '',
        DIENTHOAI: '',
    }).current;

    const onAddVictim = () =>
    {
        onVictimCountChange(victimsForm.data.length + 1);
    };

    const onRemoveVictim = (victim: VictimData) =>
    {
        setVictimsForm(
            {
                data: victimsForm.data.filter((v: VictimData) => v.ID_NANNHAN !== victim.ID_NANNHAN),
                cacheData: victimsForm.cacheData.filter((v: VictimData) => v.ID_NANNHAN !== victim.ID_NANNHAN),
            },
        );
    };

    const onVictimValueChange = (state: VictimData[]) =>
    {
        setVictimsForm({
            data: state,
            cacheData: [...victimsForm.data, ...CommonHelper.clone(victimsForm.cacheData).splice(0, victimsForm.data.length - 1)],
        });
    };

    const openSuspectsForm = () =>
    {
        setSuspectsForm({
            ...suspectsForm,
            open: true,
        });
    };

    const closeSuspectsForm = () =>
    {
        setSuspectsForm({
            ...suspectsForm,
            open: false,
        });
    };

    const setSuspectIdFieldValue = () =>
    {
        const value = suspectsForm.data.map((s: SuspectData) =>
        {
            return s.HOVATEN || s.ID_DOITUONG;
        }).join(', ');
        setCaseState({
            ID_DOITUONG: value,
        });
        return value;
    };

    const initSuspect = useRef<SuspectData>({
        Id: '',
        Title: '',
        ID_DOITUONG: genSuspectId(),
        HOVATEN: '',
        SO_CANCUOC: 0,
        NOI_THUONGTRU: '',
        DIENTHOAI: '',
    }).current;

    const onAddSuspect = () =>
    {
        onSuspectCountChange(suspectsForm.data.length + 1);
    };

    const onRemoveSuspect = (suspect: SuspectData) =>
    {
        setSuspectsForm(
            {
                data: suspectsForm.data.filter((s: SuspectData) => s.ID_DOITUONG !== suspect.ID_DOITUONG),
                cacheData: suspectsForm.cacheData.filter((s: SuspectData) => s.ID_DOITUONG !== suspect.ID_DOITUONG),
            },
        );
    };

    const onSuspectCountChange = (value: any) =>
    {
        setCaseState({
            SODOITUONG: value,
        });
        const numberOfSuspects = Number(value);
        const allSuspectsCount = suspectsForm.cacheData.length;

        if (numberOfSuspects >= allSuspectsCount)
        {
            for (let i = 0; i < numberOfSuspects - allSuspectsCount; i++)
            {
                const newSuspect = { ...initSuspect, ID_DOITUONG: genSuspectId() };
                suspectsForm.cacheData.push(newSuspect);
            }
            suspectsForm.data = suspectsForm.cacheData;
        }
        else if (numberOfSuspects < allSuspectsCount)
        {
            suspectsForm.data = suspectsForm.cacheData.filter((v: SuspectData, i: number) => i < numberOfSuspects);
        }
        setSuspectsForm({ ...suspectsForm });
    };

    const onSuspectValueChange = (state: SuspectData[]) =>
    {
        setSuspectsForm({
            data: state,
            cacheData: [...suspectsForm.data, ...CommonHelper.clone(suspectsForm.cacheData).splice(0, suspectsForm.data.length - 1)],
        });
    };

    const onWfChange = (value: any) =>
    {
        if (caseState.wfInstanceId)
        {
            setChangeWfConfirmModel({ open: true, value });
        }
        else
        {
            setCaseState({
                wfCode: value,
            });
        }
        getWfReviewData(value);
    };

    const getWfReviewData = (schemaCode: string) =>
    {
        new WorkflowService().getActivities(schemaCode).then(rs =>
        {
            if (rs.data)
            {
                setWfReviewData(rs.data);
            }
        });
    };
    const handleChangeWf = () =>
    {
        setCaseState({
            wfCode: changeWfConfirmModel.value,
            wfInstanceId: '',
        });

        setChangeWfConfirmModel({ open: false });

    };
    return (
        <Popup
            width={'90%'}
            height={'90%'}
            padding={'0'}
            title={formType === CaseFormMode.NEW ? 'Tạo vụ việc' : 'Cập nhật vụ việc'}
            onClose={onClose}
        >
            <FlexPanel flex={1}>
                <ScrollView>
                    <PanelBody>
                        {
                            JSON.stringify(caseProps) !== '{}'
                                ? (
                                        <Column>
                                            <Row>
                                                <Expanded>
                                                    <Section
                                                        header={'Thông tin chính'}
                                                        className={'case-form-expanded-section'}
                                                    >
                                                        <FormGroup>
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Tên vụ việc'}
                                                                errorText={!validation.TENVUVIEC ? 'Trường này không được để trống!' : ''}
                                                                control={(
                                                                    <Input
                                                                        placeholder={'Nhập tên vụ việc'}
                                                                        value={caseState.TENVUVIEC}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({ TENVUVIEC: value });
                                                                        }}
                                                                    />
                                                                )}
                                                                required
                                                            />
                                                            {/* <FormControlLabel */}
                                                            {/*    required */}
                                                            {/*    errorText={!validation.ID_CANBO && 'Trường này không được để trống!'} */}
                                                            {/*    label={'Người tạo'} */}
                                                            {/*    control={ */}
                                                            {/*        <Input */}
                                                            {/*            disabled */}
                                                            {/*            onChange={(value: any) => */}
                                                            {/*            { */}
                                                            {/*                setCaseState({ ID_CANBO: value }); */}
                                                            {/*            }} */}
                                                            {/*            value={caseState.ID_CANBO} */}
                                                            {/*            placeholder={'Chọn người tạo'} */}
                                                            {/*        /> */}
                                                            {/*    } */}
                                                            {/* /> */}
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Cơ quan tạo'}
                                                                // errorText={!validation.ID_CANBO && 'Trường này không được để trống!'}
                                                                control={(
                                                                    <Input
                                                                        value={userOU}
                                                                        disabled
                                                                    />
                                                                )}
                                                                required
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Ngày tạo'}
                                                                control={(
                                                                    <DateTimePicker
                                                                        value={caseState.NGAYTAO}
                                                                        placeholder={'Chọn ngày tạo'}
                                                                        clearable
                                                                        showTimeSelect
                                                                        disabled
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({ NGAYTAO: value });
                                                                        }}
                                                                    />
                                                                )}
                                                                required
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Ngày ghi nhận'}
                                                                control={(
                                                                    <DateTimePicker
                                                                        placeholder={'Chọn ngày ghi nhận'}
                                                                        value={caseState.NGAYGHINHAN}
                                                                        clearable
                                                                        showTimeSelect
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                NGAYGHINHAN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Thời gian xảy ra'}
                                                                control={(
                                                                    <DateTimePicker
                                                                        placeholder={'Chọn giờ xảy ra'}
                                                                        value={caseState.NGAYTHUCHIEN}
                                                                        clearable
                                                                        showTimeSelect
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                NGAYTHUCHIEN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Thời gian kết thúc'}
                                                                control={(
                                                                    <DateTimePicker
                                                                        placeholder={'Chọn giờ kết thúc'}
                                                                        value={caseState.NGAYKETTHUC}
                                                                        clearable
                                                                        showTimeSelect
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                NGAYKETTHUC: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.SONANNHAN && 'Trường này không được để trống!'}
                                                                label={'Số nạn nhân'}
                                                                control={(
                                                                    <Input
                                                                        placeholder={'Nhập số nạn nhân'}
                                                                        value={victimsForm.data.length}
                                                                        type={'number'}
                                                                        onChange={onVictimCountChange}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.ID_NANNHAN && 'Trường này không được để trống!'}
                                                                label={'ID nạn nhân'}
                                                                control={(
                                                                    <InputGroup>
                                                                        <Input
                                                                            placeholder={'Ấn nút bên phải để thêm hoặc chỉnh sửa'}
                                                                            value={caseState.ID_NANNHAN}
                                                                            disabled
                                                                            onChange={(value: any) =>
                                                                            {
                                                                                setCaseState({

                                                                                    ID_NANNHAN: value,
                                                                                });
                                                                            }}
                                                                        />
                                                                        <InputAppend>
                                                                            <Button
                                                                                icon={'list'}
                                                                                iconSize={'xs'}
                                                                                onlyIcon
                                                                                onClick={openVictimsForm}
                                                                            />
                                                                        </InputAppend>
                                                                    </InputGroup>
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.SODOITUONG && 'Trường này không được để trống!'}
                                                                label={'Số đối tượng'}
                                                                control={(
                                                                    <Input
                                                                        placeholder={'Nhập số đối tượng'}
                                                                        value={suspectsForm.data.length}
                                                                        type={'number'}
                                                                        onChange={onSuspectCountChange}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.ID_NANNHAN && 'Trường này không được để trống!'}
                                                                label={'ID đối tượng'}
                                                                control={(
                                                                    <InputGroup>
                                                                        <Input
                                                                            placeholder={'Ấn nút bên phải để thêm hoặc chỉnh sửa'}
                                                                            value={caseState.ID_DOITUONG}
                                                                            disabled
                                                                            onChange={(value: any) =>
                                                                            {
                                                                                setCaseState({

                                                                                    ID_DOITUONG: value,
                                                                                });
                                                                            }}
                                                                        />
                                                                        <InputAppend>
                                                                            <Button
                                                                                icon={'list'}
                                                                                iconSize={'xs'}
                                                                                onlyIcon
                                                                                onClick={openSuspectsForm}
                                                                            />
                                                                        </InputAppend>
                                                                    </InputGroup>
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                errorText={!validation.PHANLOAI ? 'Trường này không được để trống!' : ''}
                                                                label={'Loại vụ việc'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.PHANLOAI}
                                                                        value={caseState.PHANLOAI}
                                                                        placeholder={'Chọn loại vụ việc'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                PHANLOAI: value,
                                                                                LOAIVUVIECCHITIET: null,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                                required
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Loại vụ việc chi tiết'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={caseTypeDetailOptions}
                                                                        value={caseState.LOAIVUVIECCHITIET}
                                                                        placeholder={'Chọn loại vụ việc chi tiết'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                LOAIVUVIECCHITIET: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // errorText={!validation.TINHCHATVUVIEC && 'Trường này không được để trống!'}
                                                                label={'Tính chất vụ việc'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.TINHCHATVUVIEC}
                                                                        value={caseState.TINHCHATVUVIEC}
                                                                        placeholder={'Tính chất vụ việc'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                TINHCHATVUVIEC: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Chuyển lên TTCH xử lý'}
                                                                control={(
                                                                    <CheckBox
                                                                        checked={caseState.NGUYCAP}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                NGUYCAP: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            {
                                                                caseState.NGUYCAP && (
                                                                    <FormControlLabel
                                                                        labelWidth={'8rem'}
                                                                        label={'Ý kiến chỉ đạo'}
                                                                        control={(
                                                                            <RichText
                                                                                placeholder={'Nhập ý kiến chỉ đạo'}
                                                                                value={caseState.YKIENCHIDAO}

                                                                                onChange={(value: any) =>
                                                                                {
                                                                                    setCaseState({ YKIENCHIDAO: value });
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                )}
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Quy trình xử lý'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.QUYTRINHXULY}
                                                                        value={caseState.wfCode}
                                                                        placeholder={'Chọn quy trình xử lý'}
                                                                        searchable
                                                                        onChange={onWfChange}
                                                                    />
                                                                )}
                                                            />
                                                            {
                                                                wfReviewData && (
                                                                    <FormControlLabel
                                                                        labelWidth={'8rem'}
                                                                        label={'Xem trước quy trình'}
                                                                        control={(
                                                                            <WorkflowReview
                                                                                data={wfReviewData}
                                                                            />
                                                                        )}
                                                                    />
                                                                )}
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                errorText={!validation.TRANGTHAI ? 'Trường này không được để trống!' : ''}
                                                                label={'Trạng thái vụ việc'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.TRANGTHAI}
                                                                        value={caseState.TRANGTHAI}
                                                                        placeholder={'Chọn trạng thái'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                TRANGTHAI: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                                required
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Mô tả hiện trường'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập mô tả'}
                                                                        value={caseState.MOTA}

                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({ MOTA: value });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Nội dung vụ việc'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập nội dung vụ việc'}
                                                                        value={caseState.NOIDUNGVUVIEC}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({ NOIDUNGVUVIEC: value });
                                                                        }}
                                                                    />
                                                                )}
                                                            />

                                                        </FormGroup>
                                                    </Section>
                                                </Expanded>
                                                <Spacer size={'2rem'} />
                                                <Expanded>
                                                    <Section
                                                        header={'Địa điểm'}
                                                        className={'case-form-expanded-section'}
                                                    >
                                                        <FormGroup>
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Hành chính'}
                                                                errorText={validation.TINH && validation.HUYEN && validation.XA ? '' : 'Chưa chọn đơn vị hành chính!'}
                                                                control={(
                                                                    <Administrative
                                                                        data={{
                                                                            location: caseState.Location,
                                                                            province: Number(caseState.TINH),
                                                                            district: Number(caseState.HUYEN),
                                                                            ward: Number(caseState.XA),
                                                                            street: caseState.DIACHI,
                                                                            address: caseState.DIACHI,
                                                                        }}
                                                                        fields = {[
                                                                            AdminFields.location,
                                                                            AdminFields.province,
                                                                            AdminFields.district,
                                                                            AdminFields.ward,
                                                                            AdminFields.address,
                                                                        ]}
                                                                        administrativeSvc={administrativeSvc}
                                                                        displayField={'Title'}
                                                                        valueField={'AdministrativeID'}
                                                                        onChange={onAdministrativeChange}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.DIABAN && 'Trường này không được để trống!'}
                                                                label={'Địa bàn'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.DIABAN}
                                                                        value={caseState.DIABAN}
                                                                        placeholder={'Chọn địa bàn'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                DIABAN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </FormGroup>
                                                    </Section>
                                                </Expanded>

                                            </Row>
                                            <Section
                                                header={'Thông tin chi tiết'}
                                            >
                                                <Row>
                                                    <Expanded>
                                                        <FormGroup>

                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.NGUOIPHATHIEN && 'Trường này không được để trống!'}
                                                                label={'Người phát hiện'}
                                                                control={(
                                                                    <Input
                                                                        placeholder={'Nhập người phát hiện'}
                                                                        value={caseState.NGUOIPHATHIEN}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                NGUOIPHATHIEN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                // required
                                                                // errorText={!validation.NGUONPHATHIEN && 'Trường này không được để trống!'}
                                                                label={'Nguồn phát hiện'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.NGUONPHATHIEN}
                                                                        value={caseState.NGUONPHATHIEN}
                                                                        placeholder={'Chọn nguồn phát hiện'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                NGUONPHATHIEN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Khám phá'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.KHAMPHA}
                                                                        value={caseState.KHAMPHA}
                                                                        placeholder={'Chọn khám phá'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                KHAMPHA: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />

                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Thiệt hại'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập thiệt hại'}
                                                                        value={caseState.THIETHAI}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                THIETHAI: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Nguyên nhân'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.NGUYENNHANXAYRA}
                                                                        placeholder={'Chọn nguyên nhân'}
                                                                        value={caseState.NGUYENNHANXAYRA}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                NGUYENNHANXAYRA: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Nguyên nhân chi tiết'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập nguyên nhân chi tiết'}
                                                                        value={caseState.NGUYENNHANCHITIET}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                NGUYENNHANCHITIET: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Phương thức thủ đoạn'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.PHUONGTHUCTHUDOAN}
                                                                        value={caseState.PHUONGTHUCTHUDOAN}
                                                                        placeholder={'Chọn phương thức thủ đoạn'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                PHUONGTHUCTHUDOAN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Phương thức thủ đoạn chi tiết'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập phương thức thủ đoạn chi tiết'}
                                                                        value={caseState.PHUONGTHUCCHITIET}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                PHUONGTHUCCHITIET: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Phương tiện gây án'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.PHUONGTIENGAYAN}
                                                                        value={caseState.PHUONGTIENGAYAN}
                                                                        placeholder={'Chọn phương tiện gây án'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                PHUONGTIENGAYAN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Phương tiện gây án chi tiết'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập phương tiện gây án chi tiết'}
                                                                        value={caseState.PHUONGTIENCHITIET}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                PHUONGTIENCHITIET: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Có tổ chức'}
                                                                control={(
                                                                    <CheckBox
                                                                        checked={caseState.COTOCHUC}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                COTOCHUC: value,
                                                                                COCAUTOCHUC: value ? caseState.COCAUTOCHUC : null,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Cơ cấu tổ chức'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        disabled={!caseState.COTOCHUC}
                                                                        options={allSelectionFieldOptions.COCAUTOCHUC}
                                                                        value={caseState.COCAUTOCHUC}
                                                                        placeholder={'Chọn cơ cấu tổ chức'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                COCAUTOCHUC: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </FormGroup>
                                                    </Expanded>
                                                    <Spacer size={'2rem'} />
                                                    <Expanded>
                                                        <FormGroup>
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Cấp chỉ đạo'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.CAPCHIDAO}
                                                                        value={caseState.CAPCHIDAO}
                                                                        placeholder={'Chọn cấp chỉ đạo'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                CAPCHIDAO: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Chuyên đề'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.CHUYENDE}
                                                                        value={caseState.CHUYENDE}
                                                                        placeholder={'Chọn chuyên đề'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({

                                                                                CHUYENDE: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Đơn vị xử lý'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.DONVIXULY}
                                                                        value={caseState.DONVIXULY}
                                                                        placeholder={'Chọn đơn vị xử lý'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                DONVIXULY: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Hình thức xử lý'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.HINHTHUCXULY}
                                                                        value={caseState.HINHTHUCXULY}
                                                                        placeholder={'Chọn hình thức xử lý'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                HINHTHUCXULY: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Hình thức chi tiết'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập hình thức chi tiết'}
                                                                        value={caseState.HINHTHUCCHITIET}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                HINHTHUCCHITIET: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Thu hồi tài sản'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập thu hồi tài sản'}
                                                                        value={caseState.THUHOITAISAN}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                THUHOITAISAN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Kết quả xử lý'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.KETQUAXULY}
                                                                        value={caseState.KETQUAXULY}
                                                                        placeholder={'Chọn kết quả xử lý'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                KETQUAXULY: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Kết quả chi tiết'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập kết quả chi tiết'}
                                                                        value={caseState.KETQUACHITIET}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                KETQUACHITIET: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Khởi tố vụ án'}
                                                                control={(
                                                                    <AdvanceSelect
                                                                        options={allSelectionFieldOptions.KHOITOVUAN}
                                                                        value={caseState.KHOITOVUAN}
                                                                        placeholder={'Chọn khởi tố vụ án'}
                                                                        searchable
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                KHOITOVUAN: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Nội dung khởi tố'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập nội dung khởi tố'}
                                                                        value={caseState.NOIDUNGKHOITO}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({
                                                                                NOIDUNGKHOITO: value,
                                                                            });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            <FormControlLabel
                                                                labelWidth={'8rem'}
                                                                label={'Ghi chú'}
                                                                control={(
                                                                    <RichText
                                                                        placeholder={'Nhập ghi chú'}
                                                                        value={caseState.GHICHU}
                                                                        onChange={(value: any) =>
                                                                        {
                                                                            setCaseState({ GHICHU: value });
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                        </FormGroup>
                                                    </Expanded>
                                                </Row>
                                            </Section>

                                        </Column>
                                    )
                                : <Loading />
                        }
                    </PanelBody>
                </ScrollView>
            </FlexPanel>
            {
                victimsForm.open && (
                    <Popup
                        width={'50%'}
                        height={'80%'}
                        padding={'0'}
                        title={'Nạn nhân'}
                        onClose={() =>
                        {
                            setVictimsForm({ ...victimsForm, open: false });
                        }}
                    >
                        <VictimsForm
                            data={victimsForm.data}
                            onChange={onVictimValueChange}
                            onRemove={onRemoveVictim}
                        />
                        <PopupFooter>
                            <Row
                                mainAxisAlignment={'center'}
                            >
                                <Button
                                    icon={'plus'}
                                    color={'default'}
                                    text={'Thêm'}
                                    onClick={onAddVictim}
                                />
                                <Button
                                    icon={'save'}
                                    color={'primary'}
                                    text={'Lưu'}
                                    onClick={closeVictimsForm}
                                />
                            </Row>
                        </PopupFooter>
                    </Popup>
                )}
            {
                suspectsForm.open && (
                    <Popup
                        width={'50%'}
                        height={'80%'}
                        padding={'0'}

                        title={'Nạn nhân'}
                        onClose={() =>
                        {
                            setSuspectsForm({ ...suspectsForm, open: false });
                        }}
                    >
                        <SuspectsForm
                            data={suspectsForm.data}
                            onChange={onSuspectValueChange}
                            onRemove={onRemoveSuspect}
                        />
                        <PopupFooter>
                            <Row
                                mainAxisAlignment={'center'}
                            >
                                <Button
                                    icon={'plus'}
                                    color={'default'}
                                    text={'Thêm'}
                                    onClick={onAddSuspect}
                                />
                                <Button
                                    icon={'save'}
                                    color={'primary'}
                                    text={'Lưu'}
                                    onClick={closeSuspectsForm}
                                />
                            </Row>
                        </PopupFooter>
                    </Popup>
                )}
            {
                changeWfConfirmModel.open && (
                    <Confirm
                        title={'Thay đổi quy trình xử lý'}
                        message={'Thay đổi quy trình xử lý sẽ xóa quy trình cũ, bạn có muốn tiếp tục?'}
                        cancelText={'Hủy'}
                        okText={'Tiếp tục'}
                        loading={changeWfConfirmModel.loading}
                        onCancel={() =>
                        {
                            setChangeWfConfirmModel({ open: false });
                        }}
                        onOk={() =>
                        {
                            handleChangeWf();
                        }}
                    />
                )}
            <PopupFooter>
                <Row
                    mainAxisAlignment={'center'}
                >
                    <Button
                        disabled={submitting}
                        isLoading={submitting}
                        color={'primary'}
                        text={formType === CaseFormMode.NEW ? 'Tạo vụ việc' : 'Cập nhật vụ việc'}
                        onClick={onSubmit}
                    />
                </Row>
            </PopupFooter>
        </Popup>
    );
};

export default CaseFormPopup;
