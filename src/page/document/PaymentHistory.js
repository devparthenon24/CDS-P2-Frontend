import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, project, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, total, toFixed, loading } from "../../components/CustomComponent.js";

import THBText from "thai-baht-text";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import LOGO from "../../assets/images/logo.png";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
import "../../assets/css/pdf.css";
const size = {
  A4: { width: 1116, height: 1578 },
  A5: { width: 1116, height: 1578, zoom: 0.5 },
  "4.5 x 5.5 นิ้ว": { width: 1116, height: 1371, zoom: 0.385 },
  "9 x 11 นิ้ว": { width: 1116, height: 1371, zoom: 0.77 },
  "9 x 5.5 นิ้ว": { width: 1116, height: 685, zoom: 0.77 },
};
export default class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      setting: project?.setting?.receipt ||{
        size: "", // A4, A5, 4.5 x 5.5 นิ้ว, 9 x 11 นิ้ว, 9 x 5.5 นิ้ว
        header_1: { status: true, title: "-โลโก้" },
        header_2: { status: true, title: "" }, // โครงการ
        header_3: { status: true, title: "" }, // ที่อยู่
        header_4: { status: true, title: "-ใบเสร็จรับเงิน" },
        header_5: { status: true, title: "-เลขที่" },
        header_6: { status: true, title: "-วันที่" },
        header_7: { status: true, title: "-ได้รับเงินจาก" },
        header_8: { status: true, title: "-ที่อยู่" },
        header_9: { status: true, title: "-ชำระโดย" },
        header_10: { status: true, title: "-วันที่" },

        th_1: { status: true, title: "-ลำดับ" },
        th_2: { status: true, title: "-รายการ" },
        th_3: { status: true, title: "-เลขมาตรจดครั้งนี้" },
        th_4: { status: true, title: "-เลขมาตรจดครั้งก่อน" },
        th_5: { status: true, title: "-จำนวนหน่วยที่ใช้" },
        th_6: { status: true, title: "-รวมเป็นเงิน" },

        tr_1: { status: true, title: "-ค่าน้ำประปา" },
        tr_2: { status: true, title: "-ค่าบริการรักษาอุปกรณ์น้ำ" },
        tr_3: { status: true, title: "-ค่าบริการจัดเก็บขยะ" },
        tr_4: { status: true, title: "-ค่าใช้จ่ายส่วนกลาง" },
        tr_5: { status: true, title: "-ค้างชำระ" },
        tr_6: { status: true, title: "-อื่นๆ" },
        tr_6_1: { status: true, title: "-ค่าต่อกลับมิเตอร์" },
        tr_6_2: { status: true, title: "-ค่าปรับล่าช้า" },
        tr_6_3: { status: true, title: "-ค่าเบี้ยประกัน" },
        tr_6_4: { status: true, title: "-ค่าบริการเคเบิล" },
        tr_6_5: { status: true, title: "" }, // ค่าอื่นๆ
        tr_7: { status: true, title: "-รายการลดหนี้" },
        tr_8: { status: true, title: "-รายการเพิ่มหนี้" },

        tr_9: { status: true, title: "-รวมเป็นเงิน" },
        tr_10: { status: true, title: "-ปรับปรุงยอดเงิน" },
        tr_11: { status: true, title: "-รวมเป็นเงินทั้งสิ้น" },

