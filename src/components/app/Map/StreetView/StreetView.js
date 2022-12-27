import './StreetView.scss';

import React, { Suspense, useState } from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { Canvas } from 'react-three-fiber';

import { Container, Compass } from '@vbd/vui';

import Controls from './Control';
import Dome from './Dome';
import Plain from './Plane';
import PanoramaPoint from './PanoramaPoint';
import InfoContext from './InfoContext';
import StreetLabel from './Label';

const StreetView = (props) =>
{

    const streetViewStore = props.appStore.streetViewStore;
    const { streetViewData, degRealRotating, degCameraRotating, updateCompass, loadSceneByLngLat, closeMapIcon } = streetViewStore;
    const { DISTANCE, FOVS, CAMERA_ZOOM } = streetViewStore.STREET_VIEW;


    const [typeMouse, setTypeMouse] = useState(null);
    const [isStart, setIsStart] = useState(true);
    const [pointDown, setPointDown] = useState();
    const [glElement, setGlElement] = useState(null);
    const [cameraZoom, setCameraZoom] = useState(CAMERA_ZOOM);

    const handleCameraRotate = (deg, glElement) =>
    {
        // limit load component or just call once when start app
        if (typeMouse === 'down' && deg !== degCameraRotating)
        {
            updateCompass(deg);
        }

        if (isStart && streetViewData?.id) // call once when create component
        {
            updateCompass(deg);

            setIsStart(false);
            setGlElement(glElement);
        }
    };

    const handlePointUp = (point) =>
    {
        if (point?.clientX && point?.clientY && pointDown)
        {
            const dx = Math.abs(point.clientX - pointDown.clientX);
            const dy = Math.abs(point.clientY - pointDown.clientY);

            if (dx < 10 && dy < 10)
            {
                loadSceneByLngLat({
                    lng: closeMapIcon.coordinates[0],
                    lat: closeMapIcon.coordinates[1]
                }, false);
            }
        }
    };

    const handleSetTypeMouse = (type, point) =>
    {
        setTypeMouse(type);

        if (type === 'down')
        {
            setPointDown({ clientX: point.clientX, clientY: point.clientY });
        }

        if (type === 'up' && (point))
        {
            handlePointUp(point);
        }
    };

    const handleZoomIn = () =>
    {
        if (cameraZoom > 0)
        {
            setCameraZoom(cameraZoom - 1);
        }
    };

    const handleZoomOut = () =>
    {
        if (cameraZoom < (FOVS.length - 1))
        {
            setCameraZoom(cameraZoom + 1);
        }
    };

    if (!(streetViewData?.id))
    {
        return null;
    }

    return (
        <>
            <Canvas
                camera={{ position: [0, 0, -DISTANCE] }}
                className={`street-view-container mouse-${typeMouse}`}
            >
                <Provider appStore={props.appStore}>
                    <Controls
                        onCameraRotate={handleCameraRotate}
                        cameraZoom={cameraZoom}
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.2}
                        autoRotate={false}
                        rotateSpeed={-0.2}
                    />
                    <Suspense fallback={null}>
                        <group
                            onPointerDown={(e) => handleSetTypeMouse('down', e)}
                            onPointerUp={(e) => handleSetTypeMouse('up', e)}
                        >
                            <Dome/>
                            <Plain/>
                            <PanoramaPoint/>
                            <StreetLabel/>
                        </group>
                    </Suspense>
                </Provider>
            </Canvas>

            <Container>
                <Container className="ctrl-zoom">
                    <Container
                        onClick={handleZoomIn}
                        id="zoomIn"
                        className="ctrl-zoom-button ctrl-zoom-in"
                    />
                    <Container
                        onClick={handleZoomOut}
                        id="zoomOut"
                        className="ctrl-zoom-button ctrl-zoom-out"
                    />
                </Container>

                <InfoContext glElement={glElement}/>

                <Container
                    id="compassContainer"
                    className={'compassContainer'}
                >
                    <Compass style={{ ...degRealRotating && { transform: `rotate(${degCameraRotating + 90 - degRealRotating}deg)` } }}/>
                </Container>
            </Container>
        </>

    );
};

export default inject('appStore')(observer(StreetView));


