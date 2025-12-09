import PropTypes from "prop-types"
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import "./datatables.scss";

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
const { ExportCSVButton } = CSVExport;

const CustomTable = ({ 
    title,
    showTableOnly=false,
    filename= '',
    isSearch = false,
    placeholder = 'Search',
    rowsLength = false,
    handleAddButton,
    columns,
    rows,
    loading,
    selectField,
    defaultSorted,
    keyField,
    btnTitle = 'Add',
    isAdd = true,
    isTableHead = true,
    isDisabled = false,
    fas = false,
    is_remote=true,
    ssr = ()=>{} }) => {

    const [page, setPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        if(searchTerm != ''){
            const handler = setTimeout(() => {
                setDebouncedSearchTerm(searchTerm);
            }, 1000);
    
            return () => {
                clearTimeout(handler);
            };
        }
    }, [searchTerm]);

    // Effect to log the debounced search term
    useEffect(() => {
        if(searchTerm != '')
            ssr({page, sizePerPage, searchTerm})
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
        ssr({page, sizePerPage, searchTerm})
    };

    return (
        <React.Fragment>
        <Row>
            <Col className="col-12">
            <Card>
                <CardBody>
                {
                    loading ?
                    <div style={{height: '160px'}}>
                        <div id="status" style={{height: '100vh', width: 'auto'}}>
                            <div className="spinner-chase">
                                <div className="chase-dot"></div>
                                <div className="chase-dot"></div>
                                <div className="chase-dot"></div>
                                <div className="chase-dot"></div>
                                <div className="chase-dot"></div>
                                <div className="chase-dot"></div>
                            </div>
                            <div style={{margin: '30px auto', textAlign: 'center'}}>Loading Please Wait...</div>
                        </div>  
                    </div> :
                    <ToolkitProvider
                    keyField={keyField}
                    data={rows}
                    columns={columns}
                    search
                    exportCSV = {{
                        fileName: filename
                    }}
                    >
                    {props => (
                        rows.length == 0 ? <div className="text-center">No data available</div> :
                        <div>
                        {
                            isTableHead ?
                            <Row>
                                <Col sm="7">
                                    <CardTitle className="h2" style={{ marginTop: "10px" }}>{title}</CardTitle>
                                </Col>

                                {selectField}
                                
                                <Col className="d-flex">
                                    {
                                    isSearch ?
                                        <div className="search-box me-2 d-inline-block" style={{ width: "100%" }}>
                                            <div className="position-relative">
                                                <input className="form-control" placeholder={placeholder} onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
                                                <i className="bx bx-search-alt search-icon" />
                                            </div>
                                        </div>: ''
                                    }
                                    <ExportCSVButton {...props.csvProps} className="btn btn-success me-2"><i className="fas fa-file-csv" /></ExportCSVButton>
                                    {
                                    isAdd ?
                                        <Button
                                            disabled={isDisabled}
                                            color="primary"
                                            style={{ float: "right", width: '160px' }}
                                            onClick={handleAddButton}
                                            onKeyDown={handleAddButton}
                                            >
                                            <i className={`fas ${fas ? fas : "fa-plus" }`}>{" "}{btnTitle}</i>
                                        </Button> : ''
                                    }
                                </Col>
                            </Row> : ''
                        }
                        <div className=" mt-4">
                            {loading ? (
                                <div className="text-center my-3">
                                <span className="">Loading...</span>
                                </div> 
                            ):
                            <BootstrapTable
                                {...props.baseProps}
                                responsive
                                bordered={true}
                                striped={true}
                                classes="table align-middle table-nowrap"
                                headerWrapperClasses={"thead-light"}
                                remote={is_remote}
                                sort={defaultSorted}
                                pagination={paginationFactory(pageOptions)}
                                onTableChange={handleTableChange}
                            />
                        }
                        </div>
                        </div>
                    )}
                    </ToolkitProvider>
                }

                </CardBody>
            </Card>
            </Col>
        </Row>
        </React.Fragment>
    )
}

CustomTable.prototype = {
    title: PropTypes.any,
    showTableOnly: PropTypes.any,
    filename: PropTypes.any,
    isSearch: PropTypes.any,
    placeholder: PropTypes.any,
    rowsLength: PropTypes.any,
    handleAddButton: PropTypes.any,
    columns: PropTypes.any,
    rows: PropTypes.any,
    loading: PropTypes.any,
    selectField: PropTypes.any,
    defaultSorted: PropTypes.any,
    keyField: PropTypes.any,
    btnTitle: PropTypes.any,
    isAdd: PropTypes.any,
    isTableHead: PropTypes.any,
    isDisabled: PropTypes.any,
    fas: PropTypes.any,
    is_remote: PropTypes.any,
    ssr: PropTypes.any
}

export default CustomTable;