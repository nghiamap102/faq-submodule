import { Meta, Story } from '@storybook/react';

// import Row from 'components/bases/Layout/Row';
// import Column from 'components/bases/Layout/Column';
import { Flex, FlexOwnProps } from 'components/bases/Layout/Flex';
// import { Box } from 'components/bases/Layout/Box';
// import { Button } from '../../Form';

export default {
    title: 'Layout/Flex',
    component: Flex,
    decorators: [(Story) => <div style={{ width: '100vw', height: '100vh', margin: '-1rem' }}><Story /></div>],
} as Meta;

const Template: Story<FlexOwnProps> = (args) =>
{
    // const [count, setCount] = useState(2);
    // const ref = useRef(null);

    // const onRemove = () =>
    // {
    //     if (count === 0)
    //     {
    //         return;
    //     }

    //     setCount(count - 1);
    // };

    // const onAdd = () =>
    // {
    //     setCount(count + 1);
    // };

    const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eget dui
  cursus, facilisis mi in, euismod dolor. Aliquam ultrices dignissim
  sapien sed efficitur. Etiam nisi turpis, efficitur maximus ornare id,
  ornare ut est. Aliquam elementum justo non quam vestibulum consequat.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ante ex,
  efficitur eu rutrum a, tincidunt sit amet odio. Pellentesque quis cursus
  purus. Sed faucibus ultricies scelerisque. Quisque hendrerit ante sit
  amet enim lacinia ultrices. Donec hendrerit, neque a porttitor pharetra,
  augue massa laoreet lectus, et convallis nibh lacus scelerisque nulla.
  Mauris id justo commodo, porttitor mauris at, lacinia magna. Mauris
  dictum imperdiet lobortis. Donec eu neque a elit ullamcorper vulputate
  id sit amet quam. Sed tempus dignissim urna nec rhoncus. Nulla lobortis
  sem tincidunt augue auctor interdum. Proin ac varius ipsum. Aenean
  pharetra, diam eu bibendum congue, erat neque ornare nulla, non feugiat
  massa odio at dui. Nunc at sem ut sem accumsan laoreet. Nunc dolor nisi,
  fringilla a dui mollis, eleifend consequat nunc. Mauris interdum, leo ac
  rhoncus interdum, sapien felis tempus turpis, a dignissim neque dolor et
  neque. Donec ultricies pharetra ante, at tincidunt est tristique vel.
  Quisque viverra quis nisi quis convallis. Nam vitae sem ultrices,
  rhoncus arcu ut, molestie erat. Vivamus semper vitae odio sit amet
  varius. Donec dignissim magna eget mattis suscipit. Integer elementum
  mauris ut ligula interdum fermentum. Sed faucibus quis ante sit amet
  finibus. Nullam quis dignissim justo. Sed porttitor, nisi vel cursus
  dignissim, mauris magna fringilla elit, vitae ullamcorper neque sem ac
  ante. Sed dignissim suscipit mauris sit amet posuere. Cras faucibus nibh
  eget dui suscipit, commodo pellentesque lacus fringilla. Nulla facilisi.
  Etiam metus ante, sagittis ac mi sit amet, rhoncus faucibus nulla.
  Integer fringilla nibh leo, non ullamcorper ex laoreet quis. Duis id
  lacinia mi. Nullam in consequat sapien. Duis eleifend arcu sem, ut
  pretium diam pellentesque non. Vivamus quis elementum nulla, non
  consectetur quam. Aenean tincidunt nisl mi, auctor ornare tellus
  efficitur sed.`;

    const FixedContent = (props: JSX.IntrinsicElements['div']) => (
        <div
            style={{ padding: '1em', color: 'white', backgroundColor: 'var(--primary-color)' }}
            {...props}
        >
      Fixed content
        </div>
    );

    const OverflowWidth = (props: JSX.IntrinsicElements['div'] & { height?: string }) => (
        <div style={{ padding: '1em', height: props.height ?? '' }}>
            <p>Line 1</p>
            <p>Line 2</p>
            <p style={{ whiteSpace: 'nowrap' }}>{longText}</p>
        </div>
    );

    const OverflowHeight = (props: JSX.IntrinsicElements['div'] & { width?: string }) => (
        <div style={{ padding: '1em', width: props.width ?? '100%' }}>
            {longText}
        </div>
    );

    const arr = [];
    for (let i = 1; i < 50; i++)
    {
        arr.push(i);
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Flex
                direction="col"
                height="full"
                divide="y"
                panel
            >
                <Flex
                    height={36}
                    divide="x"
                    panel
                >
                    <Flex
                        direction="col"
                        width="2/5"
                        gap={4} // demo bug
                        sx={{
                            p: 4,
                            // // p: {
                            // //     'xs': 1,
                            // //     'desktop': 4,
                            // // },
                            // spaceBetweenX: {
                            //     'xs': 1,
                            //     'desktop': 2,
                            // },
                            // spaceBetweenXReverse: {
                            //     'xs': true,
                            // },
                        }}
                        wrap
                        panel
                        scroll
                    >
                        {/* <Box sx={{ position: 'sticky', left: 0, width: 14, bgColor: 'lime700', height: 'full' }}>Sticky</Box> */}
                        {arr.map((item) => (
                            <Flex
                                key={item}
                                direction="col"
                                width={24}
                                // sx={{
                                //     // width: 20,
                                //     // mt: {
                                //     //     'xs': 0,
                                //     // },
                                //     // mr: {
                                //     //     'xs': 1,
                                //     // },
                                //     // mb: {
                                //     //     'xs': 2,
                                //     // },
                                //     // ml: {
                                //     //     'xs': 3,
                                //     // },
                                //     // p: {
                                //     //     'xs': 1,
                                //     // },
                                //     // mt: {
                                //     //     xs: arr1[Math.floor(Math.random() * arr1.length)],
                                //     // },
                                //     // mr: {
                                //     //     xs: arr1[Math.floor(Math.random() * arr1.length)],
                                //     // },
                                //     // mb: {
                                //     //     xs: arr1[Math.floor(Math.random() * arr1.length)],
                                //     // },
                                //     // ml: {
                                //     //     xs: arr1[Math.floor(Math.random() * arr1.length)],
                                //     // },
                                //     // my: {
                                //     //     'xs': -1,
                                //     //     'desktop': 2,
                                //     // },
                                //     // mx: {
                                //     //     'xs': -1,
                                //     //     'desktop': 2,
                                //     // },
                                //     maxWidth: '7xl',
                                //     border: 'px',
                                //     borderColor: 'emerald600',
                                //     borderOpacity: 55,
                                //     borderTop: 4,
                                //     borderTopRightRadius: 'md',
                                //     borderBottomRadius: 'sm',
                                //     color: 'amber500',
                                //     fontWeight: 'bold',
                                //     textOpacity: 85,
                                //     fontSize: 'lg',
                                //     fontStyle: 'italic',
                                //     textTransform: 'uppercase',
                                //     textDecoration: 'underline',
                                //     verticalAlign: 'bottom',
                                //     textOverflow: 'clip',
                                //     workBreak: 'all',
                                //     bgColor: 'pink600',
                                //     bgOpacity: 85,
                                //     lineHeight: 'none',
                                //     letterSpacing: 'wide',
                                //     listStyleType: 'decimal',
                                //     listStylePosition: 'inside',
                                //     // ['&:hover']: {
                                //     //     mt: 2,
                                //     //     mr: 4,
                                //     //     p: {
                                //     //         'xs': 4,
                                //     //     },
                                //     // },
                                //     // ['&:active']: {
                                //     //     mb: 2,
                                //     //     ml: 4,
                                //     //     p: {
                                //     //         'hd': 2,
                                //     //     },
                                //     // },
                                // }}
                            >
                                {item * 99999}
                                <br />
                                {item * 99999}
                            </Flex>
                        ))}
                    </Flex>
                    <Flex
                        direction="row"
                        width="3/5"
                        gap={4}
                        sx={{
                            p: 4,
                        }}
                        panel
                        wrap
                        scroll
                    >
                        {/* <Box sx={{ position: 'sticky', top: 0, width: 'full', bgColor: 'lime700', height: 12 }}>Sticky</Box> */}
                        {arr.map((item) => (
                            <Flex
                                key={item}
                                direction="col"
                                width={20}
                                panel
                            >
                                {item * 99999}
                                <br />
                                {item * 99999}
                            </Flex>
                        ))}
                    </Flex>
                    {/* <Flex panel
                        direction="col"
                        width="2/5" // demo bug
                        gap={4}
                        wrap
                        scroll
                    >
                        {arr.map((item) => (
                            <Flex panel
                                key={item}
                                direction="col"
                                width={24}
                            >
                                {item * 99999}
                                <br />
                                {item * 99999}
                            </Flex>
                        ))}
                    </Flex>
                    <Flex panel
                        direction="row"
                        width="3/5"
                        gap={4}
                        wrap
                        scroll
                    >
                        {arr.map((item) => (
                            <Flex panel
                                key={item}
                                direction="col"
                                width={20}
                            >
                                {item * 99999}
                                <br />
                                {item * 99999}
                            </Flex>
                        ))}
                    </Flex> */}
                </Flex>

                <Flex
                    divide="x"
                    panel
                >
                    <Flex
                        direction="col"
                        width={12}
                        panel
                        scroll
                    >
                        <OverflowHeight />
                    </Flex>

                    <Flex
                        direction="col"
                        width={72}
                        divide="y"
                        panel
                    >
                        <Flex
                            panel
                            scroll
                        >
                            <OverflowHeight />
                        </Flex>

                        <FixedContent />

                        <Flex
                            panel
                            scroll
                        >
                            <OverflowHeight />
                        </Flex>
                    </Flex>

                    <Flex
                        direction="col"
                        divide="y"
                        panel
                    >
                        <Flex
                            divide="x"
                            panel
                        >
                            <Flex
                                direction="col"
                                divide="y"
                                panel
                            >
                                <FixedContent />

                                <Flex
                                    direction="col"
                                    panel
                                    scroll
                                >
                                    <OverflowHeight />
                                </Flex>
                            </Flex>

                            <Flex
                                direction="col"
                                divide="y"
                                panel
                            >
                                <Flex
                                    direction="col"
                                    panel
                                    scroll
                                >
                                    <OverflowHeight />
                                </Flex>

                                <FixedContent />
                            </Flex>
                        </Flex>
                        <Flex
                            divide="x"
                            panel
                        >
                            <Flex
                                grow={0}
                                items="start"
                                gap={{
                                    x: 1,
                                    y: 2,
                                }}
                                panel
                                item
                            >
                                <div>a</div>
                                <div>b</div>
                                <div>c</div>
                                <div>d</div>
                            </Flex>

                            <Flex
                                panel
                                // height={48}
                                scroll
                            >
                                <OverflowWidth />
                            </Flex>
                        </Flex>

                        <FixedContent />
                    </Flex>
                </Flex>
            </Flex>
            {/* <Flex panel // demo only flex wrap container
                direction="row" // switch col
                width={80}
                height={80}
                gap={4}
                wrap
                scroll
            >
                {arr.map((item) => (
                    <Flex panel
                        key={item}
                        direction="col"
                        width={24}
                    >
                        {item * 99999}
                        <br />
                        {item * 99999}
                    </Flex>
                ))}
            </Flex> */}
        </div>
    );
};

export const Default = Template.bind({});

// export const Center = Template.bind({});
// Center.args = {
//     mainAxisAlignment: 'center',
//     crossAxisAlignment: 'center',
// };

// export const WithMargin = Template.bind({});
// WithMargin.args = {
//     itemMargin: 'lg',
// };
