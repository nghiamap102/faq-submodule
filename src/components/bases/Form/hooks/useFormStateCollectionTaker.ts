import { useState, useEffect } from 'react';

import { LOCAL_STORAGE_KEYS } from '../constants/smartForm';
import { FormStateCollection } from '../model/smartFormType';

// Trigger an event when invoke localStorage.setItem
const originalSetItem = window.localStorage.setItem;
window.localStorage.setItem = function(...args)
{
    const event = new Event('storageChange');
    originalSetItem.apply(this, args);
    document.dispatchEvent(event);
};

/**
* This hook responsibility is retrieve formSate collection from localStorage.
*
* Form state collection format: { [formId]: formState }
* @example const {formA: FormAState, formB: FormBState} = useFormStateCollectionTaker()
*
* Reference:
* {@link https://react-hook-form.com/api/useformstate react-hook-form formState}
*/
export const useFormStateCollectionTaker = (): FormStateCollection =>
{
    const [collection, setCollection] = useState<FormStateCollection>(getFormStateCollection);

    useEffect(() =>
    {
        document.addEventListener('storageChange', handleStorageChange);
        return () =>
        {
            document.removeEventListener('storageChange', handleStorageChange);
        };
    }, []);

    const handleStorageChange = () =>
    {
        const collection = getFormStateCollection();
        const isEmptyObj = !Object.keys(collection).length;
        !isEmptyObj && setCollection(collection);
    };

    return collection;
};

export const getFormStateCollection = (): FormStateCollection =>
{
    try
    {
        const collection = window.localStorage.getItem(LOCAL_STORAGE_KEYS.formState);
        return collection ? JSON.parse(collection) : {};
    }
    catch (error)
    {
        console.log(error);
        return {};
    }
};
