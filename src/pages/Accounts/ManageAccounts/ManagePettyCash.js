import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import { Container, Row, Col, Card, CardBody, Button, Modal } from "reactstrap"
import Datatables from 'pages/utils/table/datatable';
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import Select from "react-select"
import moment from "moment";
import { post, get } from 'helpers/api_helper' 
import { VOUCHER_URL } from 'helpers/url_helper' 

const ManagePettyCash = () => {
    const [isForm, setIsForm] = useState(false);
    const [rows, setRows] = useState({})
    const [totalValue, setTotalValue] = useState(0)
    const [voucherData, setVoucherData] = useState({
        voucherDate: moment().format('YYYY-MM-DD HH:mm'),
        voucherType: [{ value: '1', label: 'Reciept' }],
        voucherEntries: [],
        currentEntry: {
            type: { value: '1', label: 'Reciept' },
            amount: '',
            remark: ''
        }
    })

    const handleAddNewRow = () => {
        const newRow = {
            type: voucherData.currentEntry.type,
            amount: voucherData.currentEntry.amount,
            remark: voucherData.currentEntry.remark,
        };

        setVoucherData(prev => ({
            ...prev,
            voucherEntries: [...prev.voucherEntries, newRow],
            currentEntry: {
                type: { value: '1', label: 'Reciept' },
                amount: '',
                remark: ''
            }
        }));
    };

    const handleRemoveRow = (index) => {
        setVoucherData(prev => ({
            ...prev,
            voucherEntries: prev.voucherEntries?.filter((_, i) => i !== index)
        }));
    };

    const handleDelete = () => {}
    
    const handleEdit = async (data) => {
        const res = await get(`${VOUCHER_URL}/${data.id}`);
        console.log(res)
    }

    const handlePrint = () => {
        
    }

    const manageColumns = [
        { dataField: 'id', text: '#' },
        { dataField: 'datetime', text: 'Date', formatter: (cell) => moment(cell).format('YYYY-MM-DD'), },
        {
          dataField: 'receipt_type',
          text: 'Voucher Type',
          formatter: (cell, row) => row.receipt_type == 1? 'Reciept' : 'Payment'
        }, {
          dataField: 'transection_id',
          text: 'Transection Id',
          formatter: (cell, row) => row.transection_id
        }, {
          dataField: 'total_value',
          text: 'Amount',
          formatter: (cell, row) => row.total_value
        }, {
          dataField: 'transection_description',
          text: 'Description',
          formatter: (cell, row) => row.transection_description.replaceAll('_', ' ')
        }, {
          dataField: 'no_of_entries',
          text: 'No of Entries'
        }, {
            dataField: 'actions',
            text: '',
            isDummyField: true,
            formatter: function ActionButtons(cell, row) {
                return (
                    <>
                      <a href="#" className="btn btn-info btn-sm edit" onClick={() => handlePrint(row)} title="Print"><i className="bx bx-printer" /></a>
                      {' '}
                      <a href="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit"><i className="fas fa-pencil-alt" /></a>
                      {' '}
                      <a href="#" className="btn btn-danger btn-sm edit" onClick={() => handleDelete(row.id, row.status == 1 ? 0 : 1)} title={row.status == 0 ? 'Restore' : 'Delete'}><i className="fas fa-trash-alt" /></a>
                    </>
                );
            },
        }
    ]

    const handleToggle = () => {
        setIsForm(!isForm);
    };

    const handleSubmit = async () => {
        const ent = [...voucherData.voucherEntries, voucherData.currentEntry]?.map(entry => ({
                type: entry.type.value,
                amount: entry.amount,
                remark: entry.remark
        }));

        const Obj = {
            voucherDate: voucherData.voucherDate,
            voucherType: voucherData.voucherType[0].value,
            voucherEntries: ent,
            remark: voucherData.remark,
            totalValue: totalValue,
        }
        
        const { success, body } = await post(VOUCHER_URL, Obj);
        if(success){
            handleToggle();
            handleGetAllVoucher();
        }
    };

    const handleGetAllVoucher = async () => {
        const { success, body } = await get(VOUCHER_URL);
        if(success){
            setRows(body);
        }
    }

    useEffect(() => {
        handleGetAllVoucher();
    }, [])

    const handleTotalValueCalc = () => {
        const voucherDataEntries = voucherData.voucherEntries;
        const currentEntry = voucherData.currentEntry;
        let _value = 0;
        if(voucherDataEntries.length > 0) {
            let totalAmount = voucherDataEntries.reduce((total, entry) => total + parseFloat(entry.amount), 0);
            _value = parseFloat(currentEntry.amount || 0) + totalAmount ;
        } else {
            _value = currentEntry.amount || 0;
        }
        setTotalValue(_value)
    }

    useEffect(handleTotalValueCalc, [voucherData]);

    const Reciept = [
        { value: 'Cash_Recived', label: 'Cash Recived' },
    ];

    const Payment = [
        {value: "Convience_expenses", label: "Convience expenses"},
        {value: "Electricity_expenses", label: "Electricity expenses"},
        {value: "Telephone_expenses", label: "Telephone expenses"},
        {value: "Staff_welfare_expenses", label: "Staff welfare expenses"},
        {value: "Printing_Stationary", label: "Printing Stationary"},
    ];

    const voucherOptions = voucherData?.voucherType[0]?.value == 1 ? Reciept : Payment;

    const handleEntryUpdate = (index, field, value) => {
        setVoucherData(prev => ({
            ...prev,
            voucherEntries: prev.voucherEntries.map((entry, i) => 
                i === index ? { ...entry, [field]: value } : entry
            )
        }));
    };

    return (
        <React.Fragment>
            <Datatables
                isSearch={true}
                columns={manageColumns}
                showTableOnly={true}
                rowsLength={rows?.totalItems || 0}
                rows={rows.items || []}
                keyField={'id'}
                handleAddButton={handleToggle}
                title="Petty Cash"
                isAdd={true}
                isTableHead={true}
                ssr={() => { }}
            />

            {/* Start Popup Modal */}
            <Modal size="xl" isOpen={isForm} toggle={handleToggle} className="custom-modal">
                <div className="modal-header">
                    <h5 className="modal-title">Add Vaucher</h5>
                    <button type="button" className="btn-close" onClick={handleToggle}></button>
                </div>
                <div className="modal-body">
                    <Row>
                        <Col md={4}>
                            <div className="form-group">
                                <label>Appointment Date & Time</label>
                                <Flatpickr
                                    className="form-control d-block"
                                    value={voucherData.voucherDate}
                                    onChange={([date]) =>
                                        setVoucherData(prev => ({
                                            ...prev,
                                            voucherDate: date.toISOString().split("T")[0],
                                        }))
                                    }
                                    options={{
                                        altInput: true,
                                        altFormat: "F j, Y h:i K",
                                        dateFormat: "Y-m-d H:i",
                                        enableTime: true,
                                        time_24hr: false,
                                    }}
                                    placeholder="MM, DD, YYYY HH:MM"
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div>
                                <label>Voucher Type</label>
                                <Select
                                    onChange={e => setVoucherData(prev => ({
                                        ...prev,
                                        voucherType: e,
                                        currentEntry: {
                                            ...prev.currentEntry,
                                            type: e.value === '1' ? Reciept[0] : Payment[0]  // Reset entry type based on new voucher type
                                        }
                                    }))}
                                    value={ voucherData?.voucherType }
                                    classNamePrefix="select2-selection"
                                    options={[
                                        { value: '1', label: 'Reciept' },
                                        { value: '2', label: 'payment' },
                                    ]} />
                            </div>
                        </Col>
                    </Row>
                    <br />

                    {/* Display existing entries */}
                    {
                        voucherData.voucherEntries.length > 0 &&
                        voucherData.voucherEntries.map((entry, index) => (
                            <Row key={index} className="mb-2">
                                  <Col>
                                    <Select
                                        value={entry.type}
                                        classNamePrefix="select2-selection"
                                        options={voucherOptions}
                                        onChange={e => handleEntryUpdate(index, 'type', e)}
                                    />
                                </Col>
                                <Col>
                                    <input type="number" className="form-control" defaultValue={entry.amount} placeholder="Amount" onChange={e => handleEntryUpdate(index, 'amount', e)} />
                                </Col>
                                <Col>
                                    <input type="text" className="form-control" defaultValue={entry.remark} placeholder={`Paid ${voucherData?.voucherType[0]?.value === '1' ? 'By' : 'To'}`}  onChange={e => handleEntryUpdate(index, 'remark', e)} />
                                </Col>
                                <Col md={1}>
                                    <button className="btn btn-danger" onClick={() => handleRemoveRow(index)} > - </button>
                                </Col>
                            </Row>
                        ))
                    }

                    <Row className="mt-2 mb-2">
                            <Col>
                                <Select
                                    value={voucherData?.currentEntry.type}
                                    classNamePrefix="select2-selection"
                                    options={voucherOptions}
                                    onChange={e => setVoucherData(prev => ({
                                        ...prev,
                                        currentEntry: { ...prev.currentEntry, type: e }
                                    }))}
                                />
                            </Col>
                        <Col>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Amount"
                                value={voucherData?.currentEntry.amount}
                                onChange={e => setVoucherData(prev => ({
                                    ...prev,
                                    currentEntry: { ...prev.currentEntry, amount: e.target.value }
                                }))}
                            />
                        </Col>
                        <Col>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Paid ${voucherData?.voucherType[0]?.value == 1 ? 'By' : 'To'}`}
                                value={voucherData?.currentEntry.remark}
                                onChange={e => setVoucherData(prev => ({
                                    ...prev,
                                    currentEntry: { ...prev.currentEntry, remark: e.target.value }
                                }))}
                            />
                        </Col>
                        <Col md={1}>
                            <button className="btn btn-primary" onClick={handleAddNewRow}>+</button>
                        </Col>
                    </Row>

                    <Row>
                        <Col className="text-end me-5 pe-5">
                            <span>Total Entries Value <span className="ms-3" style={{fontSize: '28px', fontWeight: 800}}>{parseFloat(totalValue).toFixed(2)}</span>/-</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label>Remark</label>
                            <textarea className="form-control" rows={3} placeholder="Remark" onChange={e => setVoucherData(prev => ({
                                ...prev,
                                remark: e.target.value,
                            }))}></textarea>
                        </Col>
                    </Row>
                </div>
                <div className="modal-footer">
                    <Button color="secondary" onClick={handleToggle}>Cancel</Button>
                    <Button color="primary" onClick={handleSubmit}>Save Vaucher</Button>
                </div>
            </Modal>
            {/* END Popup Modal */}

        </React.Fragment>
    );
};

export default ManagePettyCash;