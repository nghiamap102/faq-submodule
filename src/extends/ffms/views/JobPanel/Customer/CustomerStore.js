import { decorate, observable, action, runInAction } from 'mobx';
import _findIndex from 'lodash/findIndex';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { LayerStore } from 'components/app/stores/LayerStore';
import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';

import GeocodeService from 'extends/ffms/services/GeocodeService';
import CustomerService from 'extends/ffms/services/CustomerService';
import { MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';

export class CustomerStore
{
    LAYER_NAME = 'CUSTOMER';
    properties = []; // CUSTOMER properties
    appStore = null;
    geocodeSvc = new GeocodeService();
    currentCustomer = {};
    isShowForm = false;
    isShow = false;
    isDel = false;
    isEdit = false;
    searchKey = '';

    totalItem = 0;
    pageSize = 20;
    currentPage = 1;
    sorters = undefined;
    currentFilter = {};

    isLoading = false;
    isDownloading = false;
    customerOptions = [];
    customers = [];

    stateOptions = [];
    districtOptions = [];
    tehsilOptions = [];

    filterState = {};
    urlParams = {}; // store url params when switching tabs

    customerFormAction = 'create';
    location = {};

    isDrawer = false;

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;
        this.i18n = fieldForceStore?.appStore?.contexts?.i18n;
        this.modalContext = fieldForceStore?.appStore?.contexts?.modal;

        this.comSvc = fieldForceStore?.comSvc;
        this.customerSvc = new CustomerService(fieldForceStore?.appStore?.contexts);

        // this.layerStore = appStore.layerStore
        this.layerStore = new LayerStore(this.appStore);
        this.isShowForm = false;
        this.customerFormAction = 'create';
        this.location = {};
        this.isShow = false;


        this.currentFilter = {
            page: 1,
            count: 20,
        };

        this.resetFilterState();
    }

    setDrawer = (isDrawer) =>
    {
        if (isDrawer !== undefined)
        {
            this.isDrawer = isDrawer;
        }
    };

    setCustomerFormState = (isShowForm, action) =>
    {
        if (isShowForm !== undefined)
        {
            this.isShowForm = isShowForm;
        }

        if (action !== undefined)
        {
            this.customerFormAction = action;
        }
    }

    setFilterState = (key, value) =>
    {
        this.filterState[key] = value;
    };

    setAllFilterState = (filter = {}, isReplace) =>
    {
        if (isReplace)
        {
            this.filterState = filter;
        }
        else
        {
            for (const key in filter)
            {
                if (filter.hasOwnProperty(key))
                {
                    this.filterState[key] = filter[key];
                }
            }
        }
    };

    resetFilterState = (searchKey) =>
    {
        const filterState = {
            searchKey: searchKey,
            customer_fullname: '',
            customer_contact_no: '',
            customer_type_id: [],
        };
        this.filterState = filterState;
    };


    getFullFilterState = () =>
    {
        const filterState = {};

        for (const key in this.filterState)
        {
            const value = this.filterState[key];
            if (value && (!Array.isArray(value) || value.length > 0))
            {
                switch (key)
                {

                    case 'customer_contact_no':
                    case 'customer_fullname':
                        filterState[key] = { like: `${value}` };
                        break;
                    case 'searchKey':
                        filterState[key] = `${value}`;
                        break;
                    case 'customer_type_id':
                        filterState[key] = Array.isArray(value) && value.length === 1 ? value[0] : { inq: value };
                        break;
                    default:
                        filterState[key] = value;
                        break;
                }
            }
        }
        filterState.skip = (this.currentPage - 1) * this.pageSize;
        filterState.take = this.pageSize;

        if (this.sorters)
        {
            let sorters = [...this.sorters];
            const index = _findIndex(sorters, (x) => x.id === 'customer_address');
            if (index > -1)
            {
                const col = sorters.splice(index, 1)[0];
                sorters = sorters.concat([
                    { id: 'customer_address_state', direction: col.direction },
                    { id: 'customer_address_district', direction: col.direction },
                    { id: 'customer_address_tehsil', direction: col.direction },
                    { id: 'customer_address_pincode', direction: col.direction },
                    { id: 'customer_address_village', direction: col.direction },
                    { id: 'customer_address_street', direction: col.direction },
                ]);
            }
            const fields = this.properties ? CommonHelper.toDictionary(this.properties, 'ColumnName', 'sortId') : {};
            filterState.sortBy = sorters.filter((x) => x.id && x.direction).map((col) =>
            {
                return {
                    Field: fields[col.id] ? fields[col.id] : col.id,
                    Direction: col.direction.toUpperCase(),
                };
            });
        }
        else
        {
            delete filterState.sortBy;
        }

        filterState['includeRelations'] = false;

        return filterState;
    };

    togglePanel = () =>
    {
        this.isShow = !this.isShow;
    };

    toggleDel = () =>
    {
        this.isDel = !this.isDel;
    };

    setEdit = (editStt) =>
    {
        this.isEdit = editStt;
    }

    getCustomer = async (nodeId) =>
    {
        if (nodeId)
        {
            const data = await this.customerSvc.getData(nodeId);
            return data;
        }
    };

    setCustomer = (customer = {}) =>
    {
        const locationField = 'location';
        if (customer[locationField])
        {
            if (typeof (customer[locationField]) === 'string')
            {
                customer[locationField] = JSON.parse(customer[locationField]);
            }
        }
        else
        {
            customer[locationField] = { type: 'Point', coordinates: [MAP_OPTIONS.longitude, MAP_OPTIONS.latitude] };
        }
        this.currentCustomer = customer;
    };

    changeAttr = async (attr, value) =>
    {
        if (!this.currentCustomer)
        {
            this.currentCustomer = {};
        }

        this.currentCustomer[attr] = value;

        if (attr === 'location')
        {
            const geocodeResult = await this.geocodeSvc.reverseGeocode([this.currentCustomer[attr].coordinates]);

            if (geocodeResult && geocodeResult.status && geocodeResult.status.code === 200 && !geocodeResult.status.message)
            {
                this.currentCustomer['customer_address_tehsil'] = geocodeResult.data[0].Tehsil;
                this.currentCustomer['customer_address_state'] = geocodeResult.data[0].State;
                this.currentCustomer['customer_address_district'] = geocodeResult.data[0].District;
                this.currentCustomer['customer_address_pincode'] = geocodeResult.data[0].PinCode;
            }
        }
    };

    add = async (customerObj) =>
    {
        const sendCustomer = Object.assign({}, customerObj);
        sendCustomer['Title'] = sendCustomer['customer_fullname'];

        const newCustomer = await this.customerSvc.create(sendCustomer);
        if (newCustomer)
        {
            if (newCustomer.result && newCustomer.result === -1)
            {
                return { errorMessage: newCustomer.errorMessage, details: newCustomer.errorDetails };
            }
            else
            {
                // add new item to grid, remove last item of array
                sendCustomer.__secretKey = CommonHelper.uuid();
                this.customers = [sendCustomer, ...this.customers];
                if (this.customers.length > this.pageSize)
                {
                    this.customers.pop();
                }
                
                newCustomer.__secretKey = sendCustomer.__secretKey;
                this.getDataCount();
                const customer = await this.bindCustomerData(newCustomer);
                return customer;
            }
        }
        else
        {
            // for debugging
            // console.error('Add customer not error but still return empty object', sendCustomer);
        }
        return newCustomer;
    };

    edit = async (id, customerObj) =>
    {
        if (customerObj['customer_fullname'])
        {
            customerObj['Title'] = customerObj['customer_fullname'];
        }
        const customer = await this.customerSvc.edit(id, customerObj);
        if (customer)
        {
            if (customer.status && customer.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: customer.status.message || 'Cập nhật thông tin khách hàng không thành công' });
            }
            if (customer?.result && customer?.result === -1)
            {
                return { errorMessage: customer.errorMessage, details: customer.errorDetails };
            }
            else
            {
                const data = await this.bindCustomerData(customer);
                return data;
            }
        }
        return customer;
    }

    delete = async (customerId) =>
    {
        const findPos = _findIndex(this.customers, (customer) => customer.customer_guid === customerId);
        this.customers.splice(findPos, 1);

        return this.customerSvc.delete(customerId).then((res) =>
        {
            if (res && res.count > 0)
            {
                this.getDataCount();
                // this.modalContext.toast({ type: 'success', message: 'Đã xóa khách hàng thành công' });
            }
            else
            {
                this.modalContext.toast({ type: 'error', message: res.errorMessage || 'Xóa khách hàng thất bại' });
            }
            return res;
        });
    };

    bindCustomerData = async (customerData) =>
    {
        if (customerData && customerData.customer_guid)
        {
            // update customer on grid
            const rs = await this.getData({ skip: 0, take: 1, customer_guid: customerData.customer_guid, includeRelations: true });

            if (rs && rs.length)
            {
                const data = rs[0];
                const findPos = _findIndex(this.customers, (c) => c.customer_guid === customerData.customer_guid || c.__secretKey === customerData.__secretKey);

                if (findPos > -1)
                {
                    this.customers[findPos] = data;
                    this.customers = [...this.customers];
                    return data;
                }
            }

            // update customer on form
            if (customerData.Id)
            {
                const customer = await this.comSvc.getRawData(this.LAYER_NAME, customerData.Id).then((rs) => rs && rs.length ? rs[0] : rs);
                this.setCustomer(customer);
                return customer;
            }
        }
        return customerData;
    };

    getData = async (filter, updateCount) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();

        return this.comSvc.queryData('customers', filterState).then((result) =>
        {
            if (updateCount)
            {
                this.totalItem = result.total;
            }

            return result?.data?.map((data) =>
            {
                const fullAddress = [
                    data.customer_address_street ? data.customer_address_street : null,
                    data.customer_address_village ? `${this.i18n.t('Làng')} ${data.customer_address_village}` : null,
                    data.customer_address_pincode ? `${this.i18n.t('Mã pin')}: ${data.customer_address_pincode}` : null,
                    data.customer_address_tehsil ? `${data.customer_address_tehsil}` : null,
                    data.customer_address_district ? `${data.customer_address_district}` : null,
                    data.customer_address_state ? `${data.customer_address_state}` : null,
                ].filter((x) => x).join(', ');
                data['customer_address'] = fullAddress;
                return data;
            }) || [];
        });
    };

    getDataCount = (filter) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();
        delete filterState.includeRelations;
        delete filterState.skip;
        delete filterState.take;

        this.comSvc.queryCount('customers', filterState).then((total) =>
        {
            this.totalItem = total;
        });
    }

    getDataDebounced = new AwesomeDebouncePromise(this.getData.bind(this), 300);

    setData = (data) =>
    {
        this.customers = data || [];
    };

    setCustomerOptions = (options) =>
    {
        this.customerOptions = options;
    };

    setPaging = (page, size = 20) =>
    {
        this.currentPage = page;
        this.pageSize = size;
    };

    setSorters = (columns) =>
    {
        if (columns)
        {
            this.sorters = columns;
        }
    };

    setRegionOptions = (level, regions) =>
    {
        const regionOptions = this.mapRegionOptions(regions || []);

        if (level === 0)
        {
            this.stateOptions = regionOptions;
            this.districtOptions = [];
            this.tehsilOptions = [];
        }

        if (level === 1)
        {
            this.districtOptions = regionOptions;
            this.tehsilOptions = [];
        }

        if (level === 2)
        {
            this.tehsilOptions = regionOptions;
        }
    };

    mapRegionOptions = (regions = []) =>
    {
        return regions.map((reg) =>
        {
            return {
                id: reg.AdministrativeID,
                label: reg.UniqueName || reg.Title,
                ...reg,
            };
        });
    };

    bindRegionOptions = async (field, state, district, tehsil) =>
    {
        state = !isNaN(state) ? parseInt(state) : state;
        district = !isNaN(district) ? parseInt(district) : district;
        tehsil = !isNaN(tehsil) ? parseInt(tehsil) : tehsil;

        let districts = undefined;
        let tehsils = undefined;
        
        const abStore = this.appStore.adminBoundariesStore;
        if (abStore)
        {
            this.setRegionOptions(0, abStore.countryRegion);
            if (state)
            {
                // LOAD DISTRICTS
                const stateOption = this.stateOptions.filter((r) => `${r[field]}`.toLowerCase() === `${state}`.toLowerCase())[0];
                
                if (stateOption)
                {
                    districts = await abStore.getChildByParentId(Constants.TYPE_DISTRICT, stateOption.AdministrativeID);
                    this.setRegionOptions(1, districts);

                    if (district)
                    {
                        // LOAD TEHSILS
                        const districtOption = this.districtOptions.filter((r) => `${r[field]}`.toLowerCase() === `${district}`.toLowerCase())[0];
                        if (districtOption)
                        {
                            tehsils = await abStore.getChildByParentId(Constants.TYPE_WARD, districtOption.AdministrativeID);
                            this.setRegionOptions(2, tehsils);
                        }
                    }
                }
            }
        }
    };

    getAdministrativeIds = (state, district, tehsil) =>
    {
        const result = {};

        const stateOption = this.stateOptions?.filter((r) => r.Title?.toLowerCase() === state?.toLowerCase())[0];
        if (stateOption)
        {
            result['state'] = stateOption.AdministrativeID;

            const districtOption = this.districtOptions?.filter((r) => r.Title?.toLowerCase() === district?.toLowerCase())[0];
            if (districtOption)
            {
                result['district'] = districtOption.AdministrativeID;

                const tehsilOption = this.tehsilOptions?.filter((r) => r.Title?.toLowerCase() === tehsil?.toLowerCase())[0];
                if (tehsilOption)
                {
                    result['tehsil'] = tehsilOption.AdministrativeID;
                }
            }
        }

        return result;
    }
    setLoading = (isLoading) =>
    {
        this.isLoading = isLoading;
    };

    setDownloading = (isDownloading) =>
    {
        this.isDownloading = isDownloading;
    }
}

decorate(CustomerStore, {
    customers: observable,
    customerOptions: observable,
    // enableCustomer: action,
    isShow: observable,
    isShowForm: observable,
    isLoading: observable,
    isDownloading: observable,
    setLoading: action,
    currentCustomer: observable.deep,
    setEdit: action,
    setCustomer: action,
    togglePanel: action,
    changeAttr: action,
    add: action,
    edit: action,
    delete: action,
    bindCustomerData: action,

    totalItem: observable,
    pageSize: observable,
    currentPage: observable,
    filterState: observable,
    setPaging: action,

    getData: action,
    setData: action,
    setSorters: action,
    setFilterState: action,
    resetFilterState: action,
    getFullFilterState: action,
    setAllFilterState: action,

    stateOptions: observable,
    districtOptions: observable,
    tehsilOptions: observable,

    setCustomerOptions: action,
    location: observable,

    customerFormAction: observable,
    setCustomerFormState: action,
    setRegionOptions: action,
    bindRegionOptions: action,
    getDataCount: action,

    isDrawer: observable,
    setDrawer: action,
});
