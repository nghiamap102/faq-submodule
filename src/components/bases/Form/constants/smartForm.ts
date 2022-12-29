import { ElementType } from 'react';

import { RichText } from '../../Text/RichText';
import { Row, Column, Row2, Col2 } from '../../Layout';
import { Input } from '../../Input/Input';
import { Container } from '../../Container/Container';
import { Button, EmptyButton } from '../../Button/Button';
import { CheckBox } from '../../CheckBox/CheckBox';
import { InputGroup } from '../InputGroup/InputGroup';
import { InputPrepend } from '../InputGroup/InputPrepend';
import { InputAppend } from '../InputGroup/InputAppend';
import { FormControlLabel } from '../FormControlLabel';
import { FieldSet } from '../FieldSet';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { DateTimePicker } from 'components/bases/DateTimePicker/DateTimePicker';
import { MultilineInput } from 'components/bases/MultilineInput/MultilineInput';
import { DynamicFormComponents, WrapperComponents, DefaultErrorMsgKey } from '../model/smartFormType';

export const MAPPED_COMPONENTS: Record<DynamicFormComponents, ElementType> = {
    Input,
    FieldSet,
    FormControlLabel,
    Container,
    Row,
    Column,
    Row2,
    Col2,
    Button,
    EmptyButton,
    InputGroup,
    InputAppend,
    InputPrepend,
    RichText,
    CheckBox,
    AdvanceSelect,
    DateTimePicker,
    MultilineInput,
};

export const CUSTOMIZE_ONCHANGE_COMPONENTS: (React.JSXElementConstructor<any> | string)[] = [Input, RichText, CheckBox, AdvanceSelect, DateTimePicker, MultilineInput];
// export const CONTROLLABLE_CHILDREN: (React.JSXElementConstructor<any> | string)[] = [ Input, RichText ];
export const CONTROLLABLE_CHILDREN: (React.JSXElementConstructor<any> | string)[] = [ Input, RichText, CheckBox, AdvanceSelect, DateTimePicker, MultilineInput ];
export const WRAPPER_COMPONENTS: WrapperComponents[] = ['FieldSet', 'Container', 'Column', 'Row', 'Col2', 'Row2', 'InputGroup', 'InputAppend', 'InputPrepend'];

export const CIRCULAR_OBJECT_IN_FORM_STATE = ['ref'];

export const LOCAL_STORAGE_KEYS = {
    formState: 'formState',
};
export const DEFAULT_ERROR_MESSAGE: Record<DefaultErrorMsgKey, string> = {
    required: 'Trường này là bắt buộc.',
    min: 'Giá trị của trường nhỏ hơn giá trị tối thiểu.',
    max: 'Giá trị của trường lớn hơn giá trị tối đa.',
    minLength: 'số ký tự của trường nhỏ hơn giới hạn tối thiểu.',
    maxLength: 'Số ký tự của trường vượt quá giới hạn tối đa.',
    pattern: 'giá trị của trường sai mẫu.',
    validate: 'Giá trị của trường không hợp lệ.',
};
