import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading, toFixed, total, float } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
const title_data = {
  data_1: "รายการรับเงิน",
  data_2: "รายรับอื่นๆ",
  data_3: "หัก ค่าส่วนลดหนี้/เพิ่ม (ค่าส่วนกลาง)",
  data_4: "รายการจ่ายเงิน",
  data_5: "ยอดเงินฝากธนาคาร นิติบุคคลอาคารชุดบ้านเอื้ออาทรบางนา 5",
  data_6: "รายการเงินสดคงเหลือในมือและอื่นๆ",

  data_7: "สรุปยอดบัญชีเงินฝากธนาคารและเงินสดคงเหลือในมือยกไป",
  data_8: "รายการเงินสดคงเหลือในมือและอื่นๆ",
};
export default class CashFlowReport extends Component {
  // {
  // visible: true,
  // title_editable: false,
  //   title: [
  //     { value: "รับเงินค่าน้ำประปา", type: "text", required: false },
  //     { value: "", type: "date", required: true }, // เฉพาะวันที่ ที่สามารถเปลี่ยนได้ใน รายงาน
  //   ],
  // amount_editable: false,
  //   amount: 0.0,
  // },
  constructor(props) {
    super(props);
    this.state = {
      dropdown: "",
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
      setting_id: "",
    };
  }

