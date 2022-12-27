import navigateWhite from 'images/icon/navigation_white.png';

import React, { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import * as THREE from 'three';
import { useLoader } from 'react-three-fiber';

const Plane = (props) =>
{
    const { SIZE_EP, ROTATE, HEIGHT, OPACITY, COLOR } = props.appStore.streetViewStore.STREET_VIEW;
    const { planeMapping, degCameraRotating, degRealRotating, panoramaPoints, streetViewData, interactedPoint, setCloseMapIcon, setPlaneMapping, setInteractedPoint } = props.appStore.streetViewStore;

    const pMRef = useRef();
    const pGRef = useRef();
    const texture = useLoader(THREE.TextureLoader, navigateWhite);

    const [positionGM, setPositionGM] = useState([0, 0, 0]);
    const [rotationGM, setRotationGM] = useState([0, 0, 0]);

    useEffect(() =>
    {
        setPositionGM([0, -HEIGHT, 0]);
        setRotationGM([ROTATE, 0, 0]);
    }, []);

    const handlePointMove = ({ point: position }) =>
    {
        let dMax = 999999999;
        let panoramaPoint = null;
        const coordinates = [null, null];

        const dx = position.x * position.x;
        const dz = position.z * position.z;

        const dis = Math.sqrt(dx + dz);

        const rad = THREE.Math.degToRad(degCameraRotating - degRealRotating);

        coordinates[0] = streetViewData.coordinates[0] + (Math.cos(rad) * dis) * 0.00000012;
        coordinates[1] = streetViewData.coordinates[1] + (Math.sin(rad) * dis) * 0.00000012;

        panoramaPoints.map((point) =>
        {
            const dx = point?.dx - position?.x;
            const dz = point?.dz - position?.z;

            const d = Math.abs(dx * dx + dz * dz);

            if (d < dMax)
            {
                dMax = d;
                panoramaPoint = { ...point, visible: true };
            }
        });

        if (coordinates)
        {
            setCloseMapIcon(coordinates, 'coordinates');
        }

        if (panoramaPoint)
        {
            setPlaneMapping({
                rotation: [ROTATE, 0, THREE.Math.degToRad(interactedPoint.heading + 90)],
                position: [position.x, position.y, position.z]
            });

            setInteractedPoint(panoramaPoint);
        }
        else
        {
            setPlaneMapping({ ...planeMapping, position: [position.x, position.y, position.z] });
            setInteractedPoint(false, 'visible');
        }
    };

    if (!planeMapping)
    {
        return null;
    }

    return (
        <>
            <mesh
                ref={pMRef}
                position={planeMapping.position}
                rotation={planeMapping.rotation}
            >
                <planeGeometry
                    attach="geometry"
                    args={[SIZE_EP, SIZE_EP, 1]}
                />
                <meshBasicMaterial
                    color={COLOR}
                    attach="material"
                    opacity={OPACITY}
                    transparent
                    depthTest={false}
                    map={texture}
                />
            </mesh>

            <mesh
                ref={pGRef}
                position={positionGM}
                rotation={rotationGM}
                onPointerMove={handlePointMove}
            >
                <planeBufferGeometry
                    attach="geometry"
                    args={[51200, 51200, 1, 1]}
                />
                <meshBasicMaterial
                    color={COLOR}
                    attach="material"
                    opacity={OPACITY}
                    transparent
                    depthTest={false}
                    visible={false}
                />
            </mesh>
        </>
    );
};

export default inject('appStore')(observer(Plane));
