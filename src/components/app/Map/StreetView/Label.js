import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import * as THREE from 'three';
import { useLoader, useUpdate } from 'react-three-fiber';

const Label = ({ label, dx, rotate, STREET_VIEW_CONST }) =>
{
    const font = useLoader(THREE.FontLoader, '/fonts/gentilis_bold.typeface.json');

    const { HEIGHT, ROTATE, FONT_SIZE, LABEL_COLOR, OPACITY } = STREET_VIEW_CONST;

    const shapes = font ? font.generateShapes(label, FONT_SIZE) : null;

    const mesh = useUpdate(
        ({ position, rotation }) =>
        {
            position.set(dx, -HEIGHT, 0);
            rotation.set(ROTATE, 0, rotate);
        }, [label]
    );

    useEffect(() =>
    {
        const { geometry } = mesh.current;
        geometry.computeBoundingBox();

        const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        const yMid = -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
        geometry.translate(xMid, yMid, 0);
    });

    return (
        <mesh ref={mesh}>
            <shapeBufferGeometry
                attach="geometry"
                args={[shapes]}
            />
            <meshBasicMaterial
                color={LABEL_COLOR}
                attach="material"
                opacity={OPACITY}
                transparent
                depthTest={false}
            />
        </mesh>
    );
};

const StreetLabel = (props) =>
{
    const { HEIGHT, ROTATE } = props.appStore.streetViewStore.STREET_VIEW;

    const [label, setLabel] = useState();

    const { streetViewData } = props.appStore.streetViewStore;

    useEffect(() =>
    {
        if (streetViewData)
        {
            setLabel(streetViewData.street);
        }
    }, [streetViewData]);

    if (!label)
    {
        return null;
    }

    return (
        <>
            <Label
                dx={HEIGHT}
                rotate={ROTATE}
                label={label}
                STREET_VIEW_CONST ={props.appStore.streetViewStore.STREET_VIEW}
            />
            <Label
                dx={-HEIGHT}
                rotate={-ROTATE}
                label={label}
                STREET_VIEW_CONST ={props.appStore.streetViewStore.STREET_VIEW}
            />
        </>
    );
};

export default inject('appStore')(observer(StreetLabel));

