import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import "./datatables.scss";

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import cellEditFactory from 'react-bootstrap-table2-editor';
const { ExportCSVButton } = CSVExport;

const CardDatatable = ({
    showTableOnly = false,
    cellEdit = false,
    filename = '',
    expandRow = {},
    isSearch = false,
    isExcel = true,
    placeholder = 'Search',
    rowsLength = 0,
    rows = [],
    handleAddButton,
    onRowClick,
    title,
    columns,
    loading,
    selectField,
    defaultSorted,
    keyField,
    btnTitle = 'Add',
    isAdd = true,
    isTableHead = true,
    isDisabled = false,
    fas = false,
    isCheckbox = false,
    is_remote = true,
    ssr = () => { }
}) => {

    const [page, setPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // debounce 500ms
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        // send search to server when debounced term changes
        ssr({ page, sizePerPage, searchTerm: debouncedSearchTerm });
    }, [debouncedSearchTerm]);

    const sizePerPageList = [
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: '50', value: 50 },
        { text: '100', value: 100 },
        { text: 'All', value: rowsLength }
    ];

    const pageOptions = {
        sizePerPage: sizePerPage,
        totalSize: rowsLength,
        page: page || 1,
        hideSizePerPage: false,
        sizePerPageList: sizePerPageList,
    }

    const handleTableChange = (type, { page, sizePerPage }) => {
        setPage(page);
        setSizePerPage(sizePerPage);
        ssr({ page, sizePerPage, searchTerm });
    };

    return (
        <React.Fragment>
            <Row>
                <Col className="col-12">
                    <ToolkitProvider
                        keyField={keyField}
                        data={rows}
                        columns={columns}
                        search
                        exportCSV={{ fileName: filename }}
                    >
                        {toolkitProps => (
                            <Card className="shadow-sm border-0 rounded-3">
                                {isTableHead && (
                                    <div className="card-header d-flex justify-content-between align-items-center bg-light border-bottom">
                                        <CardTitle className="mb-0 h5">{title}</CardTitle>

                                        <div className="d-flex align-items-center">
                                            {selectField}

                                            {isSearch && (
                                                <div className="search-box me-2 d-inline-block" style={{ width: "220px" }}>
                                                    <div className="position-relative">
                                                        <input
                                                            className="form-control"
                                                            placeholder={placeholder}
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                        <i className="bx bx-search-alt search-icon" />
                                                    </div>
                                                </div>
                                            )}

                                            {isExcel && (
                                                <ExportCSVButton {...toolkitProps.csvProps} className="btn btn-outline-success me-2">
                                                    <i className="fas fa-file-csv" />
                                                </ExportCSVButton>
                                            )}

                                            {isAdd && (
                                                <Button
                                                    disabled={isDisabled}
                                                    color="primary"
                                                    className="d-flex align-items-center"
                                                    onClick={handleAddButton}
                                                    onKeyDown={handleAddButton}
                                                >
                                                    <i className={`fas ${fas ? fas : "fa-plus"} me-1`} />
                                                    {btnTitle}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <CardBody>
                                    {loading ? (
                                        <div className="text-center my-5">Loading Please Wait...</div>
                                    ) : rows.length === 0 ? (
                                        <div className="text-center my-3">No data available</div>
                                    ) : (
                                        <BootstrapTable
                                            {...toolkitProps.baseProps}        // <-- use toolkit props here
                                            responsive
                                            bordered={false}
                                            expandRow={expandRow}
                                            striped
                                            classes={`table align-middle table-nowrap ${onRowClick ? 'table-hover cursor-pointer' : ''}`}
                                            headerWrapperClasses={"thead-light"}
                                            remote={is_remote}
                                            sort={defaultSorted}
                                            pagination={paginationFactory(pageOptions)}
                                            onTableChange={handleTableChange}
                                            cellEdit={cellEdit !== false ? cellEditFactory({
                                                mode: 'click',
                                                blurToSave: true,
                                                afterSaveCell: (oldValue, newValue, row, column) => {
                                                    console.log("Changed:", {
                                                        field: column.dataField,
                                                        oldValue,
                                                        newValue,
                                                        row
                                                    });
                                                    // keep your updateSttate call if you have it defined elsewhere
                                                    if (typeof updateSttate === 'function') updateSttate(row.id, newValue);
                                                }
                                            }) : false}
                                            rowEvents={onRowClick ? {
                                                onClick: (e, row) => onRowClick(row)
                                            } : {}}
                                        />
                                    )}
                                </CardBody>
                            </Card>
                        )}
                    </ToolkitProvider>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default CardDatatable;
