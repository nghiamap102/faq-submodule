import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { useLoader } from 'react-three-fiber';
import * as THREE from 'three';

const Dome = (props) =>
{
    const ref = useRef();

    const { SKY_BOX } = props.appStore.streetViewStore.STREET_VIEW;

    const { streetViewData } = props.appStore.streetViewStore;

    const url = `/api/pano?id=${streetViewData?.id}&batch=${streetViewData?.level_max}`;

    const left = useLoader(THREE.TextureLoader, `${url}_left`);
    const right = useLoader(THREE.TextureLoader, `${url}_right`);
    const top = useLoader(THREE.TextureLoader, `${url}_top`);
    const bottom = useLoader(THREE.TextureLoader, `${url}_bottom`);
    const front = useLoader(THREE.TextureLoader, `${url}_front`);
    const back = useLoader(THREE.TextureLoader, `${url}_back`);

    useEffect(() =>
    {
        ref.current.geometry.scale(-1, 1, 1);
    }, []);

    if (!streetViewData)
    {
        return null;
    }

    return (
        <mesh
            ref={ref}
            visible
        >
            <boxBufferGeometry
                attach="geometry"
                args={[SKY_BOX, SKY_BOX, SKY_BOX]}
            />

            <meshBasicMaterial
                attachArray="material"
                depthTest={false}
                map={right}
            />
            <meshBasicMaterial
                attachArray="material"
                depthTest={false}
                map={left}
            />
            <meshBasicMaterial
                attachArray="material"
                depthTest={false}
                map={top}
            />
            <meshBasicMaterial
                attachArray="material"
                depthTest={false}
                map={bottom}
            />
            <meshBasicMaterial
                attachArray="material"
                depthTest={false}
                map={front}
            />
            <meshBasicMaterial
                attachArray="material"
                depthTest={false}
                map={back}
            />
        </mesh>
    );
};

export default inject('appStore')(observer(Dome));
