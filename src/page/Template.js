import EXAMPLE from "../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading } from "../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
export default class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      search: "",
      count: 0,

      data: [""],

      text: "",
      photo: "",
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
  Delete = async (id) => {
    loading(true);
    let result = await DELETE("api/transaction/" + id, null);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="ทดสอบ" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">ทดสอบ</h4>
          <div className="d-flex flex-wrap">
            <input
              type="text"
              className="form-control wpx-200 me-2 mb-2"
              placeholder="ค้นหา..."
              onChange={(e) => {
                this.setState({ search: e.target.value });
              }}
              value={this.state.search}
            />
            <input
              type="date"
              className="form-control wpx-200 me-2 mb-2"
              onChange={(e) => {
                this.setState({ search: e.target.value });
              }}
              value={this.state.search}
            />
            <select
              className="form-control wpx-200 rounded me-2 mb-2"
              onChange={(e) => {
                this.setState({ status: e.target.value });
              }}
              value={this.state.status}
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="cancel">Cancel</option>
            </select>
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
            <button
              className="btn btn-success px-4 ms-auto mb-2"
              onClick={async () => {
                this.setState({ modal_create: true });
              }}
            >
              เพิ่ม
            </button>
          </div>
          <div className="card rounded border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th className="wpx-50 text-center">ลำดับ</th>
                    <th>ชื่อ - นามสกุล</th>
                    <th>จำนวน</th>
                    <th>สถานะ</th>
                    <th className="text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td>{format_date(item.createdAt, "yyyy-mm-dd hh:mm:ss")}</td>
                      <td>{item.customer_name}</td>
                      <td className={item.transaction_type === "deposit" ? "text-success" : "text-danger"}>{Number(item.amount || 0)}</td>
                      <td className="py-1">
                        {Status("ทดสอบ", "primary")}
                        {Status("ทดสอบ", "secondary")}
                        {Status("ทดสอบ", "success")}
                        {Status("ทดสอบ", "info")}
                        {Status("ทดสอบ", "warning")}
                        {Status("ทดสอบ", "danger")}
                        {Status("ทดสอบ", "dark")}
                      </td>
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
                          {/* Print */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-cyan-light text-primary"
                            onClick={async () => {
                              this.setState({ modal_detail: true });
                            }}
                          >
                            {"\uf02f"}
                          </div>
                          {/* Update */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-warning-light text-orange"
                            onClick={async () => {
                              this.setState({ modal_update: true });
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
                                  this.Delete(item.id);
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
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ข้อความ</div>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ text: e.target.value });
                }}
                value={this.state.text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ข้อความยาว</div>
              <textarea
                className="form-control"
                placeholder="กรอกข้อมูล..."
                rows={5}
                onChange={(e) => {
                  this.setState({ text: e.target.value });
                }}
                value={this.state.text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ตัวเลือก</div>
              <select
                className="form-control"
                onChange={(e) => {
                  this.setState({ text: e.target.value });
                }}
                value={this.state.text}
              >
                <option value="">-- กรุณาเลือก --</option>
              </select>
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ text: e });
                }}
                value={this.state.text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">สวิซต์</div>
              <Switch
                onChange={(e) => {
                  this.setState({ text: e });
                }}
                checked={this.state.text}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">รูปภาพ</div>
              <div className="d-flex flex-wrap">
                <input
                  hidden
                  accept="image/*"
                  id="image"
                  type="file"
                  onChange={async (e) => {
                    let image = await new Promise((resolve) => {
                      Resizer.imageFileResizer(
                        e.target.files[0],
                        1200,
                        1200,
                        "JPEG",
                        100,
                        0,
                        (uri) => {
                          resolve(uri);
                        },
                        "base64"
                      );
                    });
                    this.setState({ photo: image });
                  }}
                />
                {this.state.photo ? (
                  <div className="wpx-100 hpx-100 rounded-3 border p-1 position-relative">
                    <img alt="example" src={this.state.photo} className="rounded-3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span
                      className="wpx-30 hpx-30 rounded-circle bg-danger pointer text-white text-20 position-absolute icon d-flex align-items-center justify-content-center shadow"
                      style={{ right: -12, top: -12 }}
                      onClick={() => {
                        this.setState({ photo: "" });
                      }}
                    >
                      {"\uf00d"}
                    </span>
                  </div>
                ) : (
                  <div className="d-flex">
                    <div
                      className="wpx-100 hpx-100 d-flex align-items-center justify-content-center icon text-48 text-contain border-secondary border-2 border-dash rounded-3 pointer select-image"
                      onClick={() => {
                        document.getElementById("image").click();
                      }}
                    >
                      {"\uf03e"}
                    </div>
                    <small className="text-secondary ps-3">
                      <b>ขนาดไฟล์ที่แนะนำ:</b> ไม่เกิน 1200x1200 พิกเซล เพื่อให้ได้คุณภาพที่ดีที่สุด <br />
                      <b>รูปแบบไฟล์ที่รองรับ:</b> PNG, JPG, JPEG, GIF <br />
                      <b>ขนาดไฟล์สูงสุด:</b> 5MB
                    </small>
                  </div>
                )}
              </div>
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
        <Modal show={this.state.modal_detail}>
          <Modal.Header>
            <h4 className="fw-bold mb-0">รายละเอียด</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2 justify-content-between flex-wrap">
              <label>Time</label>
              <label>{this.state.createdAt ? format_date(this.state.createdAt, "yyyy-mm-dd hh:mm:ss", "en") : ""}</label>
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1">
            <div className="w-100 d-flex">
              <div className="w-100 p-1">
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => {
                    this.setState({ modal_detail: false });
                  }}
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
