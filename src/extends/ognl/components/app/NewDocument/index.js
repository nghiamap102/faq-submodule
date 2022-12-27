import { Column, Container, DataGrid, HD6, Row } from "@vbd/vui";
import { initDocumentRequest } from "extends/ognl/pages/DocumentManager/DocumentStore";
import { inject, observer } from "mobx-react"
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./NewDocument.scss";

const NewDocument = (props) => {
    const { ognlStore: { documentStore }, showTitle, paging, actionsColumn } = props;
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageStart, setPageStart] = useState(props.pageStart || 1);
    const [pageLength, setPageLength] = useState(props.pageLength || 10);
    const [searchResult, setSearchResult] = useState(null);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        if (documentStore.refresh) {
            const init = async () => {
                setLoading(true);
                const request = {
                    ...initDocumentRequest, ...{
                        start: pageStart * pageLength - pageLength,
                        length: pageLength
                    }
                }
                const rs = await documentStore.loadData(request);
                setSearchResult(rs);
                setLoading(false);
            };
            setColumns([...props.columns, ...documentStore.columns]);

            if (paging) setPagination({
                pageIndex: pageStart,
                pageSize: pageLength,
                pageSizeOptions: [10, 20, 50, 100],
                onChangePage: (pageIndex) => { setPageStart(pageIndex) },
                onChangeItemsPerPage: (pageSize) => { setPageLength(pageSize) },
            });
            init();
            documentStore.setRefresh(false);
        }
    }, [documentStore.refresh]);
    return (
        <Container className="table-widget">
            <Column>
                {showTitle && <Row className="title"><HD6>Văn bản mới nhất</HD6></Row>}
                <Row>
                    <DataGrid
                        columns={columns}
                        items={documentStore.data}
                        rowKey={'Id'}
                        pagination={pagination}
                        total={searchResult?.total ?? 0}
                        loading={loading}
                        trailingControlColumns={actionsColumn ? [actionsColumn] : []}
                        rowNumber
                    />
                </Row>
            </Column>

        </Container>
    );
}

NewDocument.propTypes = {
    paging: PropTypes.bool,
    showTitle: PropTypes.bool,
    columns: PropTypes.any,
    actionsColumn: PropTypes.any,
    pageStart: PropTypes.number,
    pageLength: PropTypes.number
}
NewDocument.defaultProps = {
    paging: false,
    showTitle: false,
    columns: [],
    actionsColumn: null,
    pageStart: 1,
    pageLength: 10
}

export default inject('ognlStore')(observer(NewDocument));