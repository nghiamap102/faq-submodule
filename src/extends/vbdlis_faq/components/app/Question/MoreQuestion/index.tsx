import { Container, EmptyButton, Flex, HD6 } from "@vbd/vui";
import React from "react";
import './MoreQuestion.scss';
type MoreQuestionProps = {
    onClick?: () => void;
};
export const MoreQuestion: React.FC<MoreQuestionProps> = ({
    onClick,
}) => {
    return (
        <>
            <Container className="more_question py-6 bd-top-black">
                <Flex direction="col">
                    <Container width="40%">
                        <Container className="mb-3">
                            <HD6 className="heading">Nếu bạn còn câu hỏi khác?</HD6>
                        </Container>
                        <EmptyButton
                            text="Liên hệ hỗ trợ"
                            className="btn_contact"
                            onClick={onClick}
                        />
                    </Container>
                </Flex>
            </Container>
        </>
    );
};