import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import { get, post, put, del } from "helpers/api_helper"
import Datatables from "pages/utils/table/datatable"
import { ManageDentalChartColumns } from "./tableColumns"
import { DENTAL_CHART_EXAMINATION_URL } from "helpers/url_helper"
import Select from "react-select"
import { dentalChartExaminationOptions } from "../../../constants/Constrant_dropdowns"
import { showSuccessAlert, showConfirmAlert } from "pages/utils/alertMessages"
import { AvForm, AvField } from "availity-reactstrap-validation"

const ManageDentalChart = () => {
  const [isForm, setIsForm] = useState(false)
  const [formData, setFormData] = useState({})
  const [rows, setRows] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    Search: "",
  })
  const [examTitles, setExamTitles] = useState([{ title: "", error: false }])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { success, body } = await get(
      `${DENTAL_CHART_EXAMINATION_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.Search}`
    )
    if (success) setRows(body)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [pagination])

  const handleToggle = () => {
    setIsForm(false)
    setFormData({})
    setExamTitles([{ title: "", error: false }])
    setEditMode(false)
    setEditingId(null)
  }

  // ➕ Add row at TOP
  const handleAddRow = () => {
    setExamTitles(prev => [{ title: "", error: false }, ...prev])
  }

  const handleRemoveRow = index => {
    setExamTitles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!formData?.toothtexamination) {
      showSuccessAlert("Please select Examination Type")
      return
    }

    // 🔍 Validate titles (row-level)
    let hasError = false
    const validated = examTitles.map(item => {
      if (!item.title.trim()) {
        hasError = true
        return { ...item, error: true }
      }
      return { ...item, error: false }
    })

    setExamTitles(validated)
    if (hasError) return

    const payload = {
      id: formData?.id || null,
      title: formData.toothtexamination.value,
      group: JSON.stringify(
        validated.map(item => ({
          tooth: "selected",
          label: item.title,
          value: item.title.replace(/ /g, "_").toLowerCase(),
        }))
      ),
    }

    const url = editMode
      ? `${DENTAL_CHART_EXAMINATION_URL}/${editingId}`
      : DENTAL_CHART_EXAMINATION_URL

    const method = editMode ? put : post
    setLoading(true)

    const { success } = await method(url, payload)

    if (success) {
      showSuccessAlert(
        editMode
          ? "Dental Chart Examination updated successfully!"
          : "Dental Chart Examination created successfully!"
      )
      handleToggle()
      fetchData()
    }

    setLoading(false)
  }

  const handleEdit = row => {
    setFormData({
      id: row.id,
      toothtexamination: dentalChartExaminationOptions.find(
        v => v.value === row.title
      ),
    })

    setExamTitles(
      JSON.parse(row.group).map(item => ({
        title: item.label,
        error: false,
      }))
    )

    setEditMode(true)
    setEditingId(row.id)
    setIsForm(true)
  }

  const handleDelete = async (id, sts) => {
    const action = sts === 1 ? "De-activate" : "Activate"

    const { isConfirmed } = await showConfirmAlert(
      `${action} Dental Chart Examination`,
      `Do you really want to ${action} this Dental Chart Examination?`,
      `Yes, ${action} it!`,
      `${action}d!`,
      `Dental Chart Examination has been ${action}d successfully.`
    )

    if (isConfirmed) {
      const { success } = await del(
        `${DENTAL_CHART_EXAMINATION_URL}/${id}?sts=${sts}`
      )
      if (success) fetchData()
    }
  }

  if (isForm) {
    return (
      <AvForm onValidSubmit={handleSubmit}>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between mb-2">
                  <h5>
                    <i
                      role="button"
                      className="me-2 fas fa-arrow-left"
                      onClick={handleToggle}
                    />
                    {editMode ? "Update" : "Create"} Tooth Examination
                  </h5>
                  <button className="btn btn-danger" onClick={handleToggle}>
                    Cancel
                  </button>
                </div>

                <Col md={6}>
                  <label>Examination Type</label>
                  <Select
                    isClearable
                    options={dentalChartExaminationOptions}
                    value={formData.toothtexamination}
                    onChange={val =>
                      setFormData(prev => ({ ...prev, toothtexamination: val }))
                    }
                  />
                </Col>

                <div className="mt-4">
                  <label>Examination Titles</label>

                  {examTitles.map((item, index) => (
                    <Row key={index} className="mb-2">
                      <Col md={1}>
                        {index === 0 ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleAddRow}
                          >
                            <i className="mdi mdi-plus" />
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <i className="mdi mdi-delete" />
                          </button>
                        )}
                      </Col>

                      <Col md={11}>
                        <AvField
                          name={`title_${index}`}
                          value={item.title}
                          placeholder="Enter Title"
                          error={item.error}
                          errorMessage="Title is required"
                          onChange={e => {
                            const value = e.target.value
                            setExamTitles(prev => {
                              const rows = [...prev]
                              rows[index] = { title: value, error: false }
                              return rows
                            })
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>

                <div className="text-end mt-3">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : editMode ? "Update" : "Submit"}
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </AvForm>
    )
  }

  return (
    <Datatables
      isSearch
      columns={ManageDentalChartColumns(
        { edit: handleEdit, delete: handleDelete },
        pagination
      )}
      rows={rows.items || []}
      rowsLength={rows?.totalItems || 0}
      rowsPerPage={pagination.limit}
      keyField="id"
      handleAddButton={() => setIsForm(true)}
      title="All Dental Charts"
      isAdd
      loading={loading}
      ssr={setPagination}
    />
  )
}

export default ManageDentalChart
