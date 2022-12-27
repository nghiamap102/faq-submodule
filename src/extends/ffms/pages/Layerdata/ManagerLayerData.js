import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';

import { Container } from '@vbd/vui';

import * as Routers from 'extends/ffms/routes';
import LayerTreeView from 'extends/ffms/pages/Layerdata/LayerTreeView';
import { RouterParamsHelper } from 'helper/router.helper';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';

let ManagerLayerData = (props) =>
{
    const layerFeatureName = RouterParamsHelper.getRouteFeature(Routers.MANAGER_LAYER_DATA, Routers.baseUrl + '/app-config');

    const { pathPermission } = usePermission();
    const [layerListPerm,setLayerListPerm] = useState(layerFeatureName === pathPermission.Path ? pathPermission : null);

    useEffect(() =>
    {
        if (layerFeatureName === pathPermission.Path)
        {
            setLayerListPerm(pathPermission);
        }

    },[pathPermission?.Path]);

    return (
        <Container flex={1}>
            <Switch>
                <Router path={`${Routers.MANAGER_LAYER_DATA}/layer`}>
                    <LayerTreeView appcustomizePermission={layerListPerm}/>
                </Router>
                <Redirect to={`${Routers.MANAGER_LAYER_DATA}/layer`} />
            </Switch>
        </Container>
    );
};

ManagerLayerData = inject('appStore', 'fieldForceStore')(observer(ManagerLayerData));
ManagerLayerData = withRouter(ManagerLayerData);
export default ManagerLayerData;
