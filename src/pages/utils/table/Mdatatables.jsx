import { MaterialReactTable } from 'material-react-table';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, CardTitle, Row } from "reactstrap";

const Datatable = ({columns, totalrows= 0, data, title, handleEdit, handleRemove, isEdit, handleAddButton, loading, Other = null, btnloading= false, userModules, enableRowAction = false}) => {
    const [btnid, setBtnid] = useState();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        if(pagination.pageIndex > 0) {
            pagination.pageIndex = pagination.pageIndex+1 
            Other?.callbackPagination(pagination)
        }
    }, [pagination])

    if(totalrows == 0){
        return (
            <MaterialReactTable
                columns={columns}
                data={[]}
                initialState={{
                    enableFullScreenToggle: false,
                    columnVisibility: { 'id': false }
                }}
                enableColumnResizing
                enableDensityToggle={false}
                enableHiding={false}
                renderTopToolbarCustomActions={() => {
                    return <div>
                        <CardTitle className="h2" style={{ marginTop: "10px" }}>{title}</CardTitle>
                        {
                            userModules?.add && <Button
                                    color="primary"
                                    style={{ position: 'absolute', right: '10px', top: '12px' }}
                                    onClick={handleAddButton}
                                > <i className={`fas fa-plus`}>{" "} Add</i> </Button>
                        }
                    </div>
                }}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        size: 160
                    }
                }}
            />
        )
    }

    return (
        <Row>
            <MaterialReactTable
                columns={columns}
                data={data}
                initialState={{
                    enableFullScreenToggle: false,
                    columnVisibility: { 'id': false }
                }}
                enableColumnResizing
                enableDensityToggle={false}
                enableHiding={false}
                state={{
                    // expanded: true,
                    isLoading: loading,
                    pagination
                    // pagination: { pagination.pageIndex, pagination.pageSize } 
                }}
                renderTopToolbarCustomActions={() => {
                    return <div>
                        <CardTitle className="h2" style={{ marginTop: "10px" }}>{title}</CardTitle>
                        {
                            userModules?.add && <Button
                                    color="primary"
                                    style={{ position: 'absolute', right: 0, top: '12px' }}
                                    onClick={handleAddButton}
                                > <i className={`fas fa-plus`}>{" "} Add</i> </Button>
                        }
                    </div>
                }}
                enableRowNumbers
                positionActionsColumn="last"
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        size: 160
                    }
                }}
                enableRowActions={enableRowAction}
                renderRowActions={({row}) =>(
                    <>
                        {
                            !userModules?.isBlocking && userModules?.cub && 
                            <>
                                <Link
                                to="#"
                                className={`btn ${row.original.status == 2 ? "btn-danger" : "btn-success"} btn-sm`}
                                onClick={() => Other?.handleStatus(row.original.id, row.original.status == 2 ? 0 : 2)} 
                                title={row.original.status == 2 ? "Un-Block" : "Block"} >
                                    <i className={`fas ${Other?.isBlocking === row.original.id ? 'fa-spinner fa-spin' : `${row.original.status == 2 ? "fa-lock" : "fa-unlock"}`}`} />
                                </Link>{" "}
                            </>
                        }
                        {
                            userModules?.addressShare && 
                            <>
                                <Link
                                to="#"
                                className={`btn btn-success btn-sm`}
                                onClick={() => Other?.addressShare(row.original)} 
                                title={"Share Address"} >
                                    <i className={`fas fa-share-alt`} />
                                </Link>{" "}
                            </>
                        }
                        {
                            userModules?.isBlocking && userModules?.cub && 
                            <>
                                <Link
                                to="#"
                                className={`btn ${row.status == 2 ? "btn-danger" : "btn-success"} btn-sm`}
                                onClick={() => Other?.handleStatus(row.original.id, row.original.status == 2 ? 0 : 2)}
                                title="Un-block" >
                                    <i className={`fas ${Other.isBlocking === row.original.id ? 'fa-spinner fa-spin' : `${row.status == 2 ? "fa-lock" : "fa-unlock"}`}`} />
                                </Link>{" "}
                            </>
                        }
                        {
                            userModules?.pd &&
                            <>
                                <Link
                                to="#"
                                className="btn btn-primary btn-sm"
                                onClick={() => Other?.handleEditProduct(row.original.code)} 
                                title="Products" >
                                    <i className={`fas ${Other?.isProduct === row.original.id ? 'fa-spinner fa-spin' : 'fa-table'}`} />
                                </Link>{" "}   
                            </>
                        }
                        {
                            userModules?.edit && 
                            <Link
                                to="#"
                                className="btn btn-outline-secondary btn-sm edit"
                                onClick={() => handleEdit(row.original.id)}
                                title="Edit" >
                                <i className={`fas ${isEdit == row.original.id ? 'fa-spinner fa-spin' : 'fa-pencil-alt'}`} />
                            </Link>
                        }
                        {
                            userModules?.delete && 
                            <>
                                {" "} <Link
                                    to="#"
                                    className={`btn btn-${row.original.status == 0 ? "danger" : "success"} btn-sm edit`}
                                    onClick={() => handleRemove(row.original.id, row.original.status == 1 ? 0 : 1, row.original.code)}
                                    title={row.original.status == 0 ? 'delete' : 'restore'} >
                                    <i className={`fas fas fa-trash-alt`} />
                                </Link>
                            </>
                        }

                        {
                            userModules?.callback && 
                            <>
                                {" "} <Link
                                    to="#"
                                    className={`btn btn-success btn-sm`}
                                    onClick={() => userModules?.callback(row.original)}
                                    title={`view ${ userModules?.istype == 'orderform' ? 'Orderform': 'Challan'}`} >
                                    <i className={`fas fa-file-pdf`} />
                                </Link>
                            </>
                        }

                        {
                            userModules?.pdf &&
                            <>
                                <Link
                                    to="#"
                                    className={`btn btn-outline-primary btn-sm`}
                                    title={"Print Invoice"}
                                    onClick={() =>{
                                        Other?.callback(row.original)
                                        setBtnid(row.original.id)
                                    }} >
                                    <i className={`${(row.original.id == btnid && btnloading) ? 'fa fa-spinner fa-spin':'fas fa-file-pdf'}`} />
                                </Link>

                                {
                                    Other?.isInvoice && (
                                        <>
                                            {" "}
                                            <Link
                                                to="#"
                                                title={"Send Invoice to Client"}
                                                className={`btn btn-outline-success ${row.original.status == 1 ? " disabled": ''} btn-sm`}
                                                onClick={() =>{
                                                    Other?.sendMsg(row.original)
                                                    setBtnid(row.original.id)
                                                }} >
                                                <i className={`fab fa-whatsapp fa-1x`} />
                                            </Link>
                                            {/* {" "}
                                            <Link
                                                to="#"
                                                title={"Cancel invoice"}
                                                className={`btn btn-outline-danger ${row.original.status == 1 ? " disabled": ''} btn-sm`}
                                                onClick={() =>{
                                                    Other?.cancelinvoice(row.original.invoice_number)
                                                    setBtnid(row.original.id)
                                                }} >
                                                <i className={`${(row.original.id == btnid && btnloading) ? 'fa fa-spinner fa-spin':'fas fa-trash'}`} />
                                            </Link> */}
                                        </>
                                )}
                                {
                                    (Other?.isInvoice && row?.original?.is_lock == 0) ? (
                                        <>
                                            {" "}
                                            <Link
                                                to="#"
                                                title={"Convert to invoice"}
                                                className={`btn btn-outline-danger ${row.original.status == 1 ? " disabled": ''} btn-sm`}
                                                onClick={() =>{
                                                    Other?.convertInvoice(row.original)
                                                    setBtnid(row.original.id)
                                                }} >
                                                <i className={`${(row.original.id == btnid && btnloading) ? 'fa fa-spinner fa-spin':'fas fa-arrow-right'}`} />
                                            </Link>
                                        </>
                                    ): (
                                        row?.original?.is_lock && Other?.isProforma == 'Proforma' &&
                                        <>
                                            {" "}
                                            <Link
                                                target="_blank"
                                                to={`/invoice/print?invoice_number=${row.original.final_invoice}`}
                                                title={"View invoice"}
                                                className={`btn btn-outline-success btn-sm`} >
                                                <i className={`fas fa-eye`} />
                                            </Link>
                                        </>
                                    )
                            }
                            </>
                        }
                    </>
                )}
                rowCount={totalrows}
                manualPagination
                onPaginationChange={setPagination}
            />
        </Row>
    )
}

export default Datatable