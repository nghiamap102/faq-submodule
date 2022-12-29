import { Container } from '@vbd/vui';
import parse from 'html-react-parser';
import './Preview.scss';


const Preview = (props: any) => {


    const renderReview = (content: string) => {
        if (content) {
            return content
        } else {
            // return "Xin Hãy Nhập Nội Dung Nào Đó"
        }
    }
    const options = {
        replace: (domNode: any) => {
            if (domNode.attribs && domNode.attribs.class === 'remove') {
                return <></>;
            }
        },
    };

    return (
        <>
            <Container className='cc'>
                {parse(renderReview(props.content), options)}
            </Container>
        </>
    );
};

export default Preview;