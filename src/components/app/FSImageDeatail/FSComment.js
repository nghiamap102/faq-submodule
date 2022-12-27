import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    FSDataContainer,
    Container,
    Button, FormGroup, FormControlLabel, RichText, SectionHeader,
} from '@vbd/vui';

class FSComment extends Component
{
    state = {
        comment: '',
    };

    onChangeComment = (value) =>
    {
        this.setState({ comment: value });
    };

    render()
    {
        return (
            <FSDataContainer>
                <SectionHeader>Diễn biến</SectionHeader>

                <Container className={'fs-comment-content'}>
                    <FormGroup>
                        <FormControlLabel
                            direction={'column'}
                            label={'Nhập diễn biến mới'}
                            control={(
                                <RichText
                                    placeholder={'Nhập tin nhắn mẫu'}
                                    value={this.state.comment}
                                    color="rgba(255, 255, 255, 0.6)"
                                    rows={4}
                                    onChange={this.onChangeComment}
                                />
                            )}
                        />
                    </FormGroup>

                    <Button
                        className={'btn add-button'}
                        color={'primary'}
                        text={'Thêm diễn biến'}
                        formFlex={1}
                        onClick={() => alert(this.state.comment)}
                    />
                </Container>
            </FSDataContainer>
        );
    }
}

FSComment.propTypes = {
    data: PropTypes.object,
};

FSComment = inject('appStore')(observer(FSComment));
export default FSComment;
