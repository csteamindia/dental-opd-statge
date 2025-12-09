import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { USER_URL, ROLES_URL } from 'helpers/url_helper';
import Select from 'react-select'
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from 'react-router-dom';
import cookieHelper from 'helpers/getCookieData';

const ManageUsers = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [roleSelected, setRoleSelected] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${USER_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
            setLoading(false);
        }
    }
    
    const fetchRoles = async () => {
        const { success, body } = await get(`${ROLES_URL}/options?_type=role`);
        if (success) {
            setRoleOptions(body);
        }
    }

    useEffect(()=>{
        fetchData(),
        fetchRoles()
    }, [pagination]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // console.log('Submitting formData:', formData);
        const url = editMode ? `${USER_URL}/${editingId}` : USER_URL;
        const method = editMode ? put : post;

        const { success, body } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'User updated successfully!' : 'User created successfully!');
            setEditMode(false);
            setEditingId(null);
            fetchData();
            setFormData(null);
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the input field.");
    };

    const handleEdit = (row) => {
        setFormData(row);
        setEditingId(row.id);
        setEditMode(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} User`, `Do you really want to ${action} this User?`,
            `Yes, ${action} it!`, `${action}d!`, `User has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${USER_URL}/${id}?sts=${sts}`);
            if (success) {
                fetchData();
            }
        }
    };

    const tableColumns = [
        { dataField: 'user_id', text: '#', formatter: (cell, row, rowIndex) => (pagination?.page - 1) * pagination?.limit + (rowIndex + 1)   },
        { dataField: 'name', text: 'Name' },
        { dataField: 'email', text: 'Email' },
        { dataField: 'mobile', text: 'Mobile' },
        { dataField: 'user_role.name', text: 'Role' },
        {
            dataField: 'actions', text: '', isDummyField: true,
            formatter: (cell, row) => <>
            <Link to="#" className="btn btn-primary btn-sm edit" onClick={() => handleEdit(row)} title="Edit" > <i className="fas fa-pencil-alt" /> </Link>
            {/* <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm edit`} onClick={() => handleDelete(row.user_id, row.status === 1 ? 0 : 1, row.code)} title={row.status === 0 ? 'Delete' : 'Restore'} > <i className={`fas ${row.status == 0 ? 'fa-trash-alt' : 'fa-check'}`} /> </Link> */}
            </>
        }
    ];

    return (
        <>
            <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData} >
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5> <i role="button" className="me-2 fas fa-arrow-left" /> Create User </h5>
                                </div>
                                <hr />
                                <Row>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="name" label="Full Name" type="text" placeholder="Enter Full Name" value={formData?.name} onChange={handleChange} required errorMessage="Please enter Full Name" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="mobile" label="Contact Number" type="text" placeholder="Enter Contact Number" value={formData?.mobile} onChange={handleChange} required errorMessage="Please enter Contact Number" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="mb-2">
                                            <AvField name="email" label="Email Address" type="text" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required errorMessage="Please enter Email Address" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <label>Role</label>
                                        <Select className="basic-single" classNamePrefix="select" name="role" isClearable={true}
                                            options={roleOptions}
                                            // options={[{ value: "Admin", label: "Admin" }, { value: "Doctor", label: "Doctor" }, { value: "Receptionist", label: "Receptionist" }]}
                                            value={roleSelected}
                                            onChange={(selected) => {
                                                setFormData((prev) => ({ ...prev, role: selected ? selected.value : "", roleName: selected })) 
                                                setRoleSelected(selected) 
                                            }}
                                            placeholder="Select Role" />
                                    </Col>
                                    <Col md={1} className='mt-1'>
                                        <div className="d-flex justify-content-end mt-3 mb-1">
                                            <button className="btn btn-primary" type="submit" disabled={loading}> {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> Submit </>} </button>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </AvForm>

            {/* List Bootstrap Table  */}
            <Datatables
                isSearch={true}
                columns={tableColumns}
                showTableOnly={true}
                rowsLength={rows?.totalItems || 0}
                rows={rows?.items || []}
                keyField={'id'}
                title="All User's"
                isAdd={true}
                isTableHead={true}
                loading={loading}
                ssr={setPagination}
            />
        </>
    );
}

export default ManageUsers;
