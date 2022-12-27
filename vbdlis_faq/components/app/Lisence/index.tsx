import { AdvanceSelect, Container, Flex, FormControlLabel, Image, T } from "@vbd/vui";
import LanguageSelect from "extends/ffms/components/LanguageSelect/LanguageSelect";
import React from "react";
import { Link } from "react-router-dom";
import './Lisence.scss';
import logo from 'extends/vbdlis_faq/assets/image/logo.png';
type LisenceProps = {

};
export const Lisence: React.FC<LisenceProps> = ({

}) => {
    const handleChangeLang = (e: any) => {
        console.log(e);
    }
    return (
        <>
            <Flex
                className="lisence py-2 px-4"
                justify="between"
                items="center"
            >
                <Container>
                    <Link
                        to='/'
                        className="mr-4"
                    >
                        <Image
                            className="logo-mini"
                            src={logo}
                        />
                    </Link>
                    <T>Vietbando</T>
                </Container>
                <Flex
                    items="center"
                >
                    <Link
                        to='/'
                        className="link text mr-3"
                    >
                        © {new Date().getFullYear()} Vbd, Inc.
                    </Link>
                    <FormControlLabel
                        className='my-2'
                        control={(
                            <LanguageSelect
                            // options={[{ id: 'English', label: 'English' }]}
                            // placeholder="Chọn ngôn ngữ"
                            // noneSelectValue={undefined}
                            // value={undefined}
                            // clearable
                            // onChange={handleChangeLang}
                            />
                        )}
                    />
                </Flex>
            </Flex>
        </>
    );
};