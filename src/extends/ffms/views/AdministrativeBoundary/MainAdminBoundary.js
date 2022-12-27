import './AdministrativeBoundary.scss';
import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Container, Line, ListItem, Loading, PanelHeader, ScrollView } from '@vbd/vui';
import { Constants } from 'extends/ffms/constant/Constants';
import { CommonHelper } from 'helper/common.helper';

let MainAdminBoundary = (props, ref) =>
{
    const abStore = props.fieldForceStore.adminBoundaryStore;
    const adminType = Constants.ADMINISTRATIVE_TYPE;

    const currentChild = React.useRef();

    const [loading, setLoading] = React.useState(false);
    const [activeId, setActiveId] = React.useState();

    React.useImperativeHandle(ref, () => ({
        onSelect: handleSelect,
    }));

    React.useEffect(()=>
    {
        (async () =>
        {
            const { lastSelected } = abStore;
            if (abStore.countryRegion?.length > 0)
            {
                setLoading(true);

                if (lastSelected)
                {
                    showMenu(lastSelected.level, lastSelected.admin);
                }
                else
                {
                    showMenu(0, {
                        AdministrativeID: 0,
                        Title: props.title,
                        Id: CommonHelper.uuid(),
                        AdminID: 0,
                    });
                }

                setTimeout(() =>
                {
                    setLoading(false);
                
                }, 500);
            }
        })();

    }, [abStore.countryRegion]);


    const showMenu = async (level, admin) =>
    {

        const { lastSelected, selectedPath, setBreadcrumb, getChildByParentId } = abStore;
        let admins;
        if (lastSelected && lastSelected.level === level)
        {
            // cached child
            admins = currentChild.current;
        }
        else
        {
            // set breadcrumb, index also a level
            setBreadcrumb(level, admin);

            // no more child for this level
            const type = adminType[level];
            if (!type)
            {
                return;
            }

            // get children
            const data = await getChildByParentId(type, admin.AdministrativeID);
            if (data)
            {
                admins = data;
                currentChild.current = admins;
            }
        }

        if (admins && admins.length)
        {
            // build child action
            const actions = admins.map((p) =>
            {
                return {
                    id: p.Id,
                    label: p.Title,
                    onClick: () =>
                    {
                        handleSelect(level + 1, p);
                    },
                };
            });

            abStore.setActions(actions);
        }
    };

    const handleSelect = async (level, admin) =>
    {
        const isWard = adminType[level - 1] === Constants.TYPE_WARD;
        isWard && setActiveId(admin.Id);

        !isWard && setLoading(true);

        // show boundaries
        await abStore.getAdminArea(adminType[level - 1], admin.AdministrativeID);

        await showMenu(level, admin);
        props.onSelect && props.onSelect(adminType[level - 1], admin.AdminID);

        !isWard && setLoading(false);
    };

    const renderItem = (action) =>
    {
        const renderContent = ()=>
        {
            if (!action.label)
            {
                return null;
            }
    
            if (action.label === '-')
            {
                return (<Line color={'var(--border)'} />);
            }
            else
            {
                return (
                    <ListItem
                        label={action.label}
                        active ={activeId === action.id}
                        onClick={action.onClick}
                    />
                );
            }
        };
       

        return (
            <React.Fragment key={action.id || action.label}>
                {renderContent()}
            </React.Fragment>
        );


    };


    return (
        <Container height={'400px'} className='action-menu-widget'>
                           
            <ScrollView
                className="action-menu-content"
            >
                <Container />
                {
                    loading ? <Loading /> : (
                        abStore.actions?.length > 0 &&
                        abStore.actions.map(renderItem)
                    )
                }
            </ScrollView>
        </Container>
    );
};

MainAdminBoundary.propsTypes = {
    onSelect: PropTypes.func,
    title: PropTypes.string,
};

MainAdminBoundary.defaultProps = {
    title: 'Việt Nam',
};

MainAdminBoundary = React.forwardRef(MainAdminBoundary);
MainAdminBoundary = inject('appStore', 'fieldForceStore')(observer(MainAdminBoundary));
export default MainAdminBoundary;
