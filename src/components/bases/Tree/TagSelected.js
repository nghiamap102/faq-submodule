import './TagSelected.scss';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Tag } from 'components/bases/Tag/Tag';

const TagSelected = ({ data, onRemoveTag }) =>
{
    const [tagData, setTagData] = useState([]);

    useEffect(() =>
    {
        setTagData(data);
    }, [data]);

    const handleRemoveTag = async (tag) =>
    {
        const newTagData = tagData.filter((tagItem) => tagItem.id !== tag.id);

        setTagData(newTagData);
        onRemoveTag(tag);
    };

    return (
        tagData && tagData.length > 0 && (
            <ScrollView className={'tsp-tag-data-container'}>
                {
                    tagData.map((tag) => (
                        <Tag
                            key={tag.id}
                            text={tag.label}
                            onCloseClick={() => handleRemoveTag(tag)}
                        />
                    ),
                    )
                }
            </ScrollView>
        )

    );
};

export default TagSelected;

TagSelected.propTypes = {
    data: PropTypes.array,
    onRemoveTag: PropTypes.func,
};

TagSelected.defaultProps = {
    data: [],
    onRemoveTag: () =>
    {
    },
};
