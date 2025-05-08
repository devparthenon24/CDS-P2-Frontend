import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading, toFixed, total, float } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
var title_data = {
  data_1: { title: "รายการรับเงิน", creatable: false },
  data_2: { title: "รายรับอื่นๆ", creatable: false },
  data_3: { title: "หัก ค่าส่วนลดหนี้/เพิ่ม (ค่าส่วนกลาง)", creatable: false },
  data_4: { title: "รายการจ่ายเงิน", creatable: true },
  data_5: { title: "ยอดเงินฝากธนาคาร นิติบุคคลอาคารชุดบ้านเอื้ออาทรบางนา 5", creatable: true },
  data_6: { title: "รายการเงินสดคงเหลือในมือและอื่นๆ", creatable: true },

  data_7: { title: "สรุปยอดบัญชีเงินฝากธนาคารและเงินสดคงเหลือในมือยกไป", creatable: false },
  data_8: { title: "รายการเงินสดคงเหลือในมือและอื่นๆ", creatable: false },
};
export default class CashFlowReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TAB1
      data_1: { show: false, data: [] },
      data_2: { show: false, data: [] },
      data_3: { show: false, data: [] },
      data_4: { show: false, data: [] },
      data_5: { show: false, data: [] },
      data_6: { show: false, data: [] },
      // TAB2
      data_7: { show: false, data: [] },
      data_8: { show: false, data: [] },

      tab: false,

      report_id: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      status: 1,

      image: "",
