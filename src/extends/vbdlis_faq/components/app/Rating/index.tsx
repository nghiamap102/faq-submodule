import { EmptyButton, Flex, HD6 } from "@vbd/vui";
import React from "react";
import './Rating.scss';

interface RatingProps {
    hanldeLike?: () => void;
    hanldeDisLike?: () => void;
}


const Rating: React.FC<RatingProps> = ({
    hanldeLike,
    hanldeDisLike,
}) => {
    return (
        <>
            <Flex className="rating">
                <HD6 className="mr-4">Thông tin này có hữu ích không?</HD6>
                <Flex className="" justify="center" items="center">
                    <EmptyButton
                        className="form-control"
                        color="#0b57d0"
                        text="Có"
                        onClick={hanldeLike}
                    />
                    <EmptyButton
                        className="form-control"
                        text="Không"
                        color="#0b57d0"
                        onClick={hanldeDisLike}
                    />
                </Flex>
            </Flex>
        </>
    );
};

export default Rating;