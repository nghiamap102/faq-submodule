import { MouseEventHandler, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from 'components/bases/Button';
import { Input } from 'components/bases/Input';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { StoryDoc } from 'components/story/blocks';

import { Form } from '../Form';
import { FormControlLabel } from '../FormControlLabel';

import docs from './Form.docs.mdx';
import changelog from './Form.changelog.md';

export default {
    title: 'Inputs/Form',
    component: Form,
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Form"
                    componentName="Form"
                    component={Form}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

type TemplateForm = Partial<{
    username: string
    password: string
    rememberMe: boolean
}>

const Template: Story = (args) =>
{
    const [formFields, setFormFields] = useState<TemplateForm>({} as TemplateForm);

    const handleChangeUsername = (username: string) => setFormFields({ ...formFields, username });
    const handleChangePassword = (password: string) => setFormFields({ ...formFields, password });
    const handleChangeRememberMe = (rememberMe: boolean) => setFormFields({ ...formFields, rememberMe });

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) =>
    {
        e.preventDefault();
        (action('onSubmit'))();
    };

    return (
        <Form>
            <FormControlLabel
                label="Username"
                control={(
                    <Input
                        type="text"
                        value={formFields.username}
                        onChange={handleChangeUsername}
                    />
                )}
            />
            <FormControlLabel
                label="Password"
                control={(
                    <Input
                        type="password"
                        value={formFields.password}
                        onChange={handleChangePassword}
                    />
                )}
            />
            <FormControlLabel
                label='Remember me?'
                control={(
                    <CheckBox
                        checked={formFields.rememberMe}
                        onChange={handleChangeRememberMe}
                    />
                )}
            />
            <Button
                text="Submit"
                type='submit'
                onClick={handleSubmit}
            />
        </Form>
    );
};

export const SampleLoginForm = Template.bind({});
