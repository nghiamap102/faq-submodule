import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { createContext, useContext, useEffect } from 'react';

import { FaceImportService } from './FaceImportService';

export const SessionTypes = {
    Image: 'image',
    Gallery: 'gallery',
};

export const ImportStatus = {
    Uploading: 'uploading',
    Uploaded: 'uploaded',
    Processing: 'processing',
    Completed: 'completed',
    Error: 'error',
    ErrorId: 'errorId',
    ErrorAlreadyIndex: 'alreadyIndex',
};

export const ImportActions = {
    Create: 'create',
    Update: 'update',
};

interface BaseModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export interface ImportSession extends BaseModel {
    status: string;
    name: string;
    user: object;
    type: string;
    total: number;
    file?: string | {type: 'Buffer', data: number[]};
    failureCount?: number;
    successCount?: number;
    watchList?: string[];
}

export interface ImageGallery extends BaseModel {
    status: string;
    sessionId: string;
    personId: string;
    faceId: string;
    image: any;
}

export interface FSGallery extends BaseModel {
    personId: string;
    faceId: string;
    name: string;
    faceImage: any;
    organization: string;
    cellPhone: string;
    email: string;
    street: string;
    city: string;
    province: string;
    country: string;
    gender: string;
    dob: Date;
}


export class FaceImportStore
{

    @observable
    sessions = [] as ImportSession[];

    @action
    setSessions = (value: ImportSession[]): void =>
    {
        this.sessions = value;
    }

    @observable
    currentSession = {} as ImportSession | undefined;

    @action
    setCurrentSession = (value: ImportSession | undefined): void =>
    {
        this.currentSession = value;
    }

    @observable
    imageGalleries = [] as ImageGallery[];

    @action
    setImageGalleries = (value: ImageGallery[]): void =>
    {
        this.imageGalleries = value;
    };

    @observable
    galleries = [] as FSGallery[];

    @action
    setGalleries = (value: FSGallery[]): void =>
    {
        this.galleries = value;
    }

    @action
    reloadSessions = async () =>
    {
        const { data: sessions, total } = await FaceImportService.GetImportSessions(this.sessionPageIndex, this.sessionPageSize);
        this.setSessions(sessions);
        this.setTotalSessions(total);
        const session = sessions.find((value) => value.id === this.currentSession?.id);
        session && this.setCurrentSession(session);
        return sessions;
    }

    @observable
    isDisabledStartButton = true;

    @action
    setIsDisabledStartButton = (value: boolean): void =>
    {
        this.isDisabledStartButton = value;
    }

    @observable pageIndex = 0;
    @action setPageIndex = (value: number): void =>
    {
        this.pageIndex = value;
    }

    @observable pageSize = 20;
    @action setPageSize = (value: number): void =>
    {
        this.pageSize = value;
    }

    @observable sessionPageIndex = 1;
    @action setSessionPageIndex = (value: number): void =>
    {
        this.sessionPageIndex = value;
    }

    @observable sessionPageSize = 10;
    @action setSessionPageSize = (value: number): void =>
    {
        this.sessionPageSize = value;
    }

    @observable totalSessions = 0;
    @action setTotalSessions = (value: number): void =>
    {
        this.totalSessions = value;
    }

    @observable totalGalleries = 0;
    @action setTotalGalleries = (value: number): void =>
    {
        this.totalGalleries = value;
    }

    @observable totalGalleriesImages = 0;
    @action setTotalImageGalleries = (value: number): void =>
    {
        this.totalGalleriesImages = value;
    }

    @observable isLoadingDataGrid = false;
    @action setIsLoadingDataGrid = (value: boolean): void =>
    {
        this.isLoadingDataGrid = value;
    }

    getSessionData = (skip = 0): Promise<any> => Promise.resolve()
}


export const FaceImportContext = createContext<FaceImportStore>(new FaceImportStore());
export let FaceImportProvider: React.FC = (props) =>
{
    const faceImportStore = useContext(FaceImportContext);
    const { sessions, currentSession, pageIndex, pageSize, setIsLoadingDataGrid } = faceImportStore;
    const { reloadSessions,setImageGalleries, setGalleries, setTotalImageGalleries, setTotalGalleries, sessionPageIndex, sessionPageSize } = faceImportStore;

    const { children } = props;

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            reloadSessions();
        }, 5000);
        return () => clearTimeout(timer);
    }, [sessions]);

    useEffect(() =>
    {
        reloadSessions();
    }, [sessionPageIndex, sessionPageSize]);

    useEffect(() =>
    {
        setIsLoadingDataGrid(true);
        getSessionData().then(() =>
        {
            setIsLoadingDataGrid(false);
        });
    }, [currentSession?.id, pageIndex, pageSize]);

    useEffect((): any =>
    {
        if (!currentSession)
        {
            setImageGalleries([]);
            setGalleries([]);
            return;
        }

        const timer = setTimeout(getSessionData, 3000);
        return () => clearTimeout(timer);
    }, [currentSession]);

    const getSessionData = (): Promise<any> =>
    {
        switch (currentSession?.type)
        {
            case SessionTypes.Image:
                return FaceImportService.GetImageGalleries(
                    currentSession.id,
                    {
                        skip: (pageIndex) * pageSize,
                        limit: pageSize,
                    },
                ).then(({ data, total }) =>
                {
                    setImageGalleries(data);
                    setTotalImageGalleries(total);
                });

            case SessionTypes.Gallery:
                return FaceImportService.GetGalleries(currentSession.id, {
                    skip: (pageIndex) * pageSize,
                    limit: pageSize,
                })
                    .then(({ data, total }) =>
                    {
                        setGalleries(data);
                        setTotalGalleries(total);
                    });
        }
        return Promise.resolve();
    };
    faceImportStore.getSessionData = getSessionData;

    return <FaceImportContext.Provider value={faceImportStore}>{children}</FaceImportContext.Provider>;
};

FaceImportProvider = observer(FaceImportProvider);
