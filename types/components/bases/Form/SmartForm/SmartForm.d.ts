import { FieldValues } from 'react-hook-form';
import { SmartFormProps } from '../model/smartFormType';
/**
* SmartForm is a Form wrapper with implement 'react-hook-form' library logic to wrapped children.
*
* Supported react-hook-form's feature: config defaultValues, mode, show error handling, retrieve data when submit.
*
* Supported form's components:
* - Wrapper component: Container, Row, Column, FieldSet,
*   InputGroup, InputAppend, InputPrepend
* - Controllable components: Input, RichText
*
* Reference: {@link https://react-hook-form.com react-hook-form}
*/
export declare const SmartForm: <FormType extends Record<string, unknown> = FieldValues>(props: SmartFormProps<FormType>) => JSX.Element;
//# sourceMappingURL=SmartForm.d.ts.map