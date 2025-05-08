import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import LOGO from "../../assets/images/logo.png";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
export default class Banners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      count: 0,

      data: [],

      banner_id: "",
      image: "",
      start_date: "",
      end_date: "",
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
    };
    let result = await GET("api/admin/banners/list", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  CreateUpdate = async () => {
    if(!this.state.image){alert("","warning","แจ้งเตือน","กรุณาเลือกรูปภาพ"); return; }
    if(!this.state.start_date){alert("","warning","แจ้งเตือน","กรุณาเลือกวันที่เริ่มต้น"); return; }
    if(!this.state.end_date){alert("","warning","แจ้งเตือน","กรุณาเลือกวันที่สิ้นสุด"); return; }
    loading(true);
    let id = this.state.banner_id;
    let body = {
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      image: this.state.image,
    };
    let result = !id ? await POST("api/admin/banners/create", body) : await PUT("api/admin/banners/update" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  Delete = async (id) => {
    loading(true);
    let result = await DELETE("api/admin/banner/delete/" + id, null);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="แบนเนอร์" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">แบนเนอร์</h4>
          <div className="d-flex justify-content-end">
          <button
              className="btn btn-success px-4 mb-2"
              onClick={async () => {
                this.setState({ modal_create: true, banner_id: "", image: "", start_date: "", end_date: "" });
              }}
            >
              เพิ่มแบนเนอร์
            </button>
            </div>
          <div className="card rounded border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th className="wpx-50 text-center">ลำดับ</th>
                    <th>รูปภาพ</th>
                    <th>วันเวลาเริ่มต้น</th>
                    <th>วันเวลาสิ้นสุด</th>
                    <th className="text-center wpx-90">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <div
                          onClick={() => {
                            this.setState({ modal_detail: true, image: item.image });
                          }}
                        >
                          <img src={item.image || LOGO} style={{ width: 20, height: 20, objectFit: "cover" }} alt="LOGO" className="bg-contain pointer" />
                        </div>
                      </td>
                      <td>{item.start_date ? format_date(item.start_date) : ""}</td>
                      <td>{item.end_date ? format_date(item.end_date) : ""}</td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          {/* Update */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-warning-light text-orange"
                            onClick={async () => {
                              this.setState({ modal_update: true, banner_id: item.banner_id, image: item.image, start_date: item.start_date, end_date: item.end_date });
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
                                  this.Delete(item.banner_id);
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
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}แบนเนอร์</h5>
          </Modal.Header>
          <Modal.Body>
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
                    this.setState({ image: image });
                  }}
                />
                {this.state.image ? (
                  <div className="wpx-100 hpx-100 rounded-3 border p-1 position-relative">
                    <img alt="example" src={this.state.image} className="rounded-3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span
                      className="wpx-30 hpx-30 rounded-circle bg-danger pointer text-white text-20 position-absolute icon d-flex align-items-center justify-content-center shadow"
                      style={{ right: -12, top: -12 }}
                      onClick={() => {
                        this.setState({ image: "" });
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
                      <b>ขนาดไฟล์ที่แนะนำ:</b> ไม่เกิน 1780x1280 พิกเซล เพื่อให้ได้คุณภาพที่ดีที่สุด <br />
                      <b>รูปแบบไฟล์ที่รองรับ:</b> PNG, JPG, JPEG, GIF <br />
                      <b>ขนาดไฟล์สูงสุด:</b> 5MB
                    </small>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่เริ่มต้น</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ start_date: e });
                }}
                value={this.state.start_date}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่สิ้นสุด</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ end_date: e });
                }}
                value={this.state.end_date}
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
        {/* CREATE UPDATE */}
        <Modal show={this.state.modal_create || this.state.modal_update} onHide={() => this.setState({ modal_create: false, modal_update: false })}>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}แบนเนอร์</h5>
          </Modal.Header>
          <Modal.Body>
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
                    this.setState({ image: image });
                  }}
                />
                {this.state.image ? (
                  <div className="wpx-100 hpx-100 rounded-3 border p-1 position-relative">
                    <img alt="example" src={this.state.image} className="rounded-3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span
                      className="wpx-30 hpx-30 rounded-circle bg-danger pointer text-white text-20 position-absolute icon d-flex align-items-center justify-content-center shadow"
                      style={{ right: -12, top: -12 }}
                      onClick={() => {
                        this.setState({ image: "" });
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
                      <b>ขนาดไฟล์ที่แนะนำ:</b> ไม่เกิน 1780x1280 พิกเซล เพื่อให้ได้คุณภาพที่ดีที่สุด <br />
                      <b>รูปแบบไฟล์ที่รองรับ:</b> PNG, JPG, JPEG, GIF <br />
                      <b>ขนาดไฟล์สูงสุด:</b> 5MB
                    </small>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่เริ่มต้น</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ start_date: e });
                }}
                value={this.state.start_date}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่สิ้นสุด</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ end_date: e });
                }}
                value={this.state.end_date}
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
            <h4 className="fw-bold mb-0">รูปภาพ</h4>
          </Modal.Header>
          <Modal.Body>
            <img src={this.state.image} style={{ width: "100%", objectFit: "contain" }} alt="LOGO" className="bg-contain pointer" />
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
