import closeIcon from 'images/icon/close_blue.png';

import React from 'react';
import { inject, observer } from 'mobx-react';
import * as THREE from 'three';
import { useLoader } from 'react-three-fiber';

const PanoramaPoint = (props) =>
{
    const { ROTATE, HEIGHT, SIZE_EP, COLOR, OPACITY } = props.appStore.streetViewStore.STREET_VIEW;
    const { interactedPoint } = props.appStore.streetViewStore;

    const textureCloseIcon = useLoader(THREE.TextureLoader, closeIcon);

    const position = [interactedPoint.dx, -HEIGHT, interactedPoint.dz];
    const rotation = [ROTATE, 0, THREE.Math.degToRad(interactedPoint.heading)];

    return (
        <mesh
            position={position}
            rotation={rotation}
            visible={interactedPoint.visible}
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
                map={textureCloseIcon}
            />
        </mesh>
    );
};

export default inject('appStore')(observer(PanoramaPoint));

