import './Slider.scss';
import React,{ useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { T } from '@vbd/vui';

import InputSlider from 'react-input-slider';

const Slider = (props) =>
{
    const { onChange, min, max, step, title, value } = props;
    const [val, setVal] = useState(value ?? 5);
    const onSlideChange = (x)=>
    {
        setVal(x.x);
        onChange(x.x);
    };
    
    return (
        <div>
            <div className='bar-content'>
                {/* <T>{min}</T> */}
                <div className="sliders">
                    {/* {title && <div ><T>{title}</T></div>} */}
                
                    <InputSlider
                        className="u-slider"
                        xmin={min}
                        xmax={max}
                        xstep={step}
                        x={val}
                        onChange={(x)=>onSlideChange(x)}
                    />
                
                </div>
                {/* <T>{max}</T> */}
            </div>
            <div>
                <h3 className="slide-value">{val + ' '}<T>phút</T></h3>
            </div>
        </div>
        
    );
};
Slider.propTypes = {
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    title: PropTypes.string,
    value: PropTypes.number,
};
export default Slider;

