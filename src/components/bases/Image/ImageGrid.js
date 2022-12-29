import './ImageGrid.scss';

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Image } from 'components/bases/Image/Image';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { FAIcon } from '@vbd/vicon';
import { Col2 } from 'components/bases/Layout/Column';

const ImageGrid = (props) =>
{
    const gridRef = useRef();
    const blockRef = useRef();
    const cellRef = useRef();
    const [cellMargin, setCellMargin] = useState('0px');

    useEffect(() =>
    {
        adjustMargin();
        window.addEventListener('resize', adjustMargin);

        return () =>
        {
            window.removeEventListener('resize', adjustMargin);
        };
    }, []);

    const adjustMargin = () =>
    {
        if (!gridRef.current || !blockRef.current || !cellRef.current)
        {
            return;
        }

        // Reset padding, let browser do all the calculation again
        setCellMargin('0px');

        // Recalculate manually
        const cellWidth = cellRef.current.clientWidth + 2; // 2px of the border
        const gridWidth = gridRef.current.clientWidth;

        const imgCount = parseInt(gridWidth / cellWidth);
        const remain = gridWidth - imgCount * cellWidth;

        setCellMargin(`${remain / (imgCount + 1)}px`);
    };

    return (
        <ScrollView scrollX={false}>
            {
                !props.isLoading &&
                (
                    !props.data ||
                    !Array.isArray(props.data) ||
                    (Array.isArray(props.data) && props.data.length === 0)
                ) && (
                    <div
                        style={{
                            width: '100%',
                            top: '40%',
                            textAlign: 'center',
                            position: 'absolute',
                        }}
                    >
                        <div style={{ opacity: '0.7' }}>Không có dữ liệu</div>
                    </div>
                )}
            {
                !props.isLoading &&
                (Array.isArray(props.data) && props.data.length > 0) && (
                    <div
                        ref={gridRef}
                        className="img-grid"
                        style={{ marginBottom: cellMargin }}
                    >
                        <div
                            ref={blockRef}
                            className="img-grid-block"
                        >
                            {
                                props.data.map((img, i) => (
                                    <div
                                        key={props.imageKey && img[props.imageKey] ? img[props.imageKey] : i}
                                        ref={(i === 0) ? cellRef : null}
                                        className={`img-grid-cell ${(img.isSelected ? 'selected' : '')}`}
                                        style={{ marginLeft: cellMargin, marginTop: cellMargin }}
                                    >
                                        {
                                            img.onSelect && (
                                                <div className={'img-grid-cell-select'}>
                                                    <FAIcon
                                                        size={'20px'}
                                                        color={img.isSelected ? 'var(--primary-color)' : 'var(--text-color)'}
                                                        icon={img.isSelected ? 'check-circle' : 'circle'}
                                                        onClick={() => img.onSelect(img)}
                                                    />
                                                </div>
                                            )}

                                        <Image
                                            width={'10rem'}
                                            height={'10rem'}
                                            src={img.src}
                                            onClick={(e) => img.onClick && img.onClick(e, img)}
                                        />
                                    </div>
                                ),
                                )
                            }
                        </div>
                    </div>
                )}
            {
                props.isLoading && (
                    <Col2
                        justify={'center'}
                        items={'center'}
                    >
                        <FAIcon
                            icon={'spinner-third'}
                            type={'duotone'}
                            size={'3rem'}
                            spin
                        />
                    </Col2>
                )}
        </ScrollView>
    );
};

ImageGrid.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
        isSelected: PropTypes.bool,
        onClick: PropTypes.func,
        src: PropTypes.any,
    })),
    onSelect: PropTypes.func,
    imageKey: PropTypes.string, // support live update
};

export { ImageGrid };
