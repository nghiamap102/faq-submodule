import { Container, Flex, T } from "@vbd/vui";
import { LINK } from "extends/vbdlis_faq/constant/LayerMetadata";
import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { renderRoute } from "../BreadCrumbv2";
import './BreadcrumbAdmin.scss';
type BreadCrumbAdminProps = {
    title?: string;
    method?: boolean
};
type Route = {
    name: string;
    route: string;
    url: string
}
export const BreadCrumbAdmin: React.FC<BreadCrumbAdminProps> = ({
    title,
    method,
}) => {
    const path = useRouteMatch();
    const routes: Route[] = [
        { name: 'Trang Quản Lý', route: `${LINK.ADMIN}`, url: `${LINK.ADMIN}` },
        { name: `${title}`, route: `${method ? '/undefined' : `${LINK.ADMIN}/${title}`}`, url: `${LINK.ADMIN}/${title}` },
        { name: `${title}`, route: `${method ? `${LINK.ADMIN}/${title}/list` : '/undefined'}`, url: `${LINK.ADMIN}/${title}/list` },
        { name: `Danh Sách`, route: `${method ? `${LINK.ADMIN}/${title}/list` : '/undefined'}`, url: `${LINK.ADMIN}/${title}/list` },
        { name: `${title}`, route: `${method ? `${LINK.ADMIN}/${title}/create` : '/undefined'}`, url: `${LINK.ADMIN}/${title}/create` },
        { name: `Tạo Mới`, route: `${method ? `${LINK.ADMIN}/${title}/create` : '/undefined'}`, url: `${LINK.ADMIN}/${title}/create` },
    ];
    return (
        <Flex className="breadcrumb_admin">
            {renderRoute(routes, path)?.map((ele: Route) => (
                <Container
                    key={ele.url}
                    className="breadcrumb-items"
                >
                    <Link
                        to={`${ele.url}`}
                        className="link"
                        style={{ textTransform: 'capitalize' }}
                    >
                        <T>{ele.name}</T>
                    </Link>
                </Container>
            ))}
        </Flex>
    );
};


