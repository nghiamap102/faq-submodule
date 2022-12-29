import './Iconstories.scss';
import { data1, data2, data3, data4, data5, data6, SVG } from '@vbd/vicon';

import React, { useRef, useState } from 'react';

// const SVGIcons = (props) => {

//     const { icons } = props;
//     const [activeIdx, setActiveIdx] = useState();
//     const textareaRef = useRef([]);

//     const copyCodeToClipboard = (idx) => {
//         setActiveIdx(idx)
//         textareaRef.current[idx].select();
//         document.execCommand('copy');
//     }

//     const renderIcons = () => {
//         return icons.map((ic, idx) => {
//             return (
//                 <div
//                     key={idx}
//                     className={activeIdx === idx ? 'item active' : 'item'}
//                     onClick={() => copyCodeToClipboard(idx)}
//                 >
//                     <SVG fill={props.fill} name={ic.name} width={"32px"} height={"32px"} />
//                     <textarea
//                         ref={ref => textareaRef.current[idx] = ref}
//                         value={ic.name}
//                         readOnly
//                         rows='2'
//                     />
//                 </div>
//             )
//         })
//     }

//     return (
//         <div className="items-category">
//             {renderIcons()}
//         </div>
//     )
// }
const SVGIcons = (props) =>
{

    const { icons } = props;
    const [activeIdx, setActiveIdx] = useState();
    const textareaRef = useRef([]);

    const copyCodeToClipboard = (idx) =>
    {
        setActiveIdx(idx);
        textareaRef.current[idx].select();
        document.execCommand('copy');
    };

    const renderIcons = () =>
    {
        return icons.map((ic, idx) =>
        {
            return (
                <div
                    key={idx}
                    className={activeIdx === idx ? 'item active' : 'item'}
                    onClick={() => copyCodeToClipboard(idx)}
                >
                    <div className="item_body">
                        <span className="item_checked">
                            <svg
                                className="item_checked-svg"
                                viewBox="0 0 12 10"
                            >
                                <polyline points="1.5 6 4.5 9 10.5 1" />
                            </svg>
                        </span>
                        <SVG
                            fill={props.fill}
                            name={ic.name}
                        />
                        <textarea
                            ref={ref => textareaRef.current[idx] = ref}
                            value={ic.name}
                            rows='2'
                            readOnly
                        />

                    </div>
                </div>
            );
        });
    };

    return (
        <div className="items-category">
            {renderIcons()}
        </div>
    );
};

export default {
    title: 'Icons/Icon Library',
    component: SVGIcons,
    argTypes: {
        fill: {
            control: 'color',
        },
        icons: {
            table: {
                disable: true,
            },
        },
    },
};

const Template = (args) => <SVGIcons {...args} />;

export const UserInterface = Template.bind({});
UserInterface.args = {
    icons: data1,
    fill: 'var(--primary-color)',
};

export const LocationAndMap = Template.bind({});
LocationAndMap.args = {
    icons: data2,
    fill: 'var(--primary-color)',
};

export const Direction = Template.bind({});
Direction.args = {
    icons: data3,
    fill: 'var(--primary-color)',
};

export const System = Template.bind({});
System.args = {
    icons: data4,
    fill: 'var(--primary-color)',
};

export const Category = Template.bind({});
Category.args = {
    icons: data5,
    fill: 'var(--primary-color)',
};

export const Logo = Template.bind({});
Logo.args = {
    icons: data6,
    fill: 'var(--primary-color)',
};

export const AllIcon = Template.bind({});
AllIcon.args = {
    icons: data1.concat(data2, data3, data4, data5, data6),
    fill: 'var(--primary-color)',
};
