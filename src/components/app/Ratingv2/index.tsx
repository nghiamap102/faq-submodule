import { Button, Container, HD6 } from "@vbd/vui";
import React from "react";
import './Ratingv2.scss';

interface Ratingv2Props {
    hanldeLike?: () => void;
    hanldeDisLike?: () => void;
}
const Ratingv2: React.FC<Ratingv2Props> = ({
    hanldeLike,
    hanldeDisLike,
}) => {
    return (
        <>
            <Container
                className="rating text-center py-10"
            >
                <Container className="mb-3" >
                    <HD6 style={{ fontWeight: 400, fontSize: '14px' }}>Thông tin này có hữu ích không?</HD6>
                </Container>
                <Container className="btn-group">
                    <Button
                        className="form-control"
                        color="#0b57d0"
                        text="Có"
                        icon="check"
                        onClick={hanldeLike}
                    />
                    <Button
                        className="form-control"
                        text="Không"
                        color="#0b57d0"
                        icon="check"
                        onClick={hanldeDisLike}
                    />
                </Container>
            </Container>
        </>
    );
};

export default Ratingv2;