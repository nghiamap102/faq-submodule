import { Container, FAIcon, Flex, HD6, T } from "@vbd/vui";
import React from "react";
import PieProgress from "../PieProgress";

type BlockStatsProps = {
    percentage: number;
    color: string;
    title: string;
    count?: number;
    icon?: string
};
const BlockStats: React.FC<BlockStatsProps> = ({
    percentage,
    color,
    title,
    count,
    icon,
}) => {
    return (
        <>
            <Flex >
                <Flex className="relative mx-3">
                    <PieProgress
                        color={color}
                        percentage={percentage}
                        colorNull='var(--gray)'
                        r={20}
                        strokeWidth="4px"
                        style={{ opacity: '0.5' }}
                    >
                        <FAIcon
                            icon={icon}
                            size="14px"
                        />
                    </PieProgress>
                </Flex>
                <Container>
                    <HD6 className="h6 capitalize"><T>{title}</T></HD6>
                    <Container>
                        {count} <T>items</T>
                    </Container>
                </Container>
            </Flex>
        </>
    );
};
export default BlockStats;