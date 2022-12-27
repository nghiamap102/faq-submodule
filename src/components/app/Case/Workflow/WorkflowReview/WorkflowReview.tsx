import {
    Column, ListItem,
} from '@vbd/vui';

import './WorkflowReview.scss';

type WorkflowReviewProps = {
    data: Array<any>
}

const WorkflowReview: React.FC<WorkflowReviewProps> = (props) =>
{
    const { data } = props;

    return (
        <Column className="wf-review-container">
            {
                data.filter((item: any) => !item.IsInitial && !item.IsFinal).map((d, index) =>
                {
                    return (
                        <ListItem
                            key={index}
                            label={d.Name}
                            sub={d.Description}
                            icon={<div>{index + 1}</div>}
                        />
                    );
                })
            }
        </Column>
    );
};
export { WorkflowReview };
