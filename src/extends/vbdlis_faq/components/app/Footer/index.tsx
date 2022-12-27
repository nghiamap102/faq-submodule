import { Container, EmptyButton, Flex, HD6, Popup } from "@vbd/vui";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import React, { useState } from "react";
import ModifiedQuestion from "../Question/ModifiedQuestion";
import './Footer.scss';
type FooterProps = {
    vbdlisFaqStore: VBDLISFAQStore;
};
export const Footer: React.FC<FooterProps> = ({
    vbdlisFaqStore,
}) => {
    const [isOpenPopupQuestion, setIsOpenPopupQuestion] = useState<boolean>(false);

    return (
        <Container className=" relative footer bg-skin py-3">
            <Container className="container">
                <Container className="text-center mb-5"><HD6 className="heading">Không tìm thấy thứ bạn cần? Hãy thử ở đây.</HD6></Container>
                <Flex
                    justify="center"
                    items="center"
                >
                    <EmptyButton
                        text="Liên hệ hỗ trợ"
                        className="btn_contact"
                        onClick={() => setIsOpenPopupQuestion(true)}
                    />
                    {isOpenPopupQuestion && (
                        <Popup
                            title="Gửi câu hỏi"
                            onClose={() => setIsOpenPopupQuestion(false)}
                        >
                            <ModifiedQuestion vbdlisFaqStore={vbdlisFaqStore} />
                        </Popup>
                    )}
                </Flex>
            </Container>
        </Container>
    );
};