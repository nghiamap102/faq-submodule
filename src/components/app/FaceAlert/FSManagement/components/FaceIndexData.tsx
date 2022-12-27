import { useContext } from 'react';
import { observer } from 'mobx-react';

import {
    Column, Row,
    DataGrid,
    BorderPanel,
    Button,
    useModal,
} from '@vbd/vui';

import { FaceIndexContext } from '../FaceIndexContext';

const FaceIdColumns = [
    { id: 'ID', displayAsText: 'Mã gương mặt', width: 300 },
    { id: 'NImages', displayAsText: 'Số ảnh mặt' },
];

type FSManagementDataProps = {};

function ActionButtons (row: any, _index: number, onActionClick: any)
{
    return (
        <Row>
            <Button
                icon={'trash-alt'}
                color={'default'}
                tooltip={'Xoá'}
                onlyIcon
                onClick={() => onActionClick(row, 'delete')}
            />
        </Row>
    );
}

export let FaceIndexData: React.FC = (props: FSManagementDataProps) =>
{
    const { confirm, toast } = useModal();

    const { listFaceIndex, indexCount, pSize, pNumber, searchKey, setPageSize, clearAllFaceIndex } = useContext(FaceIndexContext);
    const { reloadFaceIndex, setPageNumber, setSearchKey, deleteFaceIndex } = useContext(FaceIndexContext);

    const deleteFaceIndexHandler = (data: any, action: string) =>
    {
        switch (action)
        {
            case 'delete':
                confirm({
                    message: 'Việc này không thể phục hồi. Bạn có chắc xoá index?',
                    onOk: () =>
                    {
                        deleteFaceIndex(data.ID).then(data =>
                        {
                            if (data === -1 || data === 0)
                            {
                                toast({ message: 'Có lỗi xảy ra khi xoá mã gương mặt', type: 'error' });
                            }
                            else if (data === 1)
                            {
                                toast({ message: 'Xoá mã gương mặt thành công', type: 'success' });
                                reloadFaceIndex();
                            }
                        });
                    },
                    onCancel: () => null,
                });
                break;

            default:
                break;
        }
    };

    return (
        <BorderPanel
            className={'face-alert-content'}
            flex={1}
        >
            <Column>
                <DataGrid
                    toolbarActions={(
                        <Button
                            key={'remove-button'}
                            color={'danger'}
                            text={'Xoá toàn bộ index'}
                            disabled={!indexCount}
                            onClick={() =>
                            {
                                confirm({
                                    message: 'Việc này không thể phục hồi. Bạn có chắc xoá toàn bộ index?',
                                    onOk: async () =>
                                    {
                                        await clearAllFaceIndex();
                                        return;
                                    },
                                    onCancel: () => null,
                                });

                            }}
                        />
                    )}
                    rowKey={'ID'}
                    columns={FaceIdColumns}
                    items={listFaceIndex}
                    searching={{
                        searchKey: searchKey,
                        onSearch: (searchKey: string) =>
                        {
                            setSearchKey(searchKey);
                        },
                    }}
                    pagination={{
                        pageIndex: pNumber + 1,
                        pageSize: pSize,
                        pageSizeOptions: [20, 50, 100],
                        onChangePage: (n: number) =>
                        {
                            setPageNumber(n - 1);
                        },
                        onChangeItemsPerPage: (n: number) =>
                        {
                            setPageSize(n);
                        },
                    }}
                    total={indexCount}
                    trailingControlColumns={[
                        {
                            width: 100,
                            headerCellRender: 'Thao tác',
                            rowCellRender: (row: any, index: number) =>
                            {
                                return ActionButtons(row, index, deleteFaceIndexHandler);
                            },
                            freezeEnd: true,
                        },
                    ]}
                    rowNumber
                />
            </Column>
        </BorderPanel>
    );
};

FaceIndexData = observer(FaceIndexData);
