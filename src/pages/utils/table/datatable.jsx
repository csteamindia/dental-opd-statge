import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import "./datatables.scss";

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import cellEditFactory from 'react-bootstrap-table2-editor';
const { ExportCSVButton } = CSVExport;

// const MyExportCSV = (props) => {
//   const handleClick = () => {
//     // eslint-disable-next-line react/prop-types
//     props.onExport();
//   };
//   return <button className="btn" onClick={handleClick}>Export to CSV</button>
// };

// eslint-disable-next-line react/prop-types
const Datatables = ({
  showTableOnly = false,
  cellEdit = false,
  filename = '',
  expandRow = {},
  isSearch = false,
  placeholder = 'Search',
  rowsLength = 0,
  rows,
  handleAddButton,
  onRowClick, // Add this prop
  title,
  columns,
  loading,
  selectField,
  defaultSorted,
  keyField,
  btnTitle = 'Add',
  isAdd = true,
  isExcel = true,
  isTableHead = true,
  isDisabled = false,
  fas = false,
  is_remote = true,
  isCheckbox = false,
  ssr = () => { } }
) => {

  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // State for the debounced input

  useEffect(() => {
    if (searchTerm != '') {
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
    if (searchTerm != '')
      ssr({ page, sizePerPage, searchTerm })
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
    ssr({ page, sizePerPage, searchTerm })
  };

  return (
    <React.Fragment>
      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              {
                loading ?
                  <div style={{ height: '160px' }}>
                    <div id="status" style={{ height: '100vh', width: 'auto' }}>
                      <div className="spinner-chase">
                        <div className="chase-dot"></div>
                        <div className="chase-dot"></div>
                        <div className="chase-dot"></div>
                        <div className="chase-dot"></div>
                        <div className="chase-dot"></div>
                        <div className="chase-dot"></div>
                      </div>
                      <div style={{ margin: '30px auto', textAlign: 'center' }}>Loading Please Wait...</div>
                    </div>
                    <div style={{ margin: '30px auto', textAlign: 'center' }}>Loading Please Wait...</div>
                  </div> :
                  <ToolkitProvider
                    keyField={keyField}
                    data={rows}
                    columns={columns}
                    search
                    exportCSV={{
                      fileName: filename
                    }}
                  >
                    {props => (
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
                                        <input className="form-control" placeholder={placeholder} onChange={(e) => {
                                          if (e.target.value != '') {
                                            setSearchTerm(e.target.value)
                                          }
                                        }} defaultValue={searchTerm} />
                                        <i className="bx bx-search-alt search-icon" />
                                      </div>
                                    </div> : ''
                                }
                                {isExcel && (
                                  <ExportCSVButton {...props.csvProps} className="btn btn-success me-2">
                                    <i className="fas fa-file-csv" />
                                  </ExportCSVButton>
                                )}
                                {
                                  isAdd ?
                                    <Button
                                      disabled={isDisabled}
                                      color="primary"
                                      style={{ float: "right", width: '160px' }}
                                      onClick={handleAddButton}
                                      onKeyDown={handleAddButton}
                                    >
                                      <i className={`fas ${fas ? fas : "fa-plus"}`}>{" "}{btnTitle}</i>
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
                          ) :
                            rows.length == 0 ? <div className="text-center">No data available</div> : (
                              <BootstrapTable
                                {...props.baseProps}
                                responsive
                                bordered={true}
                                expandRow={expandRow}
                                striped={true}
                                classes={`table align-middle table-nowrap ${onRowClick ? 'table-hover cursor-pointer' : ''}`}
                                headerWrapperClasses={"thead-light"}
                                remote={is_remote}
                                sort={defaultSorted}
                                pagination={paginationFactory(pageOptions)}
                                onTableChange={handleTableChange}
                                cellEdit={cellEdit != false ? cellEditFactory({
                                  mode: 'click',
                                  blurToSave: true,
                                  afterSaveCell: (oldValue, newValue, row, column) => {
                                    console.log("Changed:", {
                                      field: column.dataField,
                                      oldValue,
                                      newValue,
                                      row
                                    });
                                    updateSttate(row.id, newValue);
                                  }
                                }) : false
                                }
                                rowEvents={onRowClick ? {
                                  onClick: (e, row) => onRowClick(row)
                                } : {}}
                              />
                            )
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

export default Datatables
