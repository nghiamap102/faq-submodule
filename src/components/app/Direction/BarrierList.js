import './BarrierList.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    ScrollView, Row,
    ListItem, FAIcon,
    withModal,
} from '@vbd/vui';

class BarrierList extends Component
{
    directionStore = this.props.appStore.directionStore;

    setSelectedObjectIndex = (index, obj) =>
    {
        this.directionStore.setSelectedBarrier(index, obj.id);
    };

    handleDeleteObject = (obj) =>
    {
        this.directionStore.removeSingleBarrier(obj.id);
    };

    handleClickMenu = (e, obj) =>
    {
        e.stopPropagation();
        const actions = [];

        if (obj)
        {
            actions.push(
                {
                    label: 'Xóa',
                    onClick: () =>
                    {
                        this.handleDeleteObject(obj);
                    },
                },
            );
        }

        this.props.menu({
            id: 'place-list-more-action',
            position: { x: e.clientX - 150, y: e.clientY }, // 150 is width of ContextMenu
            actions: actions,
        });
    };

    render()
    {
        const listBarrier = this.directionStore.barrier.listBarrier;
        const activeIndex = this.directionStore.barrier.activeIndex;

        return (
            <ScrollView>
                {
                    listBarrier.map((barr, i) =>
                    {
                        const type = barr.type === 'Point' ? 'Điểm' : barr.type === 'Polygon' ? 'Vùng' : 'Đường';

                        return (
                            <ListItem
                                key={i}
                                label={type}
                                sub={barr.des}
                                className={`barrier-object-${barr.type}`}
                                active={activeIndex === i}
                                trailing={(
                                    <Row
                                        width='24px'
                                        height='24px'
                                        mainAxisAlignment='center'
                                        crossAxisAlignment='center'
                                        onClick={(e) => this.handleClickMenu(e, barr)}
                                    >
                                        <FAIcon
                                            size='1.5rem'
                                            type='regular'
                                            icon='ellipsis-v'
                                        />
                                    </Row>
                                )}
                                onClick={() =>
                                {
                                    this.setSelectedObjectIndex(i, barr);
                                }}
                            />
                        );
                    })
                }
            </ScrollView>
        );
    }
}

BarrierList = withModal(inject('appStore')(observer(BarrierList)));
export default BarrierList;
