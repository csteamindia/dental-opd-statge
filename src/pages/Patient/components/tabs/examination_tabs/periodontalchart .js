import React, { useState, useEffect } from "react"
import { Row, Col, Card, CardBody, Table } from "reactstrap"
import toothImages from "../../../../../assets/tooth-image"
import { post, get, del } from "helpers/api_helper"
import { PATIENT_URL } from "helpers/url_helper"
import Select from "react-select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Datatables from "pages/utils/table/datatable"
import {
  upperRight,
  upperLeft,
  lowerLeft,
  lowerRight,
} from "../../../../../constants/Constrant_dropdowns"
import { showConfirmAlert } from "../../../../utils/alertMessages"
import { getZoneDateTime } from "pages/utils/timezone"

const renderTeethRow = (teeth, isUpper) =>
  teeth.map(tooth => (
    <td key={tooth} className="text-center">
      <strong>{tooth}</strong>
      <div>
        {isUpper ? (
          <>
            <img
              src={toothImages[`${tooth}_tooth_upper`]}
              alt={`Tooth ${tooth}`}
              className="img-fluid"
              style={{ width: "26px" }}
            />
          </>
        ) : (
          <>
            <img
              src={toothImages[`${tooth}_lower_tooth`]}
              alt={`Tooth ${tooth}`}
              className="img-fluid"
              style={{ width: "26px" }}
            />
          </>
        )}
      </div>
    </td>
  ))

