import './PostalCodeBoundary.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { BorderPanel, PanelBody, FAIcon, TB1, AdvanceSelect, Row, Spacer, Container, PanelHeaderWithSwitcher } from '@vbd/vui';

import useDebounce from 'extends/ffms/pages/hooks/useDebounce';
import { Constants } from 'extends/ffms/constant/Constants';


let PostalCodeBoundary = (props) =>
{
    const abStore = props.fieldForceStore.adminBoundaryStore;
    
    const [options, setOptions] = React.useState([]);
    const [searchKey, setSearchKey] = React.useState();

    const debouncedSearchKey = useDebounce(searchKey, 300);

    React.useEffect(()=>
    {
        const { type, AdminID } = props.parent;
        if (type !== Constants.TYPE_WARD)
        {
            abStore.resetPostal();
            abStore.getPostals(type, AdminID);
        }

    },[props.parent.type, props.parent.AdminID]);

    React.useEffect(() =>
    {
        const { type, AdminID } = props.parent;
        const key = `${searchKey}*`;
        abStore.getPostals(type, AdminID, { searchKey: key });

    }, [debouncedSearchKey]);

    React.useEffect(()=>
    {
        if (abStore.postals?.length > 0)
        {
            const postalOptions = buildSelectOptions(abStore.postals);
            setOptions(postalOptions);
        }
    },[abStore.postals]);


    const getLabel = (postal) =>
    {
        const { pincode, officename, officetype } = postal;
        const label = `${pincode} - ${officename} ${officetype}`;
        return label;
    };

    const buildSelectOptions = (postals) =>
    {
        if (postals?.length === 0)
        {
            return [];
        }
        postals = postals || [];
        const options = postals.map(item =>
        {
            return ({ id: item.Id, dropdownDisplay: getLabel(item) });
        });

        return options;
    };

    const toggleGeoPostal = (id) =>
    {
        if (abStore.enablePostal)
        {
            const change = abStore.postalsSelected.map(item =>
            {
                if (item.Id === id)
                {
                    item.hide = !item.hide;
                }
                return item;
            });

            abStore.set('postalsSelected',change);
        }
    };

    const removeSelected = (id) =>
    {
        if (abStore.enablePostal)
        {
            const change = abStore.postalsSelected.filter(item =>(item.Id !== id));
            abStore.set('postalsSelected',change);
        }
    };

    const handleSelect = (id) =>
    {
        if (id && abStore.enablePostal)
        {
            if (!abStore.postalsSelected.some(x=>x.Id === id))
            {
                const item = abStore.postals.find(x => x.Id === id);
                const update = [{ ...item, hide: false }, ...abStore.postalsSelected];
                abStore.set('postalsSelected', update);
            }
        }
       
    };

    const renderExpandIcon = () =>
    {
        return (
            <FAIcon
                size={'1rem'}
                icon={'search'}
                className={'expand-icon'}
            />
        );
    };

    const renderSelectedItem = (item) =>
    {
        const label = getLabel(item);
        return (
            <Row
                key={item.Id}
                mainAxisAlignment={'space-around'}
                crossAxisAlignment={'center'}
                height={'28px'}
                className={'postal-item'}
            >
                <Row crossAxisAlignment={'center'}>
                    <FAIcon
                        className={'postal-icon'}
                        size={'1.2rem'}
                        icon={!item.hide && abStore.enablePostal ? 'eye' : 'eye-slash'}
                        color={!item.hide && abStore.enablePostal ? '#00579b' : undefined}
                        onClick={()=> toggleGeoPostal(item.Id)}
                    />
                    <Spacer size='10px' />
                    <TB1>{label}</TB1>
                </Row>
                <FAIcon
                    className={'postal-icon'}
                    size={'1.2rem'}
                    icon={'times'}
                    disabled={!abStore.enablePostal}
                    onClick={()=> removeSelected(item.Id)}
                />
            </Row>
        );
    };

    return (
        <BorderPanel className="postal-code-container">
            <PanelHeaderWithSwitcher
                value ={abStore.enablePostal ? 1 : 0}
                onChanged={(value) => abStore.set('enablePostal', value)}
            >
                    Tìm kiếm mã bưu chính
            </PanelHeaderWithSwitcher>

            <PanelBody className={'postal-code-content'}>
                <Container className={'postal-code-search'}>
                    <AdvanceSelect
                        editable
                        disabled={!abStore.enablePostal}
                            
                        editValue ={searchKey}
                        placeholder={'Enter key work to search'}
                            
                        options={options}
                        expandIcon={renderExpandIcon()}

                        onTextChange={setSearchKey}
                        onChange={handleSelect}
                    />
                </Container>
                {
                    abStore.postalsSelected?.length > 0 &&
                    <TB1 style={{ padding: '10px' }}>OVERLAY MAP</TB1>
                }
                
                {abStore.postalsSelected.map(renderSelectedItem)}

            </PanelBody>
            
        </BorderPanel>
    );
};

PostalCodeBoundary.prototype = {
    visible: PropTypes.bool,
    data: PropTypes.array,
};

PostalCodeBoundary.defaultProps = {
    visible: false,
};

PostalCodeBoundary = inject('appStore', 'fieldForceStore')(observer(PostalCodeBoundary));
export default PostalCodeBoundary;
