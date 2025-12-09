import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ManageBankDepositColumns } from './tableColumns';
import { BANK_DEPOSIT_URL, BANK_URL } from 'helpers/url_helper';
import { showSuccessAlert } from "pages/utils/alertMessages";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

const ManageBankDeposit = () => {
    const history = useHistory();
    const [isForm, setIsForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [banks, setBanks] = useState([]);
    const [banckSelected, setBanckSelected] = useState(null)
    const [banksOptions, setbankOptions] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        Search: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const { success, body } = await get(`${BANK_DEPOSIT_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
    };

    useEffect(() => {
        if (!isForm) {
            const fetchExtraData = async () => {
                try {
                    const bankRes = await get(BANK_URL);
                    if (bankRes.success) {
                        setBanks(bankRes.body.items);
                        const t = bankRes.body.items?.map(v => ({
                            ...v,
                            value: v.id,
                            label: v.bank_name
                        }))
                        setbankOptions(t)
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchExtraData();
        }
    }, [isForm]);

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setFormData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // console.log('Submitting formData:', formData);
        const url = editMode ? `${BANK_DEPOSIT_URL}/${editingId}` : BANK_DEPOSIT_URL;
        const res = await post(url, formData);
        if (res.success) {
            showSuccessAlert(editMode ? 'Bank Deposit updated successfully!' : 'Bank Deposit created successfully!');
            setIsForm(false);
            setEditMode(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        }
    };

    const handleEdit = (row) => {
        // console.log(row)
        setFormData({
            deposit_date: row.deposit_date,
            bank_id: row?.bank_id,
            ac_no: row?.bank?.ac_no,
            branch: row?.bank?.branch,
            account_type: row?.bank?.ac_type,
            deposit_amount: row.deposit_amount,
            deposit_type: row.deposit_type,
            reference_no: row.reference_no,
            note: row.note,
        });
        setBanckSelected(banksOptions?.filter(v => v.id == row.bank_id))
        setEditMode(true);
        setEditingId(row.id);
        setIsForm(true);
    };

    if (isForm) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="d-flex justify-content-between mb-3">
                                    <h5>
                                        <i
                                            role="button"
                                            className="me-2 fas fa-arrow-left"
                                            onClick={handleToggle}
                                        />
                                        Add Bank Deposit
                                    </h5>
                                    <button className="btn btn-danger" onClick={handleToggle}>
                                        <i className="mdi mdi-close noti-icon" /> Cancel
                                    </button>
                                </div>
                                <hr />
                                <Col md={4}>
                                    <div className="form-group mb-4">
                                        <label>Select Date</label>
                                        <Flatpickr
                                            className="form-control d-block"
                                            options={{
                                                altInput: true,
                                                dateFormat: "Y-m-d H:i",
                                            }}
                                            placeholder="MM, DD, YYYY"
                                            value={formData.deposit_date || ''}
                                            onChange={(date) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    deposit_date: date[0]?.toISOString() || ''
                                                }));
                                            }}
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div>
                                        <label className="control-label">Bank Name</label>
                                        <Select
                                            id="bank_id"
                                            className="basic-single"
                                            classNamePrefix="select"
                                            options={banksOptions}
                                            value={banckSelected}
                                            onChange={(a) => {
                                                setBanckSelected(a)
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    bank_id: a?.value,
                                                    account_number: a?.ac_no || '',
                                                    branch: a?.branch || '',
                                                    account_type: a?.ac_type || '',
                                                }));
                                            }}
                                            placeholder="Select Bank"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Account Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Account Number"
                                            name="account_number"
                                            value={formData.ac_no || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="mb-1">
                                        <label>Branch</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Branch"
                                            name="branch"
                                            value={formData.branch || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Account Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Account Type"
                                            name="account_type"
                                            value={formData.account_type || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Deposit Price</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Deposit Price"
                                            name="deposit_amount"
                                            value={formData.deposit_amount || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1">
                                        <label>Deposit Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Deposit Type"
                                            name="deposit_type"
                                            value={formData.deposit_type || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col md={4}>
                                    <div className="mb-1">
                                        <label>Transaction ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Transaction ID"
                                            name="reference_no"
                                            value={formData.reference_no || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="mb-1">
                                        <label>Notes</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Notes"
                                            name="note"
                                            value={formData.note || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col md={12}>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                                            <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

    return (
        <Datatables
            isSearch={true}
            columns={ManageBankDepositColumns(handleEdit)}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title={<><i role="button" title="go to back" className="me-2 fa fa-arrow-left" onClick={() => setSelectedSubCategory(null)} /> Bank Deposit</>}
            isAdd={true}
            isTableHead={true}
            ssr={() => { }}
        />
    );
};

export default ManageBankDeposit;
