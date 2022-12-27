import { observer } from 'mobx-react-lite';
import { observable, action } from 'mobx';
import React, { createContext, useContext, useEffect } from 'react';

import { FaceIndexService } from './FaceIndexService';

const service = new FaceIndexService();

type FaceId = {
    ID: string,
    NImages: number,
}

type ListFaceIndex = FaceId[];

export class FaceIndexStore
{
    @observable listFaceIndex = [] as ListFaceIndex;
    @observable indexCount = 0;
    @observable pSize = 50;
    @observable pNumber = 0;
    @observable searchKey = '';

    @action
    setListFaceIndex (newListFaceId: ListFaceIndex): void
    {
        this.listFaceIndex = newListFaceId;
    }

    @action
    setIndexCount = (newValue: number): void =>
    {
        this.indexCount = newValue;
    }

    @action
    setPageSize = (newSize: number): void =>
    {
        this.pSize = newSize;
    }

    @action
    setPageNumber = (newNumber: number): void =>
    {
        this.pNumber = newNumber;
    }

    @action
    setSearchKey = (searchKey: string): void =>
    {
        this.searchKey = searchKey;
    }

    @action
    clearAllFaceIndex = (): void =>
    {
        service.cleanAllIndex().then(data =>
        {
            if (data === 1)
            {
                this.setIndexCount(0);
                this.setListFaceIndex([]);
                this.setPageNumber(0);
            }
        });
    }

    @action
    deleteFaceIndex = async (faceId: string) =>
    {
        const result = await service.deleteFaceIndex(faceId);
        return result;
        // return Promise.resolve(1);
    }

    @action
    reloadFaceIndex = async () =>
    {
        const result = await service.listFaceIndex({ limit: this.pSize, skip: this.pSize * this.pNumber, searchKey: this.searchKey });
        this.setListFaceIndex(result);
    }
}

export const FaceIndexContext = createContext<FaceIndexStore>(new FaceIndexStore());

export let FaceIndexContextProvider: React.FC = (props) =>
{
    const store = useContext(FaceIndexContext);
    const { pSize, pNumber, searchKey } = store;

    useEffect(() =>
    {
        service.getIndexCount().then(data =>
        {
            store.setIndexCount(data);
        });
    }, []);

    useEffect(() =>
    {
        store.reloadFaceIndex();
    }, [pSize, pNumber, searchKey]);

    return <FaceIndexContext.Provider value={store}>{props.children}</FaceIndexContext.Provider>;
};

FaceIndexContextProvider = observer(FaceIndexContextProvider);
