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
export default class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      search: "",
      count: 0,
      start_date: "",
      end_date: "",

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
data_search: this.state.search
};
    let result = await GET("api/admin/payment-history/list", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="รายการประวัติการชำระ" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">รายการประวัติการชำระ</h4>
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
                    <th className="text-nowrap">บ้านเลขที่</th>
                    <th className="text-nowrap">ชื่อ - สกุล</th>
                    <th className="text-nowrap">วันที่ออกบิล</th>
                    <th className="text-end text-nowrap">เลขมาตร</th>
                    <th className="text-end text-nowrap">จำนวนหน่วยที่ใช้</th>
                    <th className="text-end text-nowrap">ค่าน้ำประปา</th>
                    <th className="text-end text-nowrap">ค่ารักษาอุปกรณ์</th>
                    <th className="text-end text-nowrap">ค่าส่วนกลาง</th>
                    <th className="text-end text-nowrap">ค่าขยะ</th>
                    <th className="text-end text-nowrap">ค่าเคเบิล</th>
                    <th className="text-end text-nowrap">ค่าเบี้ยประกัน</th>
                    <th className="text-end text-nowrap">ค่าปรับล่าช้า</th>
                    <th className="text-end text-nowrap">ค่าใช้จ่ายอื่นๆ</th>
                    <th className="text-end text-nowrap">เพิ่ม/ลดหนี้</th>
                    <th className="text-end text-nowrap">รวม</th>
                    <th>พิมพ์</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.address_number || ""}</td>
                      <td className="text-nowrap">{item.full_name || ""}</td>
                      <td>{item.record_date ? format_date(item.record_date):""}</td>
                      <td className="text-end">{item.current_gauge_number || "0"}</td>
                      <td className="text-end">{item.unit_used || "0"}</td>
                      <td className="text-end">{toFixed(item.water_bill) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.equipment_maintenance_fee) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.common_expenses) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.waste_cost) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.cable_cost) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.fire_cost) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.total_cost_late) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.other_income) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.add_debt - item.reduce_debt) || "0.00"}</td>
                      <td className="text-end">{toFixed(item.total_amount) || "0.00"}</td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-cyan-light text-primary"
                            onClick={async () => {
                              window.open("/document/payment-history?id="+item.record_receipt_id, "_blank");
                            }}
                          >
                            {"\uf02f"}
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
      </div>
    );
  }
}
