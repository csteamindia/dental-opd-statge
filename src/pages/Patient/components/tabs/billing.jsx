import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Modal, ModalBody, Row, Col, Card, CardBody, Table, CardFooter } from 'reactstrap';
import { get } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { BILLING_URL } from 'helpers/url_helper';
import moment from 'moment';
import { showConfirmAlert } from "pages/utils/alertMessages";

const Billing = ({ patientData }) => {
    const [isAdd, setIsAdd] = useState(false);
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });
    const [viewModal, setViewModal] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    const billingColumns = [
        { dataField: 'id', text: '#', style: { width: '20px' }, },
        { dataField: 'date', text: 'Bill Date', formatter: (cell, row) => moment(row.date).format('DD-MM-YYYY') },
        { dataField: 'billing_no', text: 'Bill Number' },
        { dataField: 'total', text: 'Bill Total' },
        { dataField: 'paid', text: 'Bill paid' },
        { dataField: 'pending', text: 'Bill Pending' },
        { dataField: 'note', text: 'Note' },
        // eslint-disable-next-line react/display-name
        {
            dataField: 'status', text: 'Status', formatter: (cell, row) => {
                switch (row.status) {
                    case 1:
                        return <span className="badge-soft-info p-1">Partial Paid</span>
                    case 2:
                        return <span className="badge-soft-success p-1">paid</span>
                    case 3:
                        return <span className="badge-soft-danger p-1">Canceled</span>
                    default:
                        return <span className="badge-soft-warning p-1">Pending</span>
                }
            }
        }, { dataField: 'actions0', style: { width: '20px' },  text: '', formatter: (cell, row) => {
                return <>
                    <a href="#" className="btn btn-info btn-sm edit p-2 me-2 " onClick={() => handlePdfViewModal(row)} title="Print bill"><i className="fas fa-print" /></a>
                    {
                    row.status == 0 ? <a href="#" className="btn btn-danger btn-sm edit p-2" onClick={() => handleCancelBill(row.id)} title="Cancel bill"><i className="mdi mdi-close" /></a>: ''
                    }
                </>
            }
        },
    ];

    const handleToggle = () => {
        setIsAdd(!isAdd);
    };

    const fetchBillings = async () => {
        const { success, body } = await get(`${BILLING_URL}?patient_id=${patientData?.id}&page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    }

    useEffect(() => {
        fetchBillings();
    }, [])

    const handleCancelBill = async (id, sts) => {
        const action = sts == 0 ? 'Cancel' : '';
    
        const { isConfirmed } = await showConfirmAlert(`${action} Bill`, `Do you really want to ${action} this Bill?`,
            `Yes, ${action} it!`, `${action}d!`, `Bill has been ${action}d successfully.`);
    
        if (isConfirmed) {
            const { success } = await get(`${BILLING_URL}/cancel/${id}`);
            if (success) fetchBillings();
        }
    };

    const handlePdfViewModal = (row) => {
        console.log(row);

        setViewModal(!viewModal);
        setPdfData(row)
    }

    const cardRef = useRef(null);

    const printInvoice = () => {
        if (!cardRef.current) {
            console.warn("Card not rendered yet");
            return;
        }
        const printContents = cardRef.current.innerHTML;
        console.log(printContents)
        const newWindow = window.open('Print Billing Details', '');
        newWindow.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; }
                        th { background: #f4f4f4; }
                    </style>
                </head>
                <body>${printContents}</body>
            </html>
        `);
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
    };

    console.log('pdfData', pdfData);

    return (
        <>
            <Datatables
                isSearch={true}
                columns={billingColumns}
                showTableOnly={true}
                rowsLength={rows?.totalItems || 0}
                rows={rows.items || []}
                keyField={'id'}
                handleAddButton={handleToggle}
                title="All Bills"
                isAdd={false}
                isTableHead={true}
                ssr={setPagination}
            />

            <Modal size="lg" isOpen={viewModal}>
                <div className='d-flex justify-content-between pt-3 ps-3 pe-3'>
                    <h5>Billing Details</h5>
                    <span role="button" onClick={() => setViewModal(!viewModal)}>x</span>
                </div>
                <hr />
                <ModalBody className='mt-0'>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div ref={cardRef} className="invoice-title">
                                        <Row>
                                            <Col xs="6" className="text-end"></Col>
                                            <Col xs="6" className="text-end" style={{ textAlign: 'right' }}>
                                                <div className="mb-1">
                                                    <img src="https://oralstop.com/storage/184/2-(1).png" alt="logo" height="46" />
                                                </div>
                                                <address>
                                                    <span>Oralstop Dental Clinic</span>
                                                    <React.Fragment key={"key"}>
                                                        <br />
                                                        <span>Akshya Nagar 1st Block 1st Cross,<br />Rammurthy nagar, <br />Bangalore - 560016</span>
                                                    </React.Fragment>
                                                </address>
                                            </Col>
                                        </Row>
                                        <br />

                                        <Row>
                                            <Col xs="6">
                                                <div className="table-responsive">
                                                    <table className='table table-bordered' style={{ maxWidth: '300px' }}>
                                                        <tbody>
                                                            <tr><th>Bill No# : </th><td>{pdfData?.billing_no}</td></tr>
                                                            <tr><th>Bill Date : </th><td>{moment(pdfData?.date).format('DD-MM-YYYY')}</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Col>
                                            <Col xs="6"></Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col>
                                                <div className="mt-3 text-center">
                                                    <h3 className="font-size-15 fw-bold">Bill summary</h3>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs="6" style={{ textAlign: 'left' }}>
                                                <address>
                                                    <b>{`${pdfData?.patients?.title} ${pdfData?.patients?.first_name} ${pdfData?.patients?.last_name}`}</b>
                                                    <React.Fragment key={"key"}>
                                                        <br />
                                                        <span>{pdfData?.patients?.address},<br />{pdfData?.patients?.city}, <br />{pdfData?.patients?.state} - {pdfData?.patients?.zip_code}</span>
                                                    </React.Fragment>
                                                </address>
                                            </Col>
                                            <Col xs="6" className="text-end"></Col>
                                        </Row>
                                        <br />


                                        <div className="table-responsive">
                                            <Table className="table-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "70px" }}>Sr No.</th>
                                                        <th>Tratment</th>
                                                        <th>Tooth</th>
                                                        <th>Amount</th>
                                                        <th className="text-end">Final Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { pdfData?.treatment_info ? JSON.parse(pdfData.treatment_info)?.map(
                                                        (item, key) => (
                                                        <tr key={"key"}>
                                                            <td>1</td>
                                                            <td>{item?._type}</td>
                                                            <td>{item?._type}</td>
                                                            <td>{item?.cost}</td>
                                                            <td className="text-end">{item?.total}</td>
                                                        </tr>
                                                    )): ''}
                                                </tbody>
                                            </Table>
                                        </div>
                                        <br />
                                        <div className="table-responsive">
                                            <table className='table table-bordered' style={{ maxWidth: '300px', float: 'right' }}>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="2"><strong>Sub Total</strong></td>
                                                        <td className="text-end">{pdfData?.pending}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2"><strong>TAX/GST (12%)</strong></td>
                                                        <td className="border-0 text-end"> {152} </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="2"><strong>Total</strong></td>
                                                        <td className="border-0 text-end">{pdfData?.pending}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </CardBody>
                                <CardFooter>

                                    <div className="d-print-none">
                                        <div className="float-end">
                                            <Link
                                                to="#"
                                                onClick={printInvoice}
                                                className="btn btn-success  me-2"
                                                ><i className="fa fa-print" />
                                            </Link>
                                            <Link to="#" className="btn btn-primary w-md ">Send</Link>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

        </>
    )
}

export default Billing;