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
export default class BankAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      search: "",
      count: 0,

      data: [],

      bank_account_id: "",
      bank_name: "",
      account_name: "",
      account_no: "",
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
    let result = await GET("api/admin/bank-accounts/list", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  CreateUpdate = async () => {
    if (!this.state.bank_name) {
      alert("", "warning", "แจ้งเตือน", "กรุณาเลือกธนาคาร");
      return;
    }
    if (!this.state.account_name) {
      alert("", "warning", "แจ้งเตือน", "กรุณาระบุชื่อบัญชี");
      return;
    }
    if (!this.state.account_no) {
      alert("", "warning", "แจ้งเตือน", "กรุณาระบุเลขที่บัญชี");
      return;
    }

    loading(true);
    let id = this.state.bank_account_id;
    let body = {
      bank_name: this.state.bank_name,
      account_name: this.state.account_name,
      account_no: this.state.account_no,
    };
    let result = !id ? await POST("api/admin/bank-accounts/create", body) : await PUT("api/admin/bank-accounts/update/" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  Delete = async (id) => {
    loading(true);
    let result = await DELETE("api/admin/bank-accounts/delete/" + id, null);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="บัญชีธนาคาร" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">บัญชีธนาคาร</h4>
          <div className="d-flex align-items-center flex-wrap">
            <input
              type="text"
              className="form-control wpx-250 me-2 mb-2"
              placeholder="ชื่อบัญชี, เลขที่บัญชี..."
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
            <button
              className="btn btn-success px-4 ms-auto mb-2"
              onClick={async () => {
                this.setState({ modal_create: true, bank_account_id: "", bank_name: "", account_name: "", account_no: "" });
              }}
            >
              เพิ่มบัญชีธนาคาร
            </button>
          </div>
          <div className="card rounded border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th className="wpx-50 text-center">ลำดับ</th>
                    <th>โลโก้</th>
                    <th>ชื่อธนาคาร</th>
                    <th>ชื่อบัญชี</th>
                    <th>เลขที่บัญชี</th>
                    <th className="text-center wpx-90">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="py-1"><img alt={item.bank_name} src={require(`../../assets/images/bank/${global.bank.findIndex(e=>e === item.bank_name)}.png`)} width={25}/></td>
                      <td>{item.bank_name}</td>
                      <td>{item.account_name}</td>
                      <td>{item.account_no}</td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          {/* Update */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-warning-light text-orange"
                            onClick={async () => {
                              this.setState({ modal_update: true, bank_account_id: item.bank_account_id, bank_name: item.bank_name, account_name: item.account_name, account_no: item.account_no });
                            }}
                          >
                            {"\uf044"}
                          </div>
                          {/* Delete */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-danger-light text-danger"
                            onClick={async () => {
                              Swal.fire({
                                icon: "warning",
                                title: "ลบข้อมูล",
                                text: "ยืนยันการลบรายการนี้หรือไม่ ?",
                                showCancelButton: true,
                                confirmButtonText: "ลบข้อมูล",
                                cancelButtonText: "ยกเลิก",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  this.Delete(item.bank_account_id);
                                }
                              });
                            }}
                          >
                            {"\uf1f8"}
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
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}บัญชีธนาคาร</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ธนาคาร</div>
              <select
                className="form-control"
                onChange={(e) => {
                  this.setState({ bank_name: e.target.value });
                }}
                value={this.state.bank_name}
              >
                <option value="">-- กรุณาเลือก --</option>
                {global.bank.map((e) => (
                  <option value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ชื่อบัญชี</div>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ account_name: e.target.value });
                }}
                value={this.state.account_name}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">เลขที่บัญชี</div>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ account_no: e.target.value });
                }}
                value={this.state.account_no}
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
      </div>
    );
  }
}