  async componentDidMount() {
    loading(true);
    await this.Get();
    loading(false);
  }
  Get = async () => {
    let result = await GET("api/admin/setting-cash-flow-report/setting-list");
    if (result?.status) {
      this.setState({ ...result.data });
    }
  };
  Update = async () => {
    loading(true);
    let id = this.state.setting_id;
    let body = {
      data_1: this.state.data_1,
      data_2: this.state.data_2,
      data_3: this.state.data_3,
      data_4: this.state.data_4,
      data_5: this.state.data_5,
      data_6: this.state.data_6,
      data_7: this.state.data_7,
      data_8: this.state.data_8,
    };
    let result = await PUT("api/admin/setting-cash-flow-report/setting-update/" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  componentTable = (data, data_index) => {
    return (
      <div className="card rounded border-0 mb-1" key={data_index}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr
                className="bg-success text-white pointer"
                onClick={() => {
                  this.setState((prevState) => ({
                    [data]: {
                      ...prevState[data],
                      show: !prevState[data].show,
                    },
                  }));
                }}
              >
                <th colSpan={3}>
                  <h6 className="fw-bold mb-1">{title_data[data]}</h6>
                </th>
                <th className="wpx-50 text-center">
                  <div className="icon text-16 ms-auto wpx-30 text-white">{this.state[data]?.show ? "\uf077" : "\uf078"}</div>
                </th>
              </tr>
            </thead>
            {this.state[data]?.show && (
              <tbody>
                {this.state[data]?.data?.map((item, index) => (
                  <tr key={"table_" + index}>
                    <td className={`wpx-70 text-center ${item.visible ? "" : "bg-secondary"}`}>
                      <Switch
                        onChange={() => {
                          const updatedData = [...this.state[data].data];
                          updatedData[index].visible = !updatedData[index].visible;
                          this.setState({ [data]: { ...this.state[data], data: updatedData } });
                        }}
                        checked={item.visible}
                      />
                    </td>
                    <td className={item.visible ? "" : "bg-secondary"}>
                      <div className="d-flex align-items-center">
                        {item.title.map((title, title_index) => (
                          <div className="position-relative mx-1" key={title_index}>
                            <input
                              type={title.type}
                              className="form-control"
                              placeholder="ข้อความ..."
                              style={{ minWidth: 150, width: title.value.length < 12 ? 150 : title.value.length * 7.1, zIndex: 100 }}
                              onChange={(e) => {
                                const updatedData = [...this.state[data].data];
                                updatedData[index].title[title_index].value = e.target.value;
                                this.setState({ [data]: { ...this.state[data], data: updatedData } });
                              }}
                              value={title.value}
                              disabled={title.type === "date" || !item.visible}
                            />
                            {title_index !== 0 && item.visible && (
                              <div
                                className="icon text-white rounded-circle bg-danger wpx-20 hpx-20 d-flex align-items-center justify-content-center pointer position-absolute shadow"
                                style={{ top: -7, right: -7 }}
                                title="ลบช่องกรอก"
                                onClick={() => {
                                  const updatedData = [...this.state[data].data];
                                  updatedData[index].title.splice(title_index, 1);
                                  this.setState({ [data]: { ...this.state[data], data: updatedData } });
                                }}
                              >
                                {"\uf00d"}
                              </div>
                            )}
                            {title.type === "date" && item.visible && (
                              <div
                                className={`icon text-24 pt-1 text-white rounded-circle wpx-20 hpx-20 d-flex align-items-center justify-content-center pointer position-absolute shadow ${title.required ? "bg-warning" : "bg-secondary"}`}
                                style={{ top: -7, right: 14 }}
                                title="จำเป็นต้องกรอก"
                                onClick={() => {
                                  const updatedData = [...this.state[data].data];
                                  updatedData[index].title[title_index].required = !updatedData[index].title[title_index].required;
                                  this.setState({ [data]: { ...this.state[data], data: updatedData } });
                                }}
                              >
                                *
                              </div>
                            )}
                          </div>
                        ))}
                        {item.visible && (
                          <div className="position-relative">
                            <span
                              className="icon text-primary ms-2 pointer"
                              onClick={() => {
                                // แก้ไขให้ใช้ `data` เป็นสตริงตรง ๆ ไม่ต้องทำเป็น array
                                this.setState({ dropdown: this.state.dropdown === data + ":" + index ? "" : data + ":" + index });
                              }}
                            >
                              {"\uf055"}
                            </span>
                            {this.state.dropdown === data + ":" + index && (
                              <div className="position-absolute" style={{ top: 0, right: -125, zIndex: 2000 }}>
                                <div className="card p-0 overflow-hidden">
                                  <button
                                    className="btn btn-light border-0 text-start rounded-0 wpx-120"
                                    onClick={() => {
                                      // แก้ไขการจัดการข้อมูลเพื่อให้ทำงานถูกต้อง
                                      let updatedData = [...this.state[data].data];
                                      updatedData[index].title.push({ value: "", type: "text", required: false });
                                      this.setState({ [data]: { ...this.state[data], data: updatedData }, dropdown: "" });
                                    }}
                                  >
                                    ข้อความ
                                  </button>
                                  <button
                                    className="btn btn-light border-0 text-start rounded-0 wpx-120"
                                    onClick={() => {
                                      // แก้ไขการจัดการข้อมูลเพื่อให้ทำงานถูกต้อง
                                      let updatedData = [...this.state[data].data];
                                      updatedData[index].title.push({ value: "", type: "date", required: false });
                                      this.setState({ [data]: { ...this.state[data], data: updatedData }, dropdown: "" });
                                    }}
                                  >
                                    วันที่
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`text-end ${item.visible ? "" : "bg-secondary"}`}>{toFixed(item.amount)}</td>
                    <td className={`text-center ${item.visible ? "" : "bg-secondary"}`}>
                      {/* Delete */}
                      <div
                        className="icon text-14 mx-auto d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-danger-light text-danger"
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
                              const updatedData = [...this.state[data].data];
                              updatedData.splice(index, 1);
                              this.setState({ [data]: { ...this.state[data], data: updatedData } });
                            }
                          });
                        }}
                      >
                        {"\uf1f8"}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr
                  className="bg-primary-light pointer"
                  onClick={() => {
                    const updatedData = [...this.state[data].data];
                    updatedData.push({
                      visible: true,
                      title_editable: data === "data_4" ? true : false,
                      title: [{ value: "", type: "text", required: false }],
                      amount_editable: true,
                      amount: 0.0,
                    });
                    this.setState({ [data]: { ...this.state[data], data: updatedData } });
                  }}
                >
                  <td colSpan={4} className="bg-success-light">
                    <span className="icon text-primary me-2">{"\uf055"}</span>เพิ่มรายการ
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
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
          <div className="pb-5 mb-5">
            {!this.state.tab ? (
              <div>
                {/* DATA */}
                {["data_1", "data_2", "data_3", "data_4", "data_5", "data_6"].map((data, data_index) => this.componentTable(data, data_index))}
              </div>
            ) : (
              <div>
                {/* DATA */}
                {["data_7", "data_8"].map((data, data_index) => this.componentTable(data, data_index))}
              </div>
            )}
            <h6 className="fw-bold">หมายเหตุ</h6>
            <div className="d-flex mb-2">
              <div className="icon text-24 pt-2 text-white rounded-circle wpx-20 hpx-20 d-flex align-items-center justify-content-center shadow bg-secondary me-3" style={{ top: -7, right: 14 }}>
                *
              </div>
              (Required) ไม่จำเป็นต้องกรอก
            </div>
            <div className="d-flex mb-2">
              <div className="icon text-24 pt-2 text-white rounded-circle wpx-20 hpx-20 d-flex align-items-center justify-content-center shadow bg-warning me-3" style={{ top: -7, right: 14 }}>
                *
              </div>
              (Required) จำเป็นต้องกรอก
            </div>
            <div className="d-flex mb-2">
              <div className="icon text-white rounded-circle bg-danger wpx-20 hpx-20 d-flex align-items-center justify-content-center shadow me-3">{"\uf00d"}</div>
              ลบช่องกรอกข้อมูล
            </div>
          </div>
          <div className="position-fixed w-100 bg-white p-3 d-flex justify-content-end shadow" style={{ bottom: 0, right: 0, zIndex: 10 }}>
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
                this.Update();
              }}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    );
  }
}
