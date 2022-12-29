import { useI18n } from 'components/bases/I18n/useI18n';

export const language = localStorage.getItem('language') || 'vi';

type TProps = {
    params?: string[]
}

export const T: React.FC<TProps> = (props) =>
{
    const { t } = useI18n();

    const { children, params } = props;

    if (!children)
    {
        return null;
    }

    return t(children, params);
};
