import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading,status } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
export default class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      search: "",
      count: 0,
      data: [],

    };
  }

  async componentDidMount() {
    loading(false);
    await this.Get(1);
  }
  Get = async (page) => {
    loading(true);
    let body = {
      page: page,
      data_search: this.state.search,
    };
     let result = await GET("api/admin/cash-flow-report/list");
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="รายการกระแสเงินสดรับ - กระแสเงินสดจ่าย" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">รายการกระแสเงินสดรับ - กระแสเงินสดจ่าย</h4>
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
                    <th>เดือน/ปี</th>
                    <th>สถานะ</th>
                    <th className="text-center wpx-90">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.month + "/" + item.year}</td>
                      <td>
                        {item.status === 1 && (<small className="bg-warning-light text-orange px-2 py-1 rounded">รออนุมัติ</small>)}
                        {item.status === 2 && (<small className="bg-success-light text-success px-2 py-1 rounded">อนุมัติ</small>)}
                        {item.status === 3 && (<small className="bg-primary-light text-primary px-2 py-1 rounded">ปิดบัญชี</small>)}
                        </td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          {/* View */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-primary-light text-primary"
                            onClick={async () => {
                              window.location.href= "/admin/cash-flow-report?id="+item.report_id
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
        {/* CREATE UPDATE */}
        <Modal show={this.state.modal_create || this.state.modal_update} onHide={() => this.setState({ modal_create: false, modal_update: false })}>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}ลูกค้าโครงการ</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ชื่อผู้ใช้</div>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ username: e.target.value });
                }}
                value={this.state.username}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">รหัสผ่าน</div>
              <input
                type="password"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
                value={this.state.password}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ยืนยันรหัสผ่าน</div>
              <input
                type="password"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ confirm_password: e.target.value });
                }}
                value={this.state.confirm_password}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1">
            <div className="w-100 d-flex">
              <button
                className="btn btn-danger w-100 me-1"
                onClick={() => {
                  this.setState({ modal_create: false, modal_update: false });
                }}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-success w-100 ms-1"
                onClick={() => {
                  this.CreateUpdate();
                }}
              >
                บันทึก
              </button>
            </div>
          </Modal.Footer>
        </Modal>
        {/* VIEW */}
        <Modal show={this.state.modal_detail} size="lg">
          <Modal.Header>
            <h4 className="fw-bold mb-0">ลูกค้าโครงการ</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-6">
                <div className="d-flex mb-2">
                  <label className="wpx-100">ชื่อ - สกุล</label><label className="px-2">:</label>
                  <label>{this.state.full_name || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">เลขบัตรประชาชน</label><label className="px-2">:</label>
                  <label>{this.state.id_card || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">โครงการ</label><label className="px-2">:</label>
                  <label>{this.state.project_name || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">บ้านเลขที่</label><label className="px-2">:</label>
                  <label>{this.state.address_number || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">อาคาร</label><label className="px-2">:</label>
                  <label>{this.state.building || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">ชั้น</label><label className="px-2">:</label>
                  <label>{this.state.floor || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">ขนาดห้อง (ตรม.)</label><label className="px-2">:</label>
                  <label>{this.state.room_size || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">โทรศัพท์บ้าน</label><label className="px-2">:</label>
                  <label>{this.state.home_phone || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">โทรศัพท์มือถือ</label><label className="px-2">:</label>
                  <label>{this.state.mobile_phone || "-"}</label>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่ส่งมอบ</label><label className="px-2">:</label>
                  <label>{this.state.delivery_date ? format_date(this.state.delivery_date, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่มารับมอบ</label><label className="px-2">:</label>
                  <label>{this.state.receive_date ? format_date(this.state.receive_date, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่โอน</label><label className="px-2">:</label>
                  <label>{this.state.transfer_date ? format_date(this.state.transfer_date, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">สถานะการโอน</label><label className="px-2">:</label>
                  <label>{global.status_transfer[this.state.status_transfer] || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">เลขที่เงินกู้</label><label className="px-2">:</label>
                  <label>{this.state.loan_number || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วงเงินกู้</label><label className="px-2">:</label>
                  <label>{this.state.credit_limit || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">เงินงวด</label><label className="px-2">:</label>
                  <label>{this.state.installment || "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">วันที่ทำสัญญา</label><label className="px-2">:</label>
                  <label>{this.state.contract_date ? format_date(this.state.contract_date, "yyyy-mm-dd hh:mm:ss", "en") : "-"}</label>
                </div>
                <div className="d-flex mb-2">
                  <label className="wpx-100">ซื้ออาคารโดย</label><label className="px-2">:</label>
                  <label>{global.status_buy_building[this.state.status_buy_building] || "-"}</label>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex mb-2">
                  <label className="wpx-100">ที่อยู่</label><label className="px-2">:</label>
                  <label>{this.state.address || "-"}</label>
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