image_index: -1,
data_index: "",

      dropdown: false,
    };
  }

  async componentDidMount() {
    loading(true);
    await this.Get();
    loading(false);
  }
  Get = async () => {
    let result = null;
    const searchParams = new URLSearchParams(window.location.search);
    const report_id = searchParams.get("id");
    if (report_id) {
      result = await GET("api/admin/cash-flow-report/list", { report_id: report_id });
      if (result?.status) {
        if (result.data.status === 2) {
          result.data = JSON.parse(JSON.stringify(result.data).replaceAll('"title_editable":true', '"title_editable":false').replaceAll('"amount_editable":true', '"amount_editable":false'));
          title_data.data_5.creatable = false;
          title_data.data_6.creatable = false;
        }
        this.setState({
          report_id: result.data.report_id,
          status: result.data.status,
          data_1: result.data.data_1,
          data_2: result.data.data_2,
          data_3: result.data.data_3,
          data_4: result.data.data_4,
          data_5: result.data.data_5,
          data_6: result.data.data_6,
          data_7: result.data.data_7,
          data_8: result.data.data_8,
        });
      }
    } else {
      result = await GET("api/admin/cash-flow-report/monthly");
      if (result?.status) {
        if (result.data.status === 2) {
          result.data = JSON.parse(JSON.stringify(result.data).replaceAll('"title_editable":true', '"title_editable":false').replaceAll('"amount_editable":true', '"amount_editable":false'));
          title_data.data_5.creatable = false;
          title_data.data_6.creatable = false;
        }
        this.setState({
          report_id: result.data.report_id,
          status: result.data.status,
          data_1: result.data.cash_flow_data.data_1,
          data_2: result.data.cash_flow_data.data_2,
          data_3: result.data.cash_flow_data.data_3,
          data_4: result.data.cash_flow_data.data_4,
          data_5: result.data.cash_flow_data.data_5,
          data_6: result.data.cash_flow_data.data_6,
          data_7: result.data.forword_data.data_7,
          data_8: result.data.forword_data.data_8,
        });
      }
    }
  };
  CreateUpdate = async (status) => {
    loading(true);
    let id = this.state.report_id;
    let body = {
      year: this.state.year,
      month: this.state.month,
      status: status,
      data_1: this.state.data_1,
      data_2: this.state.data_2,
      data_3: this.state.data_3,
      data_4: this.state.data_4,
      data_5: this.state.data_5,
      data_6: this.state.data_6,
      data_7: this.state.data_7,
      data_8: this.state.data_8,
    };
    let result = !id ? await POST("api/admin/cash-flow-report/create", body) : await PUT("api/admin/cash-flow-report/update/" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  componentTable = (data, data_index) => {
    console.log("data:", data);
    return (
      <div className="card rounded border-0 overflow-hidden mb-1" key={data_index}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr
                className="bg-success text-white pointer"
                onClick={async () => {
                  this.setState((prevState) => ({
                    [data]: {
                      ...prevState[data],
                      show: !prevState[data].show,
                    },
                  }));
                }}
              >
                <th colSpan={2}>
                  <h6 className="fw-bold mb-1">{title_data[data].title}</h6>
                </th>
                <th className="wpx-150">
                  <div className="icon text-16 ms-auto wpx-30 text-white">{this.state[data]?.show ? "\uf077" : "\uf078"}</div>
                </th>
              </tr>
            </thead>
            {this.state[data]?.show && (
              <tbody>
                {this.state[data]?.data
                  ?.filter((e) => e.visible)
                  .map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="wpx-40 text-center">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.title.map((e, idx) => {
                            if (item.title_editable) {
                              if (e.type === "text") {
                                return (
                                  <input
                                    key={idx}
                                    className="form-control"
                                    type="text"
                                    placeholder="กรุณากรอกข้อความ"
                                    style={{ minWidth: 150, width: e.value.length < 12 ? 150 : e.value.length * 7.1, zIndex: 100 }}
                                    value={e.value}
                                    onChange={(e) => {
                                      const dataCopy = { ...this.state[data] };
                                      dataCopy.data[index].title[idx].value = e.target.value;
                                      this.setState({ [data]: dataCopy });
                                    }}
                                  />
                                );
                              } else {
                                return (
                                  <input
                                    key={idx}
                                    className="form-control wpx-110 mx-1 hpx-24 px-1"
                                    type="date"
                                    value={e.value}
                                    onChange={(e) => {
                                      const dataCopy = { ...this.state[data] };
                                      dataCopy.data[index].title[idx].value = e.target.value;
                                      this.setState({ [data]: dataCopy });
                                    }}
                                  />
                                );
                              }
                            } else {
                              if (e.type === "text") {
                                return <span key={idx}>{e.value}</span>;
                              } else {
                                return (
                                  <input
                                    key={idx}
                                    className="form-control wpx-110 mx-1 hpx-24 px-1"
                                    type="date"
                                    value={e.value}
                                    onChange={(e) => {
                                      const dataCopy = { ...this.state[data] };
                                      dataCopy.data[index].title[idx].value = e.target.value;
                                      this.setState({ [data]: dataCopy });
                                    }}
                                  />
                                );
                              }
                            }
                          })}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end">
                          {item.amount_editable ? (
                            <input
                              className="form-control w-100 text-end"
                              type="text"
                              placeholder="กรุณากรอกข้อความ"
                              value={item.amount}
                              onChange={(e) => {
                                if (!float(e.target.value)) {
                                  return;
                                }
                                const dataCopy = { ...this.state[data] };
                                dataCopy.data[index].amount = e.target.value;
                                this.setState({ [data]: dataCopy });
                              }}
                            />
                          ) : (
                            toFixed(item.amount)
                          )}
                          {item.image ? (
                          <img className="wpx-25 hpx-25 rounded-3 img-fluid ms-2 mt-1 pointer" src={item.image} alt="slip" onClick={async () => {
                                this.setState({ modal_detail: true, image: item.image });
                              }}/>
                            ):(
                            <div
                              className="icon text-14 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-primary-light text-primary ms-2 mt-1"
                              onClick={async () => {
                                document.getElementById("image").click();
                                this.setState({ image: "", image_index: index, data_index: data });
                              }}
                            >
                              {"\uf03e"}
                            </div>
                            )}
                          {item.title_editable && (
                            <span
                              className="wpx-25 hpx-25 d-flex align-items-center justify-content-center bg-danger-light text-danger icon pointer rounded ms-2 mt-1"
                              onClick={() => {
                                const dataCopy = { ...this.state[data] };
                                dataCopy.data.splice(index, 1);
                                this.setState({ [data]: dataCopy });
                              }}
                            >
                              {"\uf2ed"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {title_data[data].creatable && (
                  <tr
                    className="bg-primary-light pointer"
                    onClick={() => {
                      if (data === "data_4") {
                        this.setState({ dropdown: !this.state.dropdown });
                      } else {
                        const dataCopy = { ...this.state[data] };
                        dataCopy.data.push({
                          visible: true,
                          title_editable: true,
                          title: [{ value: "", type: "text", required: false }],
                          amount_editable: true,
                          amount: 0.0,
                        });
                        this.setState({ [data]: dataCopy });
                      }
                    }}
                  >
                    <td colSpan={3}>
                      <div className="position-relative">
                      <span className="icon text-primary me-2">{"\uf055"}</span>เพิ่มรายการ
                        {this.state.dropdown && data === "data_4" && (
                          <div className="position-absolute" style={{ top: 0, left: 80, zIndex: 2000 }}>
                            <div className="card p-0 wpx-150">
                              <button
                                className="btn btn-light border-0 text-start"
                                onClick={() => {
                                  const dataCopy = { ...this.state[data] };
                                  dataCopy.data.push({
                                    visible: true,
                                    title_editable: true,
                                    title: [
                                      { value: "", type: "text", required: false },
                                      { value: "", type: "date", required: true },
                                      { value: "", type: "text", required: false },
                                    ],
                                    amount_editable: true,
                                    amount: 0.0,
                                  });
                                  this.setState({ [data]: dataCopy });
                                }}
                              >
                                เช็ค
                              </button>
                              <button
                                className="btn btn-light border-0 text-start"
                                onClick={() => {
                                  const dataCopy = { ...this.state[data] };
                                  dataCopy.data.push({
                                    visible: true,
                                    title_editable: true,
                                    title: [{ value: "", type: "text", required: false }],
                                    amount_editable: true,
                                    amount: 0.0,
                                  });
                                  this.setState({ [data]: dataCopy });
                                }}
                              >
                                ข้อความ
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}>รวมทั้งสิ้น</td>
                  <td className="text-end">{toFixed(total(this.state[data]?.data, "amount"))}</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
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
                    });let data = this.state[this.state.data_index];
                    data.data[this.state.image_index].image = image;
                    this.setState({ [this.state.data_index]: data });
                    e.target.value = "";
                    e.target.files = null;
                  }}
                />
      </div>
    );
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="รายงานกระแสเงินสดรับ - กระแสเงินสดจ่าย" />
        <div className="body px-3 pb-3 pt-0 position-relative">
          <h4 className="fw-bold mb-3">รายงานกระแสเงินสดรับ - กระแสเงินสดจ่าย</h4>
          <div className="d-flex mb-3">
            <div className="border rounded border-success mb-2 me-2" style={{ padding: 1, height: 38 }}>
              <button className={this.state.tab ? "btn btn-outline-success border-0 wpx-150 mb-0" : "btn btn-success wpx-150 mb-0"} onClick={() => this.setState({ tab: false })}>
                กระแสเงินสด
              </button>
              <button className={this.state.tab ? "btn btn-success wpx-150 mb-0" : "btn btn-outline-success border-0 wpx-150 mb-0"} onClick={() => this.setState({ tab: true })}>
                ยอดที่ยกมา
              </button>
            </div>
          </div>
          <h3 className="fw-bold">ชื่อโครงการ {format_date(new Date(), "mmmm yyyy", "th")}</h3>
          <div className="pb-5 mb-5">
            {!this.state.tab ? (
              <div>
                {/* DATA */}
                {["data_1", "data_2", "data_3", "data_4", "data_5", "data_6"].map((data, data_index) => this.componentTable(data, data_index))}
                {/* TOTAL */}
                <div className="card rounded border-0 overflow-hidden mb-1">
                  <table className="table table-hover mb-0">
                    <tr className="bg-success-light">
                      <td className="px-2">ประจำเดือน {format_date(new Date(), "mmmm yyyy", "th")} รายการรับเงิน มากกว่า รายการจ่ายเงิน</td>
                      <td className="text-end">
                        <h4 className="fw-bold mb-0">{toFixed(total(this.state.data_1?.data, "amount") + total(this.state.data_2?.data, "amount") + total(this.state.data_3?.data, "amount") + total(this.state.data_4?.data, "amount") + total(this.state.data_5?.data, "amount") + total(this.state.data_6?.data, "amount") + total(this.state.data_7?.data, "amount") + total(this.state.data_8?.data, "amount"))}</h4>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                {/* DATA */}
                {["data_7", "data_8"].map((data, data_index) => this.componentTable(data, data_index))}
              </div>
            )}
          </div>
          {this.state.status === 1 && (
            <div className="position-fixed w-100 bg-white p-3 d-flex justify-content-end shadow" style={{ bottom: 0, right: 0, zIndex: 10 }}>
              {1 + 1 === 2 ? (
                <div className="d-flex me-5">
                  <button
                    className="btn btn-primary px-5 ms-1"
                    onClick={() => {
                      Swal.fire({
                        icon: "info",
                        title: "ยืนยันการอนุมัติ",
                        text: "ยืนยันการอนุมัติรายการนี้หรือไม่ ?",
                        showCancelButton: true,
                        confirmButtonText: "อนุมัติ",
                        cancelButtonText: "ยกเลิก",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.CreateUpdate(2);
                        }
                      });
                    }}
                  >
                    อนุมัติ
                  </button>
                </div>
              ) : (
                <div />
              )}
              <div className="d-flex">
                <button
                  className="btn btn-danger px-5 me-1"
                  onClick={() => {
                    this.setState({ data: [] });
                  }}
                >
                  ล้างข้อมูล
                </button>
                <button
                  className="btn btn-success px-5 ms-1"
                  onClick={() => {
                    this.CreateUpdate(1);
                  }}
                >
                  บันทึก
                </button>
              </div>
            </div>
          )}
        </div>
         {/* VIEW */}
                <Modal show={this.state.modal_detail} size="lg">
                  <Modal.Body className="p-0">
                    <div className="d-flex p-3 justify-content-between">
                      <h4 className="fw-bold mb-0">รูปภาพ</h4>
                    <button
                        className="btn btn-danger px-4"
                        onClick={() => {
                           Swal.fire({
                                                          icon: "warning",
                                                          title: "ลบข้อมูล",
                                                          text: "ยืนยันการลบรายการนี้หรือไม่ ?",
                                                          showCancelButton: true,
                                                          confirmButtonText: "ลบข้อมูล",
                                                          cancelButtonText: "ยกเลิก",
                                                        }).then((result) => {
                                                          if (result.isConfirmed) {
                                                            
                          const dataCopy = { ...this.state[this.state.data_index] };
                          dataCopy.data[this.state.image_index].image = "";
                          this.setState({ [this.state.data_index]: dataCopy,modal_detail:false });

                        }
                      });
                        }}
                      >
                        ลบรูปภาพ
                      </button>
                    </div>
                    <div className="w-100 d-flex justify-content-center p-3 bg-secondary-light">
                      <img className="w-100 hpx-350 rounded-3 img-fluid mx-1 pointer" src={this.state.image} alt="slip" style={{objectFit:"contain"}}/>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="py-1">
                    <div className="w-100 d-flex justify-content-center p-0">
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
