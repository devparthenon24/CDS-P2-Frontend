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
export default class AllRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      search: "",
      count: 0,
      type: "",

      data: [""],

      username: "",
      password: "",
      confirm_password: "",
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
  CreateUpdate = async () => {
    loading(true);
let id = this.state.id;
    let body = {};
    let result = !id ? await POST("api/transaction/create", body) : await PUT("api/transaction/update"+id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="ข้อมูลห้องทั้งหมด" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">ข้อมูลห้องทั้งหมด</h4>
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
                    <th>ชื่อ - สกุล</th>
                    <th>บ้านเลขที่</th>
                    <th>อาคาร</th>
                    <th>ชั้น</th>
                    <th>เบอร์โทรศัพท์</th>
                    <th className="text-center wpx-90">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td>ชื่อ - สกุล</td>
                      <td>บ้านเลขที่</td>
                      <td>อาคาร</td>
                      <td>ชั้น</td>
                      <td>เบอร์โทรศัพท์</td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          {/* View */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-primary-light text-primary"
                            onClick={async () => {
                              this.setState({ modal_detail: true });
                            }}
                          >
                            {"\uf06e"}
                          </div>
                        </div>
                      </td>
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
        {/* VIEW */}
        <Modal show={this.state.modal_detail} size="md">
          <Modal.Header>
            <h4 className="fw-bold mb-0">ข้อมูลห้องทั้งหมด</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-6">
                <div className="d-flex mb-2">
                  <label className="wpx-100">ชื่อ - สกุล</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">เลขบัตรประชาชน</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">โครงการ</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">บ้านเลขที่</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">อาคาร</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">ชั้น</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">ขนาดห้อง (ตรม.)</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">โทรศัพท์บ้าน</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">โทรศัพท์มือถือ</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่ส่งมอบ</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่มารับมอบ</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่โอน</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">สถานะการโอน</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">เลขที่เงินกู้</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วงเงินกู้</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">เงินงวด</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่ทำสัญญา</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">ซื้ออาคารโดย</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex mb-2">
                  <label className="wpx-100">ที่อยู่</label>
                  <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1">
            <div className="w-100 d-flex justify-content-center p-1">
              <button
                className="btn btn-outline-success px-5"
                onClick={() => {
                  this.setState({ modal_detail: false });
                }}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
