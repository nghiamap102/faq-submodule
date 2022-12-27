import { Container, Link } from "@vbd/vui";
import VBDLISFAQStore from "extends/vbdlis_faq/VBDLISFAQStore";
import { observer } from "mobx-react";
import React from "react";
import { useHistory } from "react-router-dom";
import DrawerCustom from "../Drawer";
import SearchBar from "../SearchBar";
import './Header.scss';

type HeaderProps = {
    searchBar?: boolean;
    vbdlisFaqStore: VBDLISFAQStore
};
const Header: React.FC<HeaderProps> = ({
    searchBar,
    vbdlisFaqStore,
}) => {

    const history = useHistory();
    const { keywordStore, questionStore } = vbdlisFaqStore;
    const handleChangeSearch = (keyword: string) => {
        keywordStore?.setSearchKey(keyword);
        questionStore.getQuestionsFilter({ filterQuery: [`questionTitle : *${keywordStore.searchKey}*`] });
    };
    const handleSubmitSearch = (e: React.SyntheticEvent) => {
        e.preventDefault();
        history.push(`/vbdlisfaq/home/search?q=${keywordStore?.searchKey}`);
    }
    return (
        <>
            <Container className="header ">
                {/* <DrawerCustom
                    title="FAQ"
                    menu={[
                        {
                            id: 'Link',
                            name:
                                <Container>
                                    <Link className="">
                                        Test
                                    </Link>
                                </Container>,
                        },

                    ]}
                /> */}
                {searchBar && (
                    <SearchBar
                        handleSearchChange={handleChangeSearch}
                        handleSubmit={handleSubmitSearch}
                        style={{ width: '60%' }}
                        value={keywordStore?.searchKey}
                        vbdlisFaqStore={vbdlisFaqStore}
                        background
                    />
                )}
            </Container>
        </>
    );
};
export default observer(Header);