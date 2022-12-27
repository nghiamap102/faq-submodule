import './PopOverSearch.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Column, Container, EmptyData, PopOver, Row, SearchBox, Section, SectionHeader, TB1, ScrollView } from '@vbd/vui';
import Loading from 'extends/ffms/pages/base/Loading';

const SearchListItem = (props) =>
{
    const { onClickItem, searchKey, onSearch, items, renderLabel, header } = props;

    const handleClickAccount = (account) =>
    {
        onClickItem && onClickItem(account);
    };


    const AccountListItem = () =>
    {
        return (
            <ScrollView
                className={'pos-section-bottom'}
            >
                { !items ? <Loading /> :
                    (
                        items?.length > 0 ?
                            items.map((item, index) =>
                            {
                                return (
                                    <Container
                                        key={index}
                                        className={'account-item-container'}
                                        onClick={() => handleClickAccount(item)}
                                    >
                                        <TB1 className={'account-item-label'} >
                                            {renderLabel(item) || ''}
                                            {/* {`${item?.UserName || item?.Name} ${item?.Email ? `(${item.Email})` : ''}`} */}
                                        </TB1>
                                    </Container>
                                );
                            }) : <EmptyData/>
                    )
                }
            </ScrollView>
        );
    };

    return (
        <>
            <Row className={'pos-panel'}>
                <Column>
                    <Section className={'pos-section-top'}>
                        {header && <SectionHeader>{header}</SectionHeader>}
                        <Row itemMargin={'md'}>
                            <SearchBox
                                placeholder={'Nhập từ khóa để tìm kiếm'}
                                value={searchKey}
                                autoFocus
                                onChange={(value) => onSearch && onSearch(value)}
                            />
                        </Row>
                    </Section>
                    <AccountListItem />
                </Column>
            </Row>
        </>
    );
};
SearchListItem.propTypes = {
    onClickItem: PropTypes.func,
    searchKey: PropTypes.string,
    onSearch: PropTypes.func,
    items: PropTypes.array,
    onChangeItems: PropTypes.func,
    renderLabel: PropTypes.func,
    header: PropTypes.string,
};

const PopOverSearch = (props) =>
{
    const { visible, onBackgroundClick, width, anchorEl, ...searchListProps } = props;
    return (
        <>
            {
                visible &&
                <PopOver
                    width={width}
                    anchorEl={anchorEl}
                    onBackgroundClick={onBackgroundClick}
                >
                    <SearchListItem {...searchListProps}/>
                </PopOver>
            }
        </>
    );
};

PopOverSearch.propTypes = {
    visible: PropTypes.bool,
    onBackgroundClick: PropTypes.func,
    width: PropTypes.string,
    anchorEl: PropTypes.any,
};

PopOverSearch.defaultProps = {
    width: '25rem',
};

export default PopOverSearch;
