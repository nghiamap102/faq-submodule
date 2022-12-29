import { Container, FAIcon, Flex, HD6, T, Tag } from "@vbd/vui";
import { Link } from "react-router-dom";
import './Card.scss';
interface CardProps {
    title?: string;
    linkTo?: string;
    description?: string;
    tag?: Tag[];
};
interface Tag {
    project: string;
    topic: string;
}
const Card: React.FC<CardProps> = ({
    title,
    linkTo,
    description,
    tag,
}) => {

    return (
        <>
            <Container className="card">
                <Link to={`${linkTo}`}>
                    <FAIcon
                        type="solid"
                        icon="paper-plane"
                        size="20px"
                        color="var(--bg-color-primary3)"
                        className='icon'
                    />
                    <Container className="card-inner">
                        <HD6><T>{title}</T></HD6>
                        <Container className="my-3">
                            <T>{description}</T>
                        </Container>
                        <Container>
                            {tag?.map((ele: Tag) => (
                                <Flex key={ele.project}>
                                    <Tag
                                        text={`${ele.project}`}
                                        textCase="sentence"
                                        size="medium"
                                        color=""
                                    />
                                    <Tag
                                        text={`${ele.topic}`}
                                        textCase="sentence"
                                        size="medium"
                                        color=""
                                    />
                                </Flex>
                            ))}
                        </Container>
                    </Container>
                </Link>
            </Container>
        </>
    );
};

export default Card;