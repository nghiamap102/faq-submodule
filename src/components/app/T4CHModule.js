import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from './Authentication/PrivateRoute';

const T4CHModule = () =>
{
    return (
        <>
            <PrivateRoute
                path="/station"
                component={lazy(() => import('components/app/CommandStation/CommandStation'))}
            />

            <Route
                path="/cameras-wall"
                component={lazy(() => import('components/app/CameraWall/CameraWall'))}
            />

            <Route
                path="/wall"
                component={lazy(() => import('components/app/CommandWall/CommandWall'))}
            />

            <Route
                path="/console/:page"
                component={lazy(() => import('components/app/CommandConsole/CommandConsole'))}
            />

            <Route path="/console">
                <div>Console</div>
            </Route>
        </>
    );
};

export { T4CHModule };