const tChart = {
  date: getZoneDateTime().format("YYYY-MM-DD"),
  doctor_id: [],
  patient_id: "",
  upper: {
    buccal: {
      Mobility: {
        type: "text",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15, value: 0 },
          { tooth: 14, value: 0 },
          { tooth: 13, value: 0 },
          { tooth: 12, value: 0 },
          { tooth: 11, value: 0 },
          { tooth: 21, value: 0 },
          { tooth: 22, value: 0 },
          { tooth: 23, value: 0 },
          { tooth: 24, value: 0 },
          { tooth: 25, value: 0 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
      Implant: {
        type: "click",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15, value: 0 },
          { tooth: 14, value: 0 },
          { tooth: 13, value: 0 },
          { tooth: 12, value: 0 },
          { tooth: 11, value: 0 },
          { tooth: 21, value: 0 },
          { tooth: 22, value: 0 },
          { tooth: 23, value: 0 },
          { tooth: 24, value: 0 },
          { tooth: 25, value: 0 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
      Furcation: {
        type: "click",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15 },
          { tooth: 14 },
          { tooth: 13 },
          { tooth: 12 },
          { tooth: 11 },
          { tooth: 21 },
          { tooth: 22 },
          { tooth: 23 },
          { tooth: 24 },
          { tooth: 25 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
      Bleeding_on_probing: {
        type: "multiclick",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Plaque: {
        type: "multiclick",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Probing_Depth: {
        type: "text",
        data: [
          { tooth: 18, value: 0, value2: 0, value3: 0 },
          { tooth: 17, value: 0, value2: 0, value3: 0 },
          { tooth: 16, value: 0, value2: 0, value3: 0 },
          { tooth: 15, value: 0, value2: 0, value3: 0 },
          { tooth: 14, value: 0, value2: 0, value3: 0 },
          { tooth: 13, value: 0, value2: 0, value3: 0 },
          { tooth: 12, value: 0, value2: 0, value3: 0 },
          { tooth: 11, value: 0, value2: 0, value3: 0 },
          { tooth: 21, value: 0, value2: 0, value3: 0 },
          { tooth: 22, value: 0, value2: 0, value3: 0 },
          { tooth: 23, value: 0, value2: 0, value3: 0 },
          { tooth: 24, value: 0, value2: 0, value3: 0 },
          { tooth: 25, value: 0, value2: 0, value3: 0 },
          { tooth: 26, value: 0, value2: 0, value3: 0 },
          { tooth: 27, value: 0, value2: 0, value3: 0 },
          { tooth: 28, value: 0, value2: 0, value3: 0 },
        ],
      },
      Gingival_Margin: {
        type: "text",
        data: [
          { tooth: 18, value: 0, value2: 0, value3: 0 },
          { tooth: 17, value: 0, value2: 0, value3: 0 },
          { tooth: 16, value: 0, value2: 0, value3: 0 },
          { tooth: 15, value: 0, value2: 0, value3: 0 },
          { tooth: 14, value: 0, value2: 0, value3: 0 },
          { tooth: 13, value: 0, value2: 0, value3: 0 },
          { tooth: 12, value: 0, value2: 0, value3: 0 },
          { tooth: 11, value: 0, value2: 0, value3: 0 },
          { tooth: 21, value: 0, value2: 0, value3: 0 },
          { tooth: 22, value: 0, value2: 0, value3: 0 },
          { tooth: 23, value: 0, value2: 0, value3: 0 },
          { tooth: 24, value: 0, value2: 0, value3: 0 },
          { tooth: 25, value: 0, value2: 0, value3: 0 },
          { tooth: 26, value: 0, value2: 0, value3: 0 },
          { tooth: 27, value: 0, value2: 0, value3: 0 },
          { tooth: 28, value: 0, value2: 0, value3: 0 },
        ],
      },
    },
    lingual: {
      Gingival_Margin: {
        type: "text",
        data: [
          { tooth: 18, value: 0, value2: 0, value3: 0 },
          { tooth: 17, value: 0, value2: 0, value3: 0 },
          { tooth: 16, value: 0, value2: 0, value3: 0 },
          { tooth: 15, value: 0, value2: 0, value3: 0 },
          { tooth: 14, value: 0, value2: 0, value3: 0 },
          { tooth: 13, value: 0, value2: 0, value3: 0 },
          { tooth: 12, value: 0, value2: 0, value3: 0 },
          { tooth: 11, value: 0, value2: 0, value3: 0 },
          { tooth: 21, value: 0, value2: 0, value3: 0 },
          { tooth: 22, value: 0, value2: 0, value3: 0 },
          { tooth: 23, value: 0, value2: 0, value3: 0 },
          { tooth: 24, value: 0, value2: 0, value3: 0 },
          { tooth: 25, value: 0, value2: 0, value3: 0 },
          { tooth: 26, value: 0, value2: 0, value3: 0 },
          { tooth: 27, value: 0, value2: 0, value3: 0 },
          { tooth: 28, value: 0, value2: 0, value3: 0 },
        ],
      },
      Probing_Depth: {
        type: "text",
        data: [
          { tooth: 18, value: 0, value2: 0, value3: 0 },
          { tooth: 17, value: 0, value2: 0, value3: 0 },
          { tooth: 16, value: 0, value2: 0, value3: 0 },
          { tooth: 15, value: 0, value2: 0, value3: 0 },
          { tooth: 14, value: 0, value2: 0, value3: 0 },
          { tooth: 13, value: 0, value2: 0, value3: 0 },
          { tooth: 12, value: 0, value2: 0, value3: 0 },
          { tooth: 11, value: 0, value2: 0, value3: 0 },
          { tooth: 21, value: 0, value2: 0, value3: 0 },
          { tooth: 22, value: 0, value2: 0, value3: 0 },
          { tooth: 23, value: 0, value2: 0, value3: 0 },
          { tooth: 24, value: 0, value2: 0, value3: 0 },
          { tooth: 25, value: 0, value2: 0, value3: 0 },
          { tooth: 26, value: 0, value2: 0, value3: 0 },
          { tooth: 27, value: 0, value2: 0, value3: 0 },
          { tooth: 28, value: 0, value2: 0, value3: 0 },
        ],
      },
      Plaque: {
        type: "multiclick",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Bleeding_on_probing: {
        type: "multiclick",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Furcation: {
        type: "multiclick",
        data: [
          { tooth: 18, value1: 0, value2: 0 },
          { tooth: 17, value1: 0, value2: 0 },
          { tooth: 16, value1: 0, value2: 0 },
          { tooth: 15 },
          { tooth: 14, value1: 0, value2: 0 },
          { tooth: 13 },
          { tooth: 12 },
          { tooth: 11 },
          { tooth: 21 },
          { tooth: 22 },
          { tooth: 23 },
          { tooth: 24, value1: 0, value2: 0 },
          { tooth: 25 },
          { tooth: 26, value1: 0, value2: 0 },
          { tooth: 27, value1: 0, value2: 0 },
          { tooth: 28, value1: 0, value2: 0 },
        ],
      },
      Note: {
        type: "text",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15, value: 0 },
          { tooth: 14, value: 0 },
          { tooth: 13, value: 0 },
          { tooth: 12, value: 0 },
          { tooth: 11, value: 0 },
          { tooth: 21, value: 0 },
          { tooth: 22, value: 0 },
          { tooth: 23, value: 0 },
          { tooth: 24, value: 0 },
          { tooth: 25, value: 0 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
    },
  },
  lower: {
    buccal: {
      Gingival_Margin: {
        type: "text",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Probing_Depth: {
        type: "text",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Plaque: {
        type: "click",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Bleeding_on_probing: {
        type: "click",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Furcation: {
        type: "click",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15 },
          { tooth: 14 },
          { tooth: 13 },
          { tooth: 12 },
          { tooth: 11 },
          { tooth: 21 },
          { tooth: 22 },
          { tooth: 23 },
          { tooth: 24 },
          { tooth: 25 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
      Implant: {
        type: "click",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15, value: 0 },
          { tooth: 14, value: 0 },
          { tooth: 13, value: 0 },
          { tooth: 12, value: 0 },
          { tooth: 11, value: 0 },
          { tooth: 21, value: 0 },
          { tooth: 22, value: 0 },
          { tooth: 23, value: 0 },
          { tooth: 24, value: 0 },
          { tooth: 25, value: 0 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
      Mobility: {
        type: "text",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15, value: 0 },
          { tooth: 14, value: 0 },
          { tooth: 13, value: 0 },
          { tooth: 12, value: 0 },
          { tooth: 11, value: 0 },
          { tooth: 21, value: 0 },
          { tooth: 22, value: 0 },
          { tooth: 23, value: 0 },
          { tooth: 24, value: 0 },
          { tooth: 25, value: 0 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
    },
    lingual: {
      Note: {
        type: "text",
        data: [
          { tooth: 18, value: 0 },
          { tooth: 17, value: 0 },
          { tooth: 16, value: 0 },
          { tooth: 15, value: 0 },
          { tooth: 14, value: 0 },
          { tooth: 13, value: 0 },
          { tooth: 12, value: 0 },
          { tooth: 11, value: 0 },
          { tooth: 21, value: 0 },
          { tooth: 22, value: 0 },
          { tooth: 23, value: 0 },
          { tooth: 24, value: 0 },
          { tooth: 25, value: 0 },
          { tooth: 26, value: 0 },
          { tooth: 27, value: 0 },
          { tooth: 28, value: 0 },
        ],
      },
      Furcation: {
        type: "multiclick",
        data: [
          { tooth: 18, value1: 0, value2: 0 },
          { tooth: 17, value1: 0, value2: 0 },
          { tooth: 16, value1: 0, value2: 0 },
          { tooth: 15 },
          { tooth: 14, value1: 0, value2: 0 },
          { tooth: 13 },
          { tooth: 12 },
          { tooth: 11 },
          { tooth: 21 },
          { tooth: 22 },
          { tooth: 23 },
          { tooth: 24, value1: 0, value2: 0 },
          { tooth: 25 },
          { tooth: 26, value1: 0, value2: 0 },
          { tooth: 27, value1: 0, value2: 0 },
          { tooth: 28, value1: 0, value2: 0 },
        ],
      },
      Bleeding_on_probing: {
        type: "click",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Plaque: {
        type: "click",
        data: [
          { tooth: 18, value1: 0, value2: 0, value3: 0 },
          { tooth: 17, value1: 0, value2: 0, value3: 0 },
          { tooth: 16, value1: 0, value2: 0, value3: 0 },
          { tooth: 15, value1: 0, value2: 0, value3: 0 },
          { tooth: 14, value1: 0, value2: 0, value3: 0 },
          { tooth: 13, value1: 0, value2: 0, value3: 0 },
          { tooth: 12, value1: 0, value2: 0, value3: 0 },
          { tooth: 11, value1: 0, value2: 0, value3: 0 },
          { tooth: 21, value1: 0, value2: 0, value3: 0 },
          { tooth: 22, value1: 0, value2: 0, value3: 0 },
          { tooth: 23, value1: 0, value2: 0, value3: 0 },
          { tooth: 24, value1: 0, value2: 0, value3: 0 },
          { tooth: 25, value1: 0, value2: 0, value3: 0 },
          { tooth: 26, value1: 0, value2: 0, value3: 0 },
          { tooth: 27, value1: 0, value2: 0, value3: 0 },
          { tooth: 28, value1: 0, value2: 0, value3: 0 },
        ],
      },
      Probing_Depth: {
        type: "text",
        data: [
          { tooth: 18, value: 0, value2: 0, value3: 0 },
          { tooth: 17, value: 0, value2: 0, value3: 0 },
          { tooth: 16, value: 0, value2: 0, value3: 0 },
          { tooth: 15, value: 0, value2: 0, value3: 0 },
          { tooth: 14, value: 0, value2: 0, value3: 0 },
          { tooth: 13, value: 0, value2: 0, value3: 0 },
          { tooth: 12, value: 0, value2: 0, value3: 0 },
          { tooth: 11, value: 0, value2: 0, value3: 0 },
          { tooth: 21, value: 0, value2: 0, value3: 0 },
          { tooth: 22, value: 0, value2: 0, value3: 0 },
          { tooth: 23, value: 0, value2: 0, value3: 0 },
          { tooth: 24, value: 0, value2: 0, value3: 0 },
          { tooth: 25, value: 0, value2: 0, value3: 0 },
          { tooth: 26, value: 0, value2: 0, value3: 0 },
          { tooth: 27, value: 0, value2: 0, value3: 0 },
          { tooth: 28, value: 0, value2: 0, value3: 0 },
        ],
      },
      Gingival_Margin: {
        type: "text",
        data: [
          { tooth: 18, value: 0, value2: 0, value3: 0 },
          { tooth: 17, value: 0, value2: 0, value3: 0 },
          { tooth: 16, value: 0, value2: 0, value3: 0 },
          { tooth: 15, value: 0, value2: 0, value3: 0 },
          { tooth: 14, value: 0, value2: 0, value3: 0 },
          { tooth: 13, value: 0, value2: 0, value3: 0 },
          { tooth: 12, value: 0, value2: 0, value3: 0 },
          { tooth: 11, value: 0, value2: 0, value3: 0 },
          { tooth: 21, value: 0, value2: 0, value3: 0 },
          { tooth: 22, value: 0, value2: 0, value3: 0 },
          { tooth: 23, value: 0, value2: 0, value3: 0 },
          { tooth: 24, value: 0, value2: 0, value3: 0 },
          { tooth: 25, value: 0, value2: 0, value3: 0 },
          { tooth: 26, value: 0, value2: 0, value3: 0 },
          { tooth: 27, value: 0, value2: 0, value3: 0 },
          { tooth: 28, value: 0, value2: 0, value3: 0 },
        ],
      },
    },
  },
}

const PeriodontalChart = ({ patientData, callback, isform }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rowData, setRowData] = useState([])
  const [doctorsOptions, setDoctorsOptions] = useState([])
  const [chart, setChart] = useState(tChart)

  const handleMultiClick = (
    type1,
    type2,
    category,
    tooth,
    valueKey,
    _value = 0
  ) => {
    const newChart = { ...chart }
    const toothIndex = newChart[type1][type2][category]?.data?.findIndex(
      v => v?.tooth === tooth
    )

    if (toothIndex !== -1) {
      const currentValue =
        newChart?.[type1][type2][category].data[toothIndex][valueKey] || 0

      if (_value > 0) {
        newChart[type1][type2][category].data[toothIndex][valueKey] = _value
      } else {
        newChart[type1][type2][category].data[toothIndex][valueKey] =
          currentValue === 1 ? 0 : 1
      }
      setChart(newChart)
      // console.log("Updated index:", toothIndex);
    } else {
      // console.warn("Tooth not found:", tooth);
    }
  }

  const fatchDocs = async () => {
    const { success, body } = await get(
      `${PATIENT_URL}/options?_type=doctors&optionType=1`
    )
    if (success) {
      setDoctorsOptions(body)
      // const doc = body.filter(v => v.isSelected == true)
      // setChart(p => ({...p, doctor_id: doc}))
    }
  }

  const fetchChartData = async () => {
    const { success, body } = await get(
      `dentalchart/periodicalchart?patient_id=${patientData?.id}`
    )
    if (success) {
      setRowData(body)
    }
  }

  useEffect(() => {
    fatchDocs()
    setChart({
      ...tChart,
      patient_id: patientData?.id,
      date: getZoneDateTime().format("YYYY-MM-DD"),
      doctor_id: patientData?.doctor,
    })
    fetchChartData()
  }, [])

  const handleSave = async () => {
    const { success } = await post("dentalchart/periodicalchart", chart)
    if (success) {
      fetchChartData()
      handleCallback()
    }
  }

  const handleToggle = () => {
    setChart({
      ...tChart,
      patient_id: patientData?.id,
      date: getZoneDateTime().format("YYYY-MM-DD"),
      doctor_id: patientData?.doctor,
    })
    setIsFormOpen(!isFormOpen)
    isform()
  }

  const handleCallback = () => {
    setIsFormOpen(!isFormOpen)
    setChart({
      ...tChart,
      patient_id: patientData.id,
      date: getZoneDateTime().format("YYYY-MM-DD"),
      doctor_id: patientData?.doctor,
    })
    callback()
  }

  const handleViewChart = row => {
    // const selectedDoctor = doctorsOptions?.filter(v => v.value == row?.doctor_id);
    // console.log(selectedDoctor, row?.doctor_id)
    const a = {
      id: row?.id,
      patient_id: row?.patient_id,
      date: row?.date,
      doctor_id: row?.doctor_id || null,
      lower: JSON.parse(row?.lower),
      upper: JSON.parse(row?.upper),
    }
    setChart(a)
    setIsFormOpen(!isFormOpen)
    callback()
  }

  const handleDelete = async row => {
    const { isConfirmed } = await showConfirmAlert()
    if (isConfirmed) {
      const { success } = await del(`dentalchart/periodicalchart/${row?.id}`)
      if (success) {
        fetchChartData()
      }
    }
  }

  const pdColumns = [
    {
      dataField: "id",
      text: "#",
      style: { width: "20px" },
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "date",
      text: "Bill Date",
      formatter: (cell, row) => getZoneDateTime(row.date).format("DD-MM-YYYY"),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (row.status == 0 ? "Active" : "Deleted"),
    },
    // eslint-disable-next-line react/display-name
    {
      dataField: "actions",
      style: { width: "20px" },
      text: "",
      formatter: (cell, row) => {
        return (
          <>
            <a
              href="#"
              className="btn btn-info btn-sm edit me-2"
              onClick={() => handleViewChart(row)}
              title="View Chart"
            >
              <i className="fas fa-eye" /> View Chart
            </a>
            {row.status == 0 && (
              <a
                href="#"
                className="btn btn-danger btn-sm edit"
                onClick={() => handleDelete(row)}
                title="Delete Chart"
              >
                <i className="fas fa-trash" /> Delete
              </a>
            )}
          </>
        )
      },
    },
  ]

  // if(doctorsOptions?.length == 0){
  //   return 'loading'
  // }

  if (!isFormOpen) {
    return (
      <Datatables
        isSearch={true}
        columns={pdColumns}
        showTableOnly={true}
        rowsLength={rowData?.totalItems || 0}
        rows={rowData.items || []}
        keyField={"id"}
        handleAddButton={handleToggle}
        title="Periodontal Charts"
        isAdd={true}
        isTableHead={true}
        ssr={() => {}}
      />
    )
  }

  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <h5>
              <i
                role="button"
                className="me-2 fas fa-arrow-left"
                onClick={handleCallback}
              ></i>
              Periodontal Chart
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <DatePicker
              className="form-control"
              selected={startDate}
              onChange={date => {
                setStartDate(date)
                setChart(prev => ({ ...prev, date: date }))
              }}
            />
          </Col>
          <Col>
            <Select
              options={doctorsOptions}
              value={doctorsOptions?.filter(
                v => v.value == chart?.doctor_id || v.id == chart?.doctor_id
              )}
              placeholder="Select doctor"
              onChange={selectedOption => {
                setChart(prev => ({
                  ...prev,
                  doctor_id: selectedOption?.value || "",
                }))
              }}
              name="doc"
              id="doc"
            />
          </Col>
          {!chart?.id && (
            <Col className="d-flex">
              <button
                className="btn btn-danger"
                style={{ width: "220px" }}
                onClick={handleCallback}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary w-100 ms-2"
                onClick={handleSave}
              >
                Save
              </button>
            </Col>
          )}
        </Row>
        <hr />
        <Table>
          <tbody>
            {Object.keys(chart?.upper?.buccal)?.map((v, i) => {
              return (
                <tr key={`${i + 1}_KEYOFPDC_${i}`}>
                  <td className="bg-primary text-white w-50">
                    {v.replaceAll("_", " ")}
                  </td>
                  {chart?.upper?.buccal[v]?.data?.map((v1, i1) => {
                    return (
                      <td key={`${i1}_KEYOFPDC_${i1}`} className="text-center">
                        {v1?.value >= 0 ||
                        (v1?.value1 >= 0 &&
                          v1?.value2 >= 0 &&
                          v1?.value3 >= 0) ? (
                          chart?.upper?.buccal[v].type === "text" ? (
                            v1?.value >= 0 ||
                            (v1?.value1 >= 0 &&
                              v1?.value2 >= 0 &&
                              v1?.value3 >= 0) ? (
                              <div className="d-flex align-items-center gap-1">
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "upper",
                                      "buccal",
                                      v,
                                      v1.tooth,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value2 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "upper",
                                      "buccal",
                                      v,
                                      v1.tooth,
                                      "value2",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value3 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "upper",
                                      "buccal",
                                      v,
                                      v1.tooth,
                                      "value3",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <input
                                type="number"
                                className="form-control p-0"
                                style={{ width: "36px" }}
                                defaultValue={v1.value || 0}
                                onChange={e =>
                                  handleMultiClick(
                                    "upper",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            )
                          ) : chart?.upper?.buccal[v].type === "multiclick" ? (
                            <div className="d-flex align-items-center gap-1">
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value1
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "upper",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value1"
                                  )
                                }
                              />
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value2
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "upper",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value2"
                                  )
                                }
                              />
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value3
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "upper",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value3"
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: v1.value ? "#000" : "#D9D9D9",
                                margin: "auto",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleMultiClick(
                                  "upper",
                                  "buccal",
                                  v,
                                  v1.tooth,
                                  "value"
                                )
                              }
                            />
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr>
              <td>
                Buccal <i className="fas fa-arrow-up ms-5" />
                <br />
                <br />
                <br />
                Lingual <i className="fas fa-arrow-down  ms-5" />
              </td>
              {renderTeethRow(upperRight, true)}
              {renderTeethRow(upperLeft, true)}
            </tr>
            {Object.keys(chart?.upper?.lingual)?.map((v, i) => {
              return (
                <tr key={`${i + 1}_LKEYOFPDC_${i}`}>
                  <td className="bg-primary text-white w-80">
                    {v.replaceAll("_", " ")}
                  </td>
                  {chart?.upper?.lingual[v]?.data?.map((v1, i1) => {
                    return (
                      <td key={`${i1}_KEYOFPDC_${i1}`} className="text-center">
                        {v1?.value >= 0 ||
                        (v1?.value1 >= 0 && v1?.value2 >= 0) ? (
                          chart?.upper?.lingual[v].type === "text" ? (
                            v1?.value >= 0 ||
                            (v1?.value1 >= 0 &&
                              v1?.value2 >= 0 &&
                              v1?.value3 >= 0) ? (
                              <div className="d-flex align-items-center gap-1">
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "upper",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value2 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "upper",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value2",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value3 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "upper",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value3",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <input
                                type="number"
                                className="form-control p-0"
                                style={{ width: "36px" }}
                                defaultValue={v1.value || 0}
                                onChange={e =>
                                  handleMultiClick(
                                    "upper",
                                    "lingual",
                                    v,
                                    v1.tooth,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            )
                          ) : chart?.upper?.lingual[v].type === "multiclick" ? (
                            <div className="d-flex align-items-center gap-1">
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value1
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "upper",
                                    "lingual",
                                    v,
                                    v1.tooth,
                                    "value1"
                                  )
                                }
                              />
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value2
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "upper",
                                    "lingual",
                                    v,
                                    v1.tooth,
                                    "value2"
                                  )
                                }
                              />
                              {v1?.value3 >= 0 && (
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: v1.value3
                                      ? "#000"
                                      : "#D9D9D9",
                                    margin: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleMultiClick(
                                      "upper",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value3"
                                    )
                                  }
                                />
                              )}
                            </div>
                          ) : (
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: v1.value ? "#000" : "#D9D9D9",
                                margin: "auto",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleMultiClick(
                                  "upper",
                                  "lingual",
                                  v,
                                  v1.tooth,
                                  "value"
                                )
                              }
                            />
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>

        <hr />

        <Table>
          <tbody>
            {Object.keys(chart?.lower?.lingual)?.map((v, i) => {
              return (
                <tr key={`${i + 1}_LKEYOFPDC_${i}`}>
                  <td className="bg-primary text-white w-50">
                    {v.replaceAll("_", " ")}
                  </td>
                  {chart?.lower?.lingual[v]?.data?.map((v1, i1) => {
                    return (
                      <td key={`${i1}_KEYOFPDC_${i1}`} className="text-center">
                        {v1?.value >= 0 ||
                        (v1?.value1 >= 0 && v1?.value2 >= 0) ? (
                          chart?.upper?.lingual[v].type === "text" ? (
                            v1?.value >= 0 ||
                            (v1?.value1 >= 0 &&
                              v1?.value2 >= 0 &&
                              v1?.value3 >= 0) ? (
                              <div className="d-flex align-items-center gap-1">
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "lower",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value2 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "lower",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value2",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value3 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "lower",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value3",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <input
                                type="number"
                                className="form-control p-0"
                                style={{ width: "36px" }}
                                defaultValue={v1.value || 0}
                                onChange={e =>
                                  handleMultiClick(
                                    "lower",
                                    "lingual",
                                    v,
                                    v1.tooth,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            )
                          ) : chart?.lower?.lingual[v].type === "multiclick" ? (
                            <div className="d-flex align-items-center gap-1">
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value1
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "lower",
                                    "lingual",
                                    v,
                                    v1.tooth,
                                    "value1"
                                  )
                                }
                              />
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value2
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "lower",
                                    "lingual",
                                    v,
                                    v1.tooth,
                                    "value2"
                                  )
                                }
                              />
                              {v1?.value3 >= 0 && (
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: v1.value3
                                      ? "#000"
                                      : "#D9D9D9",
                                    margin: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleMultiClick(
                                      "lower",
                                      "lingual",
                                      v,
                                      v1.tooth,
                                      "value3"
                                    )
                                  }
                                />
                              )}
                            </div>
                          ) : (
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: v1.value ? "#000" : "#D9D9D9",
                                margin: "auto",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleMultiClick(
                                  "lower",
                                  "lingual",
                                  v,
                                  v1.tooth,
                                  "value"
                                )
                              }
                            />
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            <tr>
              <td>
                Lingual <i className="fas fa-arrow-up ms-5" />
                <br />
                <br />
                <br />
                Buccal
                <i className="fas fa-arrow-down  ms-5" />
              </td>
              {renderTeethRow(lowerRight, false)}
              {renderTeethRow(lowerLeft, false)}
            </tr>
            {Object.keys(chart?.lower?.buccal)?.map((v, i) => {
              return (
                <tr key={`${i + 1}_KEYOFPDC_${i}`}>
                  <td className="bg-primary text-white w-50">
                    {v.replaceAll("_", " ")}
                  </td>
                  {chart?.lower?.buccal[v]?.data?.map((v1, i1) => {
                    return (
                      <td key={`${i1}_KEYOFPDC_${i1}`} className="text-center">
                        {v1?.value >= 0 ||
                        (v1?.value1 >= 0 &&
                          v1?.value2 >= 0 &&
                          v1?.value3 >= 0) ? (
                          chart?.lower?.buccal[v].type === "text" ? (
                            v1?.value >= 0 ||
                            (v1?.value1 >= 0 &&
                              v1?.value2 >= 0 &&
                              v1?.value3 >= 0) ? (
                              <div className="d-flex align-items-center gap-1">
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "lower",
                                      "buccal",
                                      v,
                                      v1.tooth,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value2 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "lower",
                                      "buccal",
                                      v,
                                      v1.tooth,
                                      "value2",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="form-control p-0"
                                  style={{ width: "16px" }}
                                  defaultValue={v1.value3 || 0}
                                  onChange={e =>
                                    handleMultiClick(
                                      "lower",
                                      "buccal",
                                      v,
                                      v1.tooth,
                                      "value3",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <input
                                type="number"
                                className="form-control p-0"
                                style={{ width: "36px" }}
                                defaultValue={v1.value || 0}
                                onChange={e =>
                                  handleMultiClick(
                                    "lower",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            )
                          ) : chart?.lower?.buccal[v].type === "multiclick" ? (
                            <div className="d-flex align-items-center gap-1">
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value1
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "lower",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value1"
                                  )
                                }
                              />
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value2
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "lower",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value2"
                                  )
                                }
                              />
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: v1.value3
                                    ? "#000"
                                    : "#D9D9D9",
                                  margin: "auto",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMultiClick(
                                    "lower",
                                    "buccal",
                                    v,
                                    v1.tooth,
                                    "value3"
                                  )
                                }
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: v1.value ? "#000" : "#D9D9D9",
                                margin: "auto",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleMultiClick(
                                  "lower",
                                  "buccal",
                                  v,
                                  v1.tooth,
                                  "value"
                                )
                              }
                            />
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
        {!chart?.id && (
          <Row>
            <Col></Col>
            <Col></Col>
            <Col className="d-flex">
              <button
                className="btn btn-danger"
                style={{ width: "220px" }}
                onClick={handleCallback}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary w-100 ms-2"
                onClick={handleSave}
              >
                Save
              </button>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  )
}

export default PeriodontalChart
