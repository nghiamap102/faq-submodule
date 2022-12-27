import { useFrame, useThree } from 'react-three-fiber';
import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { extend } from 'react-three-fiber';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

const Controls = ({ cameraZoom, onCameraRotate, appStore, ...props }) =>
{
    const { camera, gl } = useThree();
    const { FOVS, DISTANCE } = appStore.streetViewStore.STREET_VIEW;
    const ref = useRef();

    const { streetViewData, isResetCameraPosition, updateCompass } = appStore.streetViewStore;


    // reset when change panorama
    useEffect(() =>
    {
        if (isResetCameraPosition)
        {
            camera.position.set(0, 0, -DISTANCE);
            updateCompass(90);
        }
    }, [streetViewData]);

    // for zoom
    useEffect(() =>
    {
        camera.fov = FOVS[cameraZoom];
        camera.updateProjectionMatrix();
    }, [cameraZoom]);

    useFrame(({ gl, scene, camera }) =>
    {
        ref.current.update();

        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);

        const sph = new THREE.Spherical();
        sph.setFromVector3(dir);

        const deg = THREE.Math.radToDeg(sph.theta) + 90;
        onCameraRotate(deg, gl.domElement);
    });


    return (
        <orbitControls
            ref={ref}
            target={[0, 0, 0]}
            {...props}
            args={[camera, gl.domElement]}
        />
    );
};

export default inject('appStore')(observer(Controls));
