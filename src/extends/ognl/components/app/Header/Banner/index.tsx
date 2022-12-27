import { Container, HD1 } from "@vbd/vui";
import { inject, observer } from "mobx-react";

let Banner = (props: any) => {
    return (
        <Container className="banner">
            <HD1>Cổng thông tin điện tử</HD1>
        </Container>
    );
}
Banner = inject('ognlStore')(observer(Banner));
export default Banner;