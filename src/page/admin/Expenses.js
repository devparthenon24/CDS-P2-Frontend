import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading, toFixed } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
export default class Expenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,
      // FILTER
      search: "",
      count: 0,
      type: "",
      date: "",
      tab: false,
      currentDate: new Date(),
      // DATA
      data_expense_type: [],
      data: [],
      data_week: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
      data_date: [],
      noneProcess: [],
      // FORM
      expense_id: "",
      payment_number: "",
      receipt_date: "",
      expense_type_id: "",
      expense_description: "",
      amount: "",
      slip_image: "",
    };
  }

  async componentDidMount() {
    await this.Get(1);
  }
  Get = async (page) => {
    loading(true);
    let data, count, data_expense_type;
    let [result1, result2] = await Promise.all([GET("api/admin/expenses/list", { page: page, data_search: this.state.search, expense_type_id: this.state.type, year_month: this.state.date ? format_date(this.state.date, "yyyy-mm", "en") : "" }), GET("api/admin/expense-types/list", null)]);
    if (result1?.status) {
      data = result1.data;
      count = result1.count;
    }
    if (result2?.status) {
      data_expense_type = result2.data.map((e) => {
        return { value: e.expense_type_id, label: e.expense_type_name };
      });
    }
    console.log("data_expense_type:", data_expense_type);
    this.setState({
      data,
      count,
      data_expense_type,
      currentDate: new Date(format_date(this.state.date || new Date(), "yyyy-mm-dd", "en")),
    });
    setTimeout(() => {
      this.setState({
        data_date: this.getMonthArray(format_date(this.state.date || new Date(), "m"), format_date(this.state.date || new Date(), "yyyy")).map((e) => {
          return { date: e, list: [] };
        }),
      });
    }, 10);
    loading(false);
  };
  CreateUpdate = async () => {
    loading(true);
    let id = this.state.expense_id;
    let body = {
      payment_number: this.state.payment_number,
      receipt_date: this.state.receipt_date,
      expense_type_id: this.state.expense_type_id,
      expense_description: this.state.expense_description,
      amount: this.state.amount,
      slip_image: this.state.slip_image,
    };
    let result = !id ? await POST("api/admin/expenses/create", body) : await PUT("api/admin/expenses/update/" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  Delete = async (id) => {
    loading(true);
    let result = await DELETE("api/admin/expenses/delete/" + id, null);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  getMonthArray = (month, year) => {
    month = month || new Date().getMonth() + 1;
    year = year || new Date().getFullYear();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // หา day of week วันแรกของเดือน
    const daysInMonth = new Date(year, month, 0).getDate(); // หา days in month

    // เริ่มด้วย array ค่าว่างจำนวนวันที่ก่อนวันแรกของเดือน
    let monthArray = new Array(firstDayOfWeek).fill("");

    // เติมตัวเลขวันที่ลงไปใน array
    for (let i = 1; i <= daysInMonth; i++) {
      monthArray.push(i.toString());
    }

    // ค่าว่างสำหรับวันหลังจากวันสุดท้ายของเดือน
    const lastDayOfWeek = new Date(year, month - 1, daysInMonth).getDay();
    const emptyEndDays = new Array(6 - lastDayOfWeek).fill("");
    monthArray = monthArray.concat(emptyEndDays);

    // หาวันที่ว่าง
    const data = this.state.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const lastCreatedAtDate = new Date(data[0]?.createdAt);
    const startDate = new Date(lastCreatedAtDate);
    startDate.setDate(startDate.getDate() + 1);
    console.log("startDate:", startDate);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    const noneProcess = [];

    for (let i = Number(format_date(startDate, "d")); i <= Number(format_date(endDate, "d")); i++) {
      noneProcess.push(Number(i));
    }
    console.log("noneProcess:", noneProcess);
    this.setState({ noneProcess });
    return monthArray;
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="รายการค่าใช้จ่าย" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">รายการค่าใช้จ่าย</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div
              className={this.state.tab ? "icon text-20 text-contain me-2 mb-2 pointer" : "icon text-20 text-success me-2 mb-2 pointer"}
              onClick={async () => {
                this.setState({ tab: false });
              }}
            >
              {"\uf03a"}
            </div>
            <div
              className={this.state.tab ? "icon text-20 text-success me-2 mb-2 pointer" : "icon text-20 text-contain me-2 mb-2 pointer"}
              onClick={async () => {
                this.setState({ tab: true });
              }}
            >
              {"\uf009"}
            </div>
            <input
              type="text"
              className="form-control wpx-250 me-2 mb-2"
              placeholder="เลขที่ใบสำคัญจ่าย..."
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
              <option value="">ประเภทค่าใช้จ่าย</option>
              {this.state.data_expense_type && this.state.data_expense_type?.map((e) => (
                <option value={e.value}>{e.label}</option>
              ))}
            </select>
            <input
              type="month"
              className="form-control wpx-250 me-2 mb-2"
              onChange={(e) => {
                this.setState({ date: e.target.value });
              }}
              value={this.state.date}
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
                this.setState({ modal_create: true, expense_id: "", payment_number: "", receipt_date: "", expense_type_id: "", expense_description: "", amount: "", slip_image: "" });
              }}
            >
              เพิ่มค่าใช้จ่าย
            </button>
          </div>
          {this.state.tab ? (
            <div className="card rounded border-0 overflow-hidden">
              <div className="d-flex flex-wrap justify-content-between bg-secondary" style={{ borderCollapse: "collapse" }}>
                {this.state.data_week.map((item, index) => (
                  <div className="bg-success text-white text-center py-1" style={{ width: 100 / 7 + "%" }}>
                    {item}
                  </div>
                ))}
                {this.state.data_date.map((item, index) => (
                  <div className={`${this.state.noneProcess.includes(Number(item.date)) ? "bg-warning-light" : format_date(new Date(),"d") == item?.date && format_date(new Date(),"yyyy-mm") == format_date(this.state.currentDate,"yyyy-mm") ? "bg-success-light" : "bg-white"} d-flex justify-content-between py-1 px-2 hpx-100`} style={{ width: 100 / 7 + "%", borderColor: "#dfdfdf", borderWidth: 1, borderStyle: "solid" }}>
                    {item?.date}
                    {this.state.noneProcess.includes(Number(item.date)) ? (
                      <div className="w-100 d-flex justify-content-end">
                        <span className="icon text-72 text-warning ms-auto mb-3">{"\uf05a"}</span>
                      </div>
                    ) : (
                      <div className="w-100 d-flex flex-wrap">
                        {this.state.data
                          .filter((e) => format_date(e.createdAt, "d") === item.date)
                          .map((item, index) => (
                            <>
                              <div
                                className="d-none d-xl-flex justify-content-end mb-1 pointer w-100"
                                onClick={async () => {
                                  this.setState({ modal_detail: true, ...item });
                                }}
                              >
                                {Status(this.state.data_expense_type.find((e) => e.value === item.expense_type_id)?.label || "", ["primary", "success", "warning", "danger"][index % 4])}
                              </div>
                              <div
                                className={`d-flex d-xl-none mb-1 ms-1 pointer rounded-circle bg-${["primary", "success", "warning", "danger"][index % 4]}`}
                                style={{ width: 16, height: 16 }}
                                title={this.state.data_expense_type.find((e) => e.value === item.expense_type_id)?.label || ""}
                                onClick={async () => {
                                  this.setState({ modal_detail: true, ...item });
                                }}
                              ></div>
                            </>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="card rounded border-0 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light text-secondary">
                      <tr>
                        <th className="wpx-50 text-center">ลำดับ</th>
                        <th>วันที่บันทึก</th>
                        <th>วันที่ออกใบเสร็จ</th>
                        <th>เลขที่ใบสำคัญจ่าย</th>
                        <th>ประเภทค่าใช้จ่าย</th>
                        <th>รายการค่าใช้จ่าย</th>
                        <th className="text-end">จำนวน</th>
                        <th className="text-center wpx-60">ดูข้อมูล</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data?.map((item, index) => (
                        <tr key={"table_" + index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{format_date(item.createdAt, "dd/mm/yyyy")}</td>
                          <td>{format_date(item.receipt_date, "dd/mm/yyyy")}</td>
                          <td className="text-success">{item.payment_number || ""}</td>
                          <td className="py-1">{Status(this.state.data_expense_type.find((e) => e.value === item.expense_type_id)?.label || "", "primary")}</td>
                          <td className="text-success">{item.expense_description || ""}</td>
                          <td className="text-success text-end">{toFixed(item.amount || 0)}</td>
                          <td className="py-1">
                            <div className="d-flex justify-content-center">
                              {/* View */}
                              <div
                                className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-primary-light text-primary"
                                onClick={async () => {
                                  this.setState({ modal_detail: true, ...item });
                                }}
                              >
                                {"\uf06e"}
                              </div>
                              {/* Update */}
                              <div
                                className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-warning-light text-orange"
                                onClick={async () => {
                                  this.setState({ modal_update: true, ...item });
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
                                      this.Delete(item.expense_id);
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
          )}
        </div>
        {/* CREATE UPDATE */}
        <Modal show={this.state.modal_create || this.state.modal_update} onHide={() => this.setState({ modal_create: false, modal_update: false })}>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}ค่าใช้จ่าย</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">เลขที่ใบสำคัญจ่าย</div>
              <input
                type="text"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ payment_number: e.target.value });
                }}
                value={this.state.payment_number}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">วันที่ใบเสร็จ</div>
              <DatePicker
                className="form-control"
                onChange={(e) => {
                  this.setState({ receipt_date: e });
                }}
                value={this.state.receipt_date}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ประเภทค่าใช้จ่าย</div>
              <select
                className="form-control"
                onChange={(e) => {
                  this.setState({ expense_type_id: e.target.value });
                }}
                value={this.state.expense_type_id}
              >
                <option value="">-- กรุณาเลือก --</option>
                {this.state.data_expense_type.map((e) => (
                  <option value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">รายการค่าใช้จ่าย</div>
              <textarea
                className="form-control"
                placeholder="กรอกข้อมูล..."
                rows={5}
                onChange={(e) => {
                  this.setState({ expense_description: e.target.value });
                }}
                value={this.state.expense_description}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">จำนวนเงิน</div>
              <input
                type="number"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                onChange={(e) => {
                  this.setState({ amount: e.target.value });
                }}
                value={this.state.amount}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">รูปภาพสลิป</div>
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
                    this.setState({ slip_image: image });
                  }}
                />
                {this.state.slip_image ? (
                  <div className="wpx-100 hpx-100 rounded-3 border p-1 position-relative">
                    <img alt="example" src={this.state.slip_image} className="rounded-3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span
                      className="wpx-30 hpx-30 rounded-circle bg-danger pointer text-white text-20 position-absolute icon d-flex align-items-center justify-content-center shadow"
                      style={{ right: -12, top: -12 }}
                      onClick={() => {
                        this.setState({ slip_image: "" });
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
        <Modal show={this.state.modal_detail} onHide={() => this.setState({ modal_detail: false })}>
          <Modal.Header>
            <h4 className="fw-bold mb-0">ค่าใช้จ่าย</h4>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2 flex-wrap">
              <label className="wpx-150">เลขที่ใบสำคัญจ่าย</label>
              <label>{this.state.payment_number || ""}</label>
            </div>
            <div className="d-flex mb-2 flex-wrap">
              <label className="wpx-150">วันที่ใบเสร็จ</label>
              <label>{format_date(this.state.receipt_date, "dd/mm/yyyy")}</label>
            </div>
            <div className="d-flex mb-2 flex-wrap">
              <label className="wpx-150">ประเภทค่าใช้จ่าย</label>
              <label>{Status(this.state.data_expense_type.find((e) => e.value === this.state.expense_type_id)?.label || "", "primary")}</label>
            </div>
            <div className="d-flex mb-2 flex-wrap">
              <label className="wpx-150">รายการค่าใช้จ่าย</label>
              <label>{this.state.expense_description || ""}</label>
            </div>
            <div className="d-flex mb-2 flex-wrap">
              <label className="wpx-150">จำนวนเงิน</label>
              <label>{toFixed(this.state.amount || 0)}</label>
            </div>
            <div className="d-flex mb-2 flex-wrap">
              <label className="wpx-150">รูปภาพสลิป</label>
              {this.state.slip_image && (
                <div className="wpx-100 hpx-100 rounded-3 border p-1 position-relative">
                  <img alt="example" src={this.state.slip_image} className="rounded-3" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
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
