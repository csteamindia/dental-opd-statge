import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { get, post, put, del } from 'helpers/api_helper';
import Datatables from 'pages/utils/table/datatable';
import { ROLES_URL } from 'helpers/url_helper';
import cookieHelper from 'helpers/getCookieData';
import { Link } from 'react-router-dom';
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages";
import { AvForm, AvField } from 'availity-reactstrap-validation';

const UserRoleAccess = () => {
    const clinic = cookieHelper.getCookie('_c') ? JSON.parse(atob(cookieHelper.getCookie('_c'))) : null;

    const [isForm, setIsForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [rows, setRows] = useState([]);
    const [permissionData, setPermissionData] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, Search: '' });

    const fetchData = async () => {
        setLoading(true);
        const { success, body } = await get(`${ROLES_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`);
        if (success) {
            setRows(body);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (clinic) {
            setFormData(prev => ({
                ...prev,
                clinic_id: clinic.id
            }));
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination]);

    const handleToggle = () => {
        setIsForm(!isForm);
        setEditMode(false);
        setEditingId(null);
        setFormData({});
        setPermissionData(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const url = editMode ? `${ROLES_URL}/${editingId}` : ROLES_URL;
        const method = editMode ? put : post;

        const { success } = await method(url, formData);

        if (success) {
            showSuccessAlert(editMode ? 'Role updated successfully!' : 'Role created successfully!');
            handleToggle();
            fetchData();
            setIsForm(false);
            setFormData({});
            setEditMode(false);
            setEditingId(null);
        }
    };

    const handleInvalidSubmit = () => {
        alert("Please enter the input field.");
    };

    const handleEdit = (row) => {
        setFormData(row);
        setEditingId(row.role_id);
        setEditMode(true);
        setIsForm(true);
    };

    const handleDelete = async (id, sts) => {
        const action = sts === 1 ? 'De-activate' : 'Activate';

        const { isConfirmed } = await showConfirmAlert(`${action} Role`, `Do you really want to ${action} this Role?`,
            `Yes, ${action} it!`, `${action}d!`, `Role has been ${action}d successfully.`);

        if (isConfirmed) {
            const { success } = await del(`${ROLES_URL}/${id}?sts=${sts}`);
            if (success) {
                fetchData();
            }
        }
    };

    const handlePrevilizes = async (rowId) => {
        const { success, body } = await get(`permissions?isconfig=1&clinic_id=${clinic?.id}&role_id=${rowId}`);
        if (success) {
            const convertedArray = Object.entries(body?.modules).map(([name, perms]) => ({
                name,
                ...perms,
            }));
            setPermissionData(convertedArray);
        }
    };

    const updatePermission = async (data) => {
        const obj = {
            client_id: 1,
            role_id: 1,
            clinic_id: 1,
            ...data
        };
        // console.log(obj);
    };

    const ManageRoleColumns = [
        { dataField: 'role_id', text: '#' },
        { dataField: 'name', text: 'Role' },
        { dataField: 'description', text: 'Description' },
        { dataField: 'actions', text: '', isDummyField: true,
            formatter: (cell, row) => row.client_id ? <div className="d-flex gap-2">
                <Link to="#" className="btn btn-warning btn-sm" onClick={() => handlePrevilizes(row.role_id)} title="Set Privileges">
                    <i className="fas fa-table" />
                </Link>
                <Link to="#" className="btn btn-primary btn-sm" onClick={() => handleEdit(row)} title="Edit">
                    <i className="fas fa-pencil-alt" />
                </Link>
                <Link to="#" className={`btn btn-${row.status === 0 ? 'danger' : 'success'} btn-sm`} onClick={() => handleDelete(row.role_id, row.status === 1 ? 0 : 1)} title={row.status === 0 ? 'Delete' : 'Restore'}>
                    <i className={`fas ${row.status === 0 ? 'fa-trash-alt' : 'fa-check'}`} />
                </Link>
            </div>:''
        }
    ];

    if (isForm) {
        return (
            <AvForm onValidSubmit={handleSubmit} onInvalidSubmit={handleInvalidSubmit} model={formData}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody>
                                <Row>
                                    <div className="d-flex justify-content-between mb-2">
                                        <h5><i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> {editMode ? 'Edit Role' : 'Create Role'} </h5>
                                        <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel</button>
                                    </div>
                                    <hr />
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="name" label="Role" type="text" placeholder="Enter Role" onChange={handleChange} required errorMessage="Please enter Role" />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="mb-2">
                                            <AvField name="description" label="Description" type="text" placeholder="Enter Description" onChange={handleChange} required errorMessage="Please enter Description" />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end mt-3 mb-1">
                                            <button className="btn btn-primary" type="submit" disabled={loading}> {loading ? 'Processing...' : <> <i className="mdi mdi-plus" /> {editMode ? 'Update' : 'Submit'} </>} </button>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </AvForm>
        );
    }

    if (permissionData) {
        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <div className="d-flex justify-content-between mb-2">
                                    <h5><i role="button" className="me-2 fas fa-arrow-left" onClick={handleToggle} /> User Permissions Update</h5>
                                    <button className="btn btn-danger" onClick={handleToggle}><i className="mdi mdi-close noti-icon" /> Cancel</button>
                                </div>
                                <hr />
                                <Col>
                                    <table className='table table-bordered'>
                                        <thead>
                                            <tr>
                                                <th>Module</th>
                                                {
                                                    ["is_accessable", "is_readable", "is_creatable", "is_writable", "is_deletable"].map((field, i) => (
                                                        <th key={`head_${i}`}>
                                                            {field.replace("is_", "").toUpperCase()}
                                                        </th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                permissionData.map((item, i) => (
                                                    <tr key={`perm_${i}`}>
                                                        <td>{item.name}</td>
                                                        {["is_accessable", "is_readable", "is_creatable", "is_writable", "is_deletable"].map((field) => (
                                                            <td key={`${field}_${i}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item[field]}
                                                                    disabled={field !== "is_accessable" && !item.is_accessable}
                                                                    onChange={async (e) => {
                                                                        const updated = [...permissionData];
                                                                        updated[i][field] = e.target.checked;

                                                                        if (field !== 'is_accessable' && e.target.checked) {
                                                                            updated[i].is_accessable = true;
                                                                        }
                                                                        if (field === 'is_accessable' && !e.target.checked) {
                                                                            updated[i].is_readable = false;
                                                                            updated[i].is_creatable = false;
                                                                            updated[i].is_writable = false;
                                                                            updated[i].is_deletable = false;
                                                                        }

                                                                        setPermissionData(updated);
                                                                        await updatePermission(updated[i]);
                                                                    }}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
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
            columns={ManageRoleColumns}
            showTableOnly={true}
            rowsLength={rows?.totalItems || 0}
            rows={rows.items || []}
            keyField={'id'}
            handleAddButton={handleToggle}
            title="All Role's"
            isAdd={true}
            isTableHead={true}
            loading={loading}
            ssr={setPagination}
        />
    );
};

export default UserRoleAccess;
