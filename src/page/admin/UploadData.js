import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, toFixed, loading } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
export default class UploadData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      count: 0,
      date: "",

      data: null,
      tab: 1,
    };
  }

  async componentDidMount() {
    loading(false);
  }
  CreateUpdate = async () => {
    console.log("DATA:", this.state.data);
    loading(true);
    let body = this.state.data;
    let result = await POST("api/admin/upload-data", body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="อัพโหลดไฟล์ข้อมูล" />
        <div className="body px-3 pb-3 pt-0">
          {!this.state.data ? (
            <div className="w-100">
              <h4 className="fw-bold mb-2">อัพโหลดไฟล์ข้อมูล</h4>
              <input
                hidden
                id="file"
                type="file"
                onChange={async (e) => {
                  loading(true);
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const fileContent = event.target.result;
                      let text = fileContent.replaceAll("%5F%", "_").replaceAll("%5D%", "]").replaceAll("%5B%", "[").replaceAll("%3A%", ":").replaceAll("%7D%", "}").replaceAll("%7B%", "{").replaceAll("%22%", '"').replaceAll("%2C%", ",");
                      console.log(JSON.parse(text));
                      this.setState({ data: JSON.parse(text) });
                      loading(false);
                    };
                    reader.onerror = (error) => {
                      loading(false);
                      console.error("Error reading file:", error);
                    };
                    reader.readAsText(file);
                  } else {
                    loading(false);
                    console.log("No file selected");
                  }
                }}
              />
              <div
                className="select-image w-100 py-5 d-flex align-items-center justify-content-center border-secondary bg-contain border-2 border-dash rounded-3 pointer"
                onClick={() => {
                  document.getElementById("file").click();
                }}
              >
                <div className="text-center text-secondary py-5">
                  <span className="icon text-48">{"\uf15b"}</span>
                  <h5>อัพโหลดไฟล์ข้อมูล</h5>
                  <label>รองรับรูปแบบไฟล์ TXT และขนาดไฟล์ไม่เกิน 50 เมกะไบท์</label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                  <h4 className="fw-bold mb-2">อัพโหลดไฟล์ข้อมูล</h4>
                <hr/>
                <h4 className="fw-bold">ข้อมูลโครงการ</h4>
                <div className="row">
                  <div className="col-6 col-sm-4 col-md-2 mx-auto mb-3">
                  <img alt="logo" src={this.state.data?.data_project?.picture} className="w-100"/>
                  </div>
                  <div className="col-12 col-md-10">
                  <div className="row">
                  <div className="col-12 col-sm-6 d-flex mb-2">
                    <div className="fw-bold wpx-100">ชื่อโครงการ</div>
                    <span>{this.state.data?.data_project?.project_name}</span>
                  </div>
                  <div className="col-12 col-sm-6 d-flex mb-2">
                    <div className="fw-bold wpx-100">เบอร์โทรศัพท์</div>
                    <span>{this.state.data?.data_project?.phone_number}</span>
                  </div>
                  <div className="col-12 col-sm-6 d-flex mb-2">
                    <div className="fw-bold wpx-100">เลขที่ผู้เสียภาษี</div>
                    <span>{this.state.data?.data_project?.tax_number}</span>
                  </div>
                  <div className="col-12 col-sm-6 d-flex mb-2">
                    <div className="fw-bold wpx-100">ที่อยู่</div>
                    <span>
                      {this.state.data?.data_project?.address_detail} ตำบล {this.state.data?.data_project?.address_obj?.SUB_DISTRICT} อำเภอ {this.state.data?.data_project?.address_obj?.DISTRICT} จังหวัด {this.state.data?.data_project?.address_obj?.PROVINCE} {this.state.data?.data_project?.address_obj?.ZIPCODE}
                    </span>
                  </div>
                </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between flex-wrap">
              <h4 className="fw-bold mb-3">{this.state.tab === 1
?"ข้อมูลน้ำ":
this.state.tab === 2
?"ข้อมูลบิล":
this.state.tab === 3
?"ข้อมูลลูกบ้าน":""}</h4>
                    <div className="border rounded-3 border-success mb-2 me-2" style={{ padding: 1, height: 38 }}>
                      <button className={this.state.tab === 1 ? "btn btn-success wpx-110 mb-0" : "btn btn-outline-success border-0 wpx-110 mb-0"} onClick={() => this.setState({ tab: 1 })}>
                        ข้อมูลน้ำ
                      </button>
                      <button className={this.state.tab === 2 ? "btn btn-success wpx-110 mb-0" : "btn btn-outline-success border-0 wpx-110 mb-0"} onClick={() => this.setState({ tab: 2 })}>
                        ข้อมูลบิล
                      </button>
                      <button className={this.state.tab === 3 ? "btn btn-success wpx-110 mb-0" : "btn btn-outline-success border-0 wpx-110 mb-0"} onClick={() => this.setState({ tab: 3 })}>
                        ข้อมูลลูกบ้าน
                      </button>
                  </div>
                </div>
                   
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
                      {this.state.tab !== 3 && (
                        <div className="wpx-200 me-2 mb-2">
                          <DatePicker
                            className="form-control"
                            onChange={(e) => {
                              this.setState({ date: e });
                            }}
                            value={this.state.date}
                          />
                        </div>
                      )}
                    </div>
              {this.state.tab === 1 && (
                <div className="card rounded border-0 overflow-hidden">
                  <div className="p-2">จำนวนทั้งสิ้น {this.state.data?.data_water.length || 0} รายการ</div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light text-secondary">
                        <tr>
                          <th className="wpx-50 text-center">ลำดับ</th>
                          <th className="text-nowrap">บ้านเลขที่</th>
                          <th className="text-nowrap">ชื่อ - สกุล</th>
                          <th className="text-nowrap">วันที่ออกบิล</th>
                          <th className="text-nowrap">เลขมาตร</th>
                          <th className="text-nowrap">จำนวนหน่วยที่ใช้</th>
                          <th className="text-nowrap">ค่าน้ำประปา</th>
                          <th className="text-nowrap">ค่ารักษาอุปกรณ์</th>
                          <th className="text-nowrap">ค่าส่วนกลาง</th>
                          <th className="text-nowrap">ค่าขยะ</th>
                          <th className="text-nowrap">ค่าเคเบิล</th>
                          <th className="text-nowrap">ค่าเบี้ยประกัน</th>
                          <th className="text-nowrap">ค่าปรับล่าช้า</th>
                          <th className="text-nowrap">ค่าใช้จ่ายอื่นๆ</th>
                          <th className="text-nowrap">เพิ่ม/ลดหนี้</th>
                          <th className="text-nowrap">รวม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data?.data_water
                          .filter((item) => !this.state.search || (item.address_number + item.full_name).includes(this.state.search))
                          .map((item, index) => (
                            <tr key={"table_" + index}>
                              <td>{index + 1}</td>
                              <td>{item.address_number || ""}</td>
                              <td>{item.full_name || ""}</td>
                              <td>{format_date(item.datetime_create) || ""}</td>
                              <td>{item.current_gauge_number || ""}</td>
                              <td>{item.unit_used || 0}</td>
                              <td>{toFixed(item.water_bill) || "0.00"}</td>
                              <td>{toFixed(item.equipment_maintenance_fee) || "0.00"}</td>
                              <td>{toFixed(item.common_expenses) || "0.00"}</td>
                              <td>{toFixed(item.waste_cost) || "0.00"}</td>
                              <td>{toFixed(item.cable_cost) || "0.00"}</td>
                              <td>{toFixed(item.fire_cost) || "0.00"}</td>
                              <td>{toFixed(item.total_cost_late) || "0.00"}</td>
                              <td>{toFixed(item.other_income) || "0.00"}</td>
                              <td>{toFixed(item.add_debt - item.reduce_debt) || "0.00"}</td>
                              <td>{toFixed(item.total_amount) || "0.00"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {this.state.tab === 2 && (
                <div className="card rounded border-0 overflow-hidden">
                  <div className="p-2">จำนวนทั้งสิ้น {this.state.data?.data_receipt.length || 0} รายการ</div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light text-secondary">
                        <tr>
                          <th className="wpx-50 text-center">ลำดับ</th>
                          <th>บ้านเลขที่</th>
                          <th>ชื่อ - สกุล</th>
                          <th>วันที่ออกบิล</th>
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
                        {this.state.data?.data_receipt
                          .filter((item) => !this.state.search || (item.address_number + item.full_name).includes(this.state.search))
                          .map((item, index) => (
                            <tr key={"table_" + index}>
                              <td>{index + 1}</td>
                              <td>{item.address_number || ""}</td>
                              <td>{item.full_name || ""}</td>
                              <td>{format_date(item.record_date) || ""}</td>
                              <td>{item.sum_unit_used || 0}</td>
                              <td>{item.s_water_bill ? toFixed(item.water_bill) : "0.00"}</td>
                              <td>{item.s_equipment_maintenance_fee ? toFixed(item.equipment_maintenance_fee) : "0.00"}</td>
                              <td>{item.s_common_expenses ? toFixed(item.common_expenses) : "0.00"}</td>
                              <td>{item.s_waste_cost ? toFixed(item.waste_cost) : "0.00"}</td>
                              <td>{item.s_cable_cost ? toFixed(item.cable_cost) : "0.00"}</td>
                              <td>{item.s_fire_cost ? toFixed(item.fire_cost) : "0.00"}</td>
                              <td>{item.s_late_payment ? toFixed(item.total_cost_late) : "0.00"}</td>
                              <td>{item.s_other_income ? toFixed(item.other_income) : "0.00"}</td>
                              <td>{item.s_add_debt && item.s_reduce_debt ? toFixed(item.add_debt - item.reduce_debt) : "0.00"}</td>
                              <td>{toFixed(item.total_amount) || "0.00"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {this.state.tab === 3 && (
                <div className="card rounded border-0 overflow-hidden">
                  <div className="p-2">จำนวนทั้งสิ้น {this.state.data?.data_customer.length || 0} รายการ</div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light text-secondary">
                        <tr>
                          <th className="wpx-50 text-center">ลำดับ</th>
                          <th>ชื่อ - นามสกุล</th>
                          <th>บ้านเลขที่</th>
                          <th>อาคาร</th>
                          <th>ชั้น</th>
                          <th>เบอร์โทรศัพท์</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data?.data_customer
                          .filter((item) => !this.state.search || (item.address_number + item.full_name).includes(this.state.search))
                          .map((item, index) => (
                            <tr key={"table_" + index}>
                              <td>{index + 1}</td>
                              <td>{item.full_name || ""}</td>
                              <td>{item.address_number || ""}</td>
                              <td>{item.building || ""}</td>
                              <td>{item.floor || ""}</td>
                              <td>{item.mobile_phone || ""}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="w-100 d-flex justify-content-end mt-2">
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
                    this.CreateUpdate();
                  }}
                >
                  บันทึก
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
