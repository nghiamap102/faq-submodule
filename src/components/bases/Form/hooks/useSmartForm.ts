import { ReactElement, ReactNode, cloneElement } from 'react';
import { deepMap } from 'react-children-utilities';
import { UseFormRegister, UseFormRegisterReturn, FieldValues, FieldErrors, FieldError, FieldPath } from 'react-hook-form';

import { CustomOnChange, IControllableField } from '../model/smartFormType';
import { CONTROLLABLE_CHILDREN, CUSTOMIZE_ONCHANGE_COMPONENTS } from '../constants/smartForm';

interface IControllableProps<F extends FieldValues = FieldValues> extends Omit<IControllableField<F>, 'name'> {
  name: FieldPath<F>
}
type AttachableElement = ReactElement<ControllableComponentProps> | ReactElement<IControllableProps>
type ControllableComponentProps = {
  control: ReactElement<IControllableProps>
}

interface IHookArgs<F> {
  /**
   * React-hook-form's register function, allows you to register an input or select element
   * and apply validation rules to React Hook Form.
   *
   * Reference: {@link https://react-hook-form.com react-hook-form}
   */
  register: UseFormRegister<F>
  /**
   * An object with field errors.
   */
  errors?: FieldErrors<F>
  children: ReactNode | ReactNode[]
}
interface IHookReturn {
  controlledChildren: ReactNode | ReactNode[]
}

/**
* This hook responsibility is attach 'register' method and insert 'errors' object to wrapped controllable component.
*
* @return controlledChildren: children with 'register' and 'errors' attached
*/
export const useSmartForm = <FormType extends Record<string, unknown>>({ children, register, errors }: IHookArgs<FormType>): IHookReturn =>
{
    const generateControlledChild = (children: ReactNode | ReactNode[]) => deepMap(children, controlChild);
    const controlChild = (child: ReactNode) => isComponentAttachable(child) ? attachProps(child) : child;

    const attachProps = (child: AttachableElement) => isHaveControllableProps(child) ? attachControlProps(child) : attachChildProps(child);

    // This function only implement for component which received controllable component by it's 'control' props (exp: FormControlLabel)
    const attachControlProps = (child: ReactElement<ControllableComponentProps>) =>
    {
        const controlPropWithRegisterAttached = attachChildProps(child.props.control);
        return cloneElement(child, { ...child.props, control: controlPropWithRegisterAttached });
    };

    const attachChildProps = (child: ReactElement<IControllableProps>) =>
    {
        const { name, rules } = child.props as IControllableProps<FormType>;
        const formRegisterReturn = register(name, rules);
        const fieldWithRegisterAttached = isNeedCustomOnchange(child)
            ? attachRegisterWithCustomOnChange(child, formRegisterReturn)
            : attachRegisterToNormalField(child, formRegisterReturn);

        const errorText = errors && getErrorText(name , errors);
        return !errorText ? fieldWithRegisterAttached : attachErrorText(fieldWithRegisterAttached, errorText);
    };

    return {
        controlledChildren: generateControlledChild(children),
    };
};

const isComponentAttachable = (child: ReactNode): child is AttachableElement =>
{
    if (isReactElement(child))
    {
        const isControllableChild = checkControllable(child) && !!child.props?.name && typeof child.props.name === 'string';
        return isControllableChild || isHaveControllableProps(child);
    }
    return false;
};

const isHaveControllableProps = (child: ReactElement): child is ReactElement<ControllableComponentProps> =>
{
    return !!child.props?.control && isReactElement(child.props.control) && checkControllable(child.props.control);
};

const getErrorText = <F extends FieldValues>(name: FieldPath<F>, errors: FieldErrors<F>) =>
{
    const errorField = errors[name] as FieldError | undefined;
    return errorField?.message;
};

const isReactElement = (child: ReactNode): child is ReactElement =>
{
    const reactElementKeys: (keyof ReactElement)[] = ['key', 'props', 'type'];
    return !isPrimitive(child) ? reactElementKeys.every(key => key in child) : false;
};

type PrimitiveType = string | number | boolean | undefined | null
const isPrimitive = (child: ReactNode): child is PrimitiveType =>
{
    const primitives = ['undefined', 'number', 'string', 'boolean'];
    return primitives.some(priv => typeof child === priv) || child === null;
};

const isNeedCustomOnchange = (child: ReactElement<any>): child is ReactElement<CustomOnChange> => CUSTOMIZE_ONCHANGE_COMPONENTS.includes(child.type);

const checkControllable = ({ type }: ReactElement) => CONTROLLABLE_CHILDREN.some(controllableType => controllableType === type);

const attachRegisterToNormalField = (child: ReactElement, formRegisterReturn: UseFormRegisterReturn) => cloneElement(child, { ...child.props, ...formRegisterReturn });

const attachRegisterWithCustomOnChange = (child: ReactElement<CustomOnChange>, formRegisterReturn: UseFormRegisterReturn) =>
{
    const { onChange, ...rest } = formRegisterReturn;
    return cloneElement<CustomOnChange>(child, { ...child.props, ...rest, customOnChange: onChange });
};

const attachErrorText = (child: ReactElement, errorText: string) =>
{
    return cloneElement(child, { ...child.props, errorText: child.props.errorText ? [child.props.errorText, errorText] : errorText });
};
