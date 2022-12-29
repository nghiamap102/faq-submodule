import './StoryHeader.scss';

export const StoryHeader: React.FC = ({ children }) =>
{
    return (
        <div className="story-header__wrapper">
            <div className="story-header__header">{children}</div>
        </div>
    );
};
