import { Container, HD4, Image, T } from '@vbd/vui';
import React, { ReactChild, ReactNode } from 'react';
import './SearchContainer.scss';

interface SearchContainerProps {
    children?: ReactChild | ReactNode;
}
const SearchContainer: React.FC<SearchContainerProps> = ({
    children,
}) => {

    return (
        <>
            <Container className='search-container'>
                <Container className='logo-wrapper'>
                    <Container className='logo-inner'>
                        <Image
                            fitMode='contain'
                            src="https://i.ibb.co/8rvNpcX/logoVBD.png"
                        />
                    </Container>
                </Container>
                <Container className='search-bar'>
                    <HD4>Chúng tôi có thể giúp gì cho bạn?</HD4>
                    {children}
                </Container>
            </Container>
        </>
    );
};

export default SearchContainer;