import './DocHeader.scss';

const COMPONENT_STATUS = ['deprecated', 'experimental', 'released'] as const;

export type DocHeaderProps = {
  name: string
  status?: (typeof COMPONENT_STATUS)[number]
}

export const DocHeader = (props: DocHeaderProps): JSX.Element =>
{
    const { name, status } = props;

    return (
        <section className="doc-header">
            <div className="doc-header__main">
                <h1 className="doc-header__name">
                    {name}
                </h1>
            </div>

            {status && (
                <div className={`doc-header__status doc-header__status--${status}`}>
                    <span>
                        {status.toUpperCase()}
                    </span>
                </div>
            )}
        </section>
    );
};