        footer_1: { status: true, title: "-จำนวนเงิน (ตัวอักษร)" },
        footer_2: { status: true, title: "" }, // หมายเหตุ
        footer_3: { status: true, title: "-ลงชื่อ" },
        footer_4: { status: true, title: "" }, // ชื่อผู้รับเงิน
        footer_5: { status: true, title: "" }, // ตำแหน่งผู้รับเงิน
      },
    };
  }

  async componentDidMount() {
    let result = await GET("api/admin/payment-history/list", { page: 0, record_receipt_id: window.location.href.split("?id=")[1] || "" });
    this.setState({ data: {...result.data,total:
      (result.data.s_fire_cost ? result.data.fire_cost : 0) +
      (result.data.s_add_debt ? result.data.add_debt : 0) +
      (result.data.s_cable_cost ? result.data.cable_cost : 0) +
      (result.data.s_common_expenses ? result.data.common_expenses : 0) +
      (result.data.s_equipment_maintenance_fee ? result.data.equipment_maintenance_fee : 0) +
      (result.data.s_late_payment ? result.data.late_payment : 0) +
      (result.data.s_meter_connect_cost ? result.data.meter_connect_cost : 0) +
      (result.data.s_other_income ? result.data.other_income : 0) +
      (result.data.s_waste_cost ? result.data.waste_cost : 0) +
      (result.data.s_water_bill ? result.data.water_bill : 0) +
      result.data.add_on_add_debt -((result.data.s_reduce_debt ? result.data.reduce_debt : 0) + result.data.add_on_reduce_debt),} });
    console.log(result.data)
    const array = Object.entries(this.state.setting);
    for (let item of array) {
      if (!item[1].status) {
        try {
          let component = document.getElementsByClassName(item[0]);
          for (let co of component) {
            co.classList.add("d-none");
          }
        } catch (e) {}
      }
    }
    if (!this.state.setting.header_1.status && !this.state.setting.header_2.status && !this.state.setting.header_3.status && !this.state.setting.header_5.status && !this.state.setting.header_6.status) {
      document.getElementsByClassName("header_1_2_3_4_5_6")[0].classList.add("d-none");
    }
    if (!this.state.setting.header_5.status && !this.state.setting.header_6.status) {
      document.getElementsByClassName("header_5_6")[0].classList.add("d-none");
    }
    if (!this.state.setting.header_7.status && !this.state.setting.header_8.status && !this.state.setting.header_9.status && !this.state.setting.header_10.status) {
      document.getElementsByClassName("header_7_8_9_10")[0].classList.add("d-none");
    }

    loading(false);
    // setTimeout(() => {
    //   window.print();
    // }, 100);
  } 
  render() {
    return (
      <div className="w-100">
          <div className={"mx-auto bg-white border-bottom p-3 " + (this.state.setting.size === "9 x 5.5 นิ้ว" ? "pdf-small" : "pdf")} style={size[this.state.setting?.size || "A4"]}>
            <table className="table table-bordered mb-0 header">
              <tr className="border-bottom-0 header_1_2_3_4_5_6">
                <td rowSpan={2}>
                  <div className="d-flex align-items-center">
                    <img src={project?.picture_paper || LOGO} style={{ width: 100, height: 100, objectFit: "contain", marginRight: 6 }} alt="LOGO" className="bg-contain header_1" />
                    <div>
                      <h2 className="fw-bold header_2 px-2 mb-0">{this.state.setting.header_2?.title || project?.project_name}</h2>
                      <div className="header_3 px-2">{this.state.setting.header_3?.title || ""}</div>
                    </div>
                  </div>
                </td>
                <td className="wpx-250 text-center border-bottom-0 header_4">
                  <h2 className="fw-bold mb-0">ใบเสร็จรับเงิน</h2>
                </td>
              </tr>
              <tr className="header_5_6">
                <td className="border-bottom-0 wpx-250">
                  <div className="header_5">เลขที่ : {this.state.data?.iw_number}</div>
                  <div className="header_6">วันที่ : {this.state.data?.record_date ? format_date(this.state.data?.record_date) : ""}</div>
                </td>
              </tr>
              <tr className="header_7_8_9_10">
                <td className="border-bottom-0">
                  <div className="header_7">ได้รับเงินจาก : {this.state.data?.full_name}</div>
                  <div className="header_8">ที่อยู่ : {this.state.data?.address || "-"}</div>
                </td>
                <td className="border-bottom-0 wpx-250">
                  <div className="header_9">ชำระโดย : {this.state.data?.payment_type === '1' ? "เงินสด" : "โอนเงินเข้าบัญชีนิติฯ"}</div>
                  <div className="header_10">วันที่ : {this.state.data?.transfer_date ? format_date(this.state.data?.transfer_date) : ""}</div>
                </td>
              </tr>
            </table>
            <table className="table table-bordered mb-0">
              <tr>
                <td className="text-center wpx-50 th_1">ลำดับ</td>
                <td className="th_2 w-100">รายการ</td>
                <td className="th_3">
                  <div className="text-nowrap mx-1">
                    เลขมาตรจดครั้งนี้
                    <br />
                    วันที่ {format_date(this.state.data?.record_date)}
                  </div>
                </td>
                <td className="th_4">
                  <div className="text-nowrap mx-1">
                    เลขมาตรจดครั้งก่อน
                    <br />
                    วันที่ {format_date(new Date(new Date(this.state.data?.record_date).setMonth(new Date(this.state.data?.record_date).getMonth() - 1)))}
                  </div>
                </td>
                <td className="text-center wpx-130 th_5">จำนวนหน่วยที่ใช้</td>
                <td className="text-center wpx-120 th_6">รวมเป็นเงิน</td>
              </tr>
              <tr className="tr_1">
                <td className="text-center th_1">1</td>
                <td className="border-right-0 w-100 th_2">ค่าน้ำประปา ประจำเดือน {format_date(this.state.data?.record_date, "mmmm yyyy")}</td>
                <td className="text-end th_3">{this.state.data?.current_gauge_number}</td>
                <td className="text-end th_4">{this.state.data?.last_gauge_number}</td>
                <td className="text-end th_5">{this.state.data?.unit_used}</td>
                <td className="text-end th_6">{toFixed(this.state.data?.water_bill)}</td>
              </tr>
              <tr className="tr_2">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">ค่าบริการรักษาอุปกรณ์น้ำ</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.equipment_maintenance_fee)}</td>
              </tr>
              <tr className="tr_3">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">ค่าบริการจัดเก็บขยะ</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.waste_cost)}</td>
              </tr>
              <tr className="tr_4">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">ค่าใช้จ่ายส่วนกลาง ประจำเดือน {format_date(new Date(this.state.data?.record_date).setMonth(new Date(this.state.data?.record_date).getMonth() + 1), "mmmm yyyy")}</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.common_expenses)}</td>
              </tr>
              <tr className="tr_5">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">ค้างชำระจำนวน {this.state.data?.water_list?.length ? this.state.data?.water_list?.length - 1 : 0} งวด</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.water_list_price)}</td>
              </tr>
              <tr className="tr_6">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">อื่นๆ</td>
                <td className="border-left-0 border-right-0 text-end th_3"> </td>
                <td className="border-left-0 border-right-0 text-end th_4"> </td>
                <td className="border-left-0 border-right-0 text-end th_5"> </td>
                <td className="text-end th_6"> </td>
              </tr>
              <tr className="tr_6_1">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0)}.1.</td>
                <td className="border-right-0 w-100 th_2">ค่าต่อกลับมิเตอร์</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.meter_connect_cost)}</td>
              </tr>
              <tr className="tr_6_2">
                <td className="text-center th_1">
                  {(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0)}.{(this.state.setting.tr_6_1.status ? 1 : 0) + (this.state.setting.tr_6_2.status ? 1 : 0)}.
                </td>
                <td className="border-right-0 w-100 th_2">ค่าปรับล่าช้า</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.late_payment)}</td>
              </tr>
              <tr className="tr_6_3">
                <td className="text-center th_1">
                  {(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0)}.{(this.state.setting.tr_6_1.status ? 1 : 0) + (this.state.setting.tr_6_2.status ? 1 : 0) + (this.state.setting.tr_6_3.status ? 1 : 0)}.
                </td>
                <td className="border-right-0 w-100 th_2">ค่าเบี้ยประกัน</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.fire_cost)}</td>
              </tr>
              <tr className="tr_6_4">
                <td className="text-center th_1">
                  {(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0)}.{(this.state.setting.tr_6_1.status ? 1 : 0) + (this.state.setting.tr_6_2.status ? 1 : 0) + (this.state.setting.tr_6_3.status ? 1 : 0) + (this.state.setting.tr_6_4.status ? 1 : 0)}.
                </td>
                <td className="border-right-0 w-100 th_2">ค่าบริการเคเบิล</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.cable_cost)}</td>
              </tr>
              <tr className="tr_6_5">
                <td className="text-center th_1">
                  {(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0)}.{(this.state.setting.tr_6_1.status ? 1 : 0) + (this.state.setting.tr_6_2.status ? 1 : 0) + (this.state.setting.tr_6_3.status ? 1 : 0) + (this.state.setting.tr_6_4.status ? 1 : 0) + (this.state.setting.tr_6_5.status ? 1 : 0)}.
                </td>
                <td className="border-right-0 w-100 th_2">{this.state.setting?.tr_6_5.title || "ค่าอื่นๆ"}</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.other_income)}</td>
              </tr>
              <tr className="tr_7">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0) + (this.state.setting.tr_7.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">รายการลดหนี้</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">-{toFixed(this.state.data?.reduce_debt + this.state.data?.add_on_reduce_debt)}</td>
              </tr>
              <tr className="tr_8">
                <td className="text-center th_1">{(this.state.setting.tr_1.status ? 1 : 0) + (this.state.setting.tr_2.status ? 1 : 0) + (this.state.setting.tr_3.status ? 1 : 0) + (this.state.setting.tr_4.status ? 1 : 0) + (this.state.setting.tr_5.status ? 1 : 0) + (this.state.setting.tr_6.status ? 1 : 0) + (this.state.setting.tr_7.status ? 1 : 0) + (this.state.setting.tr_8.status ? 1 : 0)}</td>
                <td className="border-right-0 w-100 th_2">รายการเพิ่มหนี้</td>
                <td className="border-left-0 border-right-0 text-end th_3"></td>
                <td className="border-left-0 border-right-0 text-end th_4"></td>
                <td className="border-left-0 border-right-0 text-end th_5"></td>
                <td className="text-end th_6">{toFixed(this.state.data?.add_debt + this.state.data?.add_on_add_debt)}</td>
              </tr>
            </table>
            <table className="table table-bordered mb-0">
              <tr>
                <td colSpan={(this.state.setting.th_1.status ? 1 : 0) + (this.state.setting.th_2.status ? 1 : 0) + (this.state.setting.th_3.status ? 1 : 0) + (this.state.setting.th_4.status ? 1 : 0)} rowSpan={3} className="border-0">
                  <div className="d-flex">
                    <div className="w-100">
                      <div className="w-100 d-flex position-relative mt-3 text-nowrap footer_1">
                        จำนวนเงิน (ตัวอักษร)
                        <div className="w-100 overflow-hidden pl-1 position-relative">
                          ..............................................................................................
                          <span className="position-absolute" style={{ left: 6, bottom: 4 }}>
                            {THBText(this.state.data?.total + this.state.data?.change_satang || 0)}
                          </span>
                        </div>
                      </div>
                      <div className="footer_2 text-wrap" style={{ maxWidth: 490 }}>
                        {this.state.setting?.footer_2.title}
                      </div>
                    </div>
                    <div className="text-center">
                      <br />
                      <br />
                      <div className="text-nowrap footer_3">ลงชื่อ......................................................................ผู้รับเงิน</div>
                      <div className="footer_4">({this.state.setting?.footer_4.title})</div>
                      <div className="footer_5">{this.state.setting?.footer_5.title}</div>
                    </div>
                  </div>
                </td>
                <td className="text-end border-top-0 wpx-130 pr-1 border-0 tr_9">รวมเป็นเงิน</td>
                <td className="text-end border-top-0 wpx-120 tr_9">{toFixed(this.state.data?.total)}</td>
              </tr>
              <tr className="tr_10">
                <td className="text-end border-top-0 wpx-130 pr-1 border-0">ปรับปรุงยอดเงิน</td>
                <td className="text-end border-top-0 wpx-120">{toFixed(this.state.data?.change_satang)}</td>
              </tr>
              <tr className="tr_11">
                <td className="text-end border-top-0 wpx-130 pr-1 border-0">รวมเป็นเงินทั้งสิ้น</td>
                <td className="text-end border-top-0 wpx-120">{toFixed(this.state.data?.total + this.state.data?.change_satang)}</td>
              </tr>
            </table>
          </div>
      </div>
    );
  }
}
