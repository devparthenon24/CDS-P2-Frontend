import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
export default class Receipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      count: 0,
      start_date: "",
      end_date: "",
      type: "",

      data: [""],
    };
  }

  async componentDidMount() {
    loading(false);
    // await this.Get(1);
  }
  Get = async (page) => {
    loading(true);
    let body = {
page: page,
data_search: this.state.search
};
    let result = await GET("api/transaction/list", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="รายการใบเสร็จ" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">รายการใบเสร็จ</h4>
          <div className="d-flex align-items-center flex-wrap">
            <input
              type="text"
              className="form-control wpx-250 me-2 mb-2"
              placeholder="ค้นหา..."
              onChange={(e) => {
                this.setState({ search: e.target.value });
              }}
              value={this.state.search}
            />
            <div className="wpx-200 me-2 mb-2">
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ start_date: e });
                }}
                value={this.state.start_date}
              />
            </div>
            <div className="wpx-200 me-2 mb-2">
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ end_date: e });
                }}
                value={this.state.end_date}
              />
            </div>
            <select
              className="form-control wpx-250 rounded me-2 mb-2"
              onChange={(e) => {
                this.setState({ type: e.target.value });
              }}
              value={this.state.type}
            >
              <option value="">รายการสถานะการโอน</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="cancel">Cancel</option>
            </select>
            <div className="d-flex">
              <button
                className="btn btn-success px-4 me-2 mb-2"
                onClick={() => {
                  this.Get(1);
                }}
              >
                ค้นหา
              </button>
              <button
                className="btn btn-outline-success px-4 me-2 mb-2"
                onClick={() => {
                  window.location.reload();
                }}
              >
                ล้างค่า
              </button>
            </div>
          </div>
          <div className="card rounded border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th className="wpx-50 text-center">ลำดับ</th>
                    <th>บ้านเลขที่</th>
                    <th>ชื่อ - สกุล</th>
                    <th>วันที่ออกบิล</th>
                    <th>เลขมาตร</th>
                    <th>จำนวนหน่วยที่ใช้</th>
                    <th>ค่าน้ำประปา</th>
                    <th>ค่ารักษาอุปกรณ์</th>
                    <th>ค่าส่วนกลาง</th>
                    <th>ค่าขยะ</th>
                    <th>ค่าเคเบิล</th>
                    <th>ค่าเบี้ยประกัน</th>
                    <th>ค่าปรับล่าช้า</th>
                    <th>ค่าใช้จ่ายอื่นๆ</th>
                    <th>เพิ่ม/ลดหนี้</th>
                    <th>รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td>{index + 1}</td>
                      <td>บ้านเลขที่</td>
                      <td>ชื่อ - สกุล</td>
                      <td>วันที่ออกบิล</td>
                      <td>เลขมาตร</td>
                      <td>จำนวนหน่วยที่ใช้</td>
                      <td>ค่าน้ำประปา</td>
                      <td>ค่ารักษาอุปกรณ์</td>
                      <td>ค่าส่วนกลาง</td>
                      <td>ค่าขยะ</td>
                      <td>ค่าเคเบิล</td>
                      <td>ค่าเบี้ยประกัน</td>
                      <td>ค่าปรับล่าช้า</td>
                      <td>ค่าใช้จ่ายอื่นๆ</td>
                      <td>เพิ่ม/ลดหนี้</td>
                      <td>รวม</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-100 d-flex align-items-center justify-content-between p-3">
            <small>ทั้งหมด {this.state.count} รายการ</small>
            <Pagination
              count={Math.ceil(this.state.count / 10)}
              showFirstButton
              showLastButton
              onChange={(_, page) => {
                this.Get(page);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
