import { useFormState, FormState, FieldValues, Control, FieldErrors, FieldError } from 'react-hook-form';
import useDeepCompareEffect from 'use-deep-compare-effect';
import mapValuesDeep from 'deepdash/es/mapValuesDeep';
import cloneDeep from 'lodash/cloneDeep';

import { useI18n } from 'components/bases/I18n/useI18n';

import { getFormStateCollection } from './useFormStateCollectionTaker';
import { CIRCULAR_OBJECT_IN_FORM_STATE, DEFAULT_ERROR_MESSAGE, LOCAL_STORAGE_KEYS } from '../constants/smartForm';
import { DefaultErrorMsgKey, FormStateCollection } from '../model/smartFormType';

interface FormStateSynchronizerArgs<F> {
    /**
     * The form id need to be synchronize
     */
    formId: string
    /**
     * The react-hook-form's control object.
     *
     * {@link https://react-hook-form.com/api/useform/control react-hook-form control}
     */
    control: Control<F>
}

/**
* This hook responsibility is save form's state object to localStorage by id.
*
* Reference:
* {@link https://react-hook-form.com/api/useformstate react-hook-form formState}
*/
export const useSmartFormSynchronizer = <F extends FieldValues>({ formId, control }: FormStateSynchronizerArgs<F>): void =>
{
    const { t } = useI18n();
    const formStateProxy = useFormState<F>({ control });
    const formState = cloneDeep(formStateProxy);
    const formStateWithErrorMessage = applyDefaultErrorMessage(formState, t);
    const synchronizableFormState = removeCircularObjectInFormState(formStateWithErrorMessage);

    useDeepCompareEffect(() =>
    {
        syncFormStateCollection(formId, synchronizableFormState);
    }, [formId, synchronizableFormState]);
};

const syncFormStateCollection = <F extends FieldValues>(formId: string, formState: FormState<F>): void =>
{
    try
    {
        const newCollection = generateNewFormStateCollection(formId, formState);
        const isNeedCleanUp = checkCollectionCleanUpNeed(newCollection);
        !isNeedCleanUp && storeFormStateCollection(newCollection);
        isNeedCleanUp && storeFormStateCollection(cleanUpUnAvailableFormStateInCollection(newCollection));
    }
    catch (error)
    {
        console.log(error);
    }
};

const checkCollectionCleanUpNeed = (collection: FormStateCollection) =>
{
    const formIds = getAvailableFormIds();
    const collectionFormIds = Object.keys(collection);
    return !collectionFormIds.every(formId => formIds.includes(formId));
};

const cleanUpUnAvailableFormStateInCollection = (collection: FormStateCollection) =>
{
    const formIds = getAvailableFormIds();
    const collectionEntries = Object.entries(collection);
    const cleanedCollectionEntries = collectionEntries.filter(([key]) => formIds.includes(key));
    return Object.fromEntries(cleanedCollectionEntries);
};

const getAvailableFormIds = () =>
{
    const formElements = Array.from(document.getElementsByTagName('form'));
    return formElements.map(({ id }) => id).filter(id => typeof id === 'string');
};

const generateNewFormStateCollection = <F extends FieldValues>(formId: string, formState: FormState<F>) =>
{
    const collection = getFormStateCollection();
    const isUpdating = formId in collection;
    return { ...collection, [formId]: isUpdating ? { ...collection[formId], ...formState } : formState };
};

const storeFormStateCollection = (collection: FormStateCollection): void =>
{
    // Remove circular object for JSON.stringify
    const stringifiedCollection = JSON.stringify(collection);
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.formState, stringifiedCollection);
};

const removeCircularObjectInFormState = (formState: FormState<FieldValues>) => mapValuesDeep(formState, (value, key, _, context) =>
{
    const isCircularObj = CIRCULAR_OBJECT_IN_FORM_STATE.some(val => val === key);
    // @ts-expect-error: the skipChildren method is exist but not found in deepdash's type definition
    return isCircularObj ? context?.skipChildren(true) : value;
}, { checkCircular: true });


const applyDefaultErrorMessage = <F extends FieldValues>(formState: FormState<F>, t: any) =>
{
    try
    {
        const { errors } = formState;
        const isEmptyObj = !Object.keys(errors).length;
        return isEmptyObj ? formState : { ...formState, errors: appendDefaultErrorMessage(errors, t) };
    }
    catch (error)
    {
        console.log(error);
        return formState;
    }
};

const appendDefaultErrorMessage = <F extends FieldValues>(errors: FieldErrors<F>, t: any) =>
{
    const errorsEntries = Object.entries(errors) as [DefaultErrorMsgKey, FieldError][];
    const messageAppended = errorsEntries.map(([key, value]) =>
    {
        const isNeedDefaultMsg = !value?.message || !value.message?.length;
        const defaultErrorMessage = DEFAULT_ERROR_MESSAGE[value.type as DefaultErrorMsgKey] ?? '';
        return [key, isNeedDefaultMsg ? { ...value, message: t(defaultErrorMessage) } : value];
    });
    return Object.fromEntries(messageAppended);
};

