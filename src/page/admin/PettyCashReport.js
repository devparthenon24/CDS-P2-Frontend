import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading, toFixed, total } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
const status = {
  pending: { name: "รอตรวจสอบ", style: "text-warning" },
  fix: { name: "แก้ไข", style: "text-danger" },
  fixed: { name: "แก้ไขแล้ว", style: "text-info" },
  approved: { name: "อนุมัติ", style: "text-success" },
};
export default class PettyCashReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_detail: false,
      modal_create: false,
      modal_export: false,

      date: "",

      data: [
        // {
        //   project_id: "", // รหัสโครงการ
        //   project_name: "", // ชื่อโครงการ
        //   month: "", // เดือน
        //   year: "", // ปี
        //   time: "", // ครั้งที่
        //   status: "pending", // สถานะ
        //   limit_withdraw: { date: "", name: "วงเงิน เงินสดย่อยที่เบิกได้", volumn_no: "", no: "", amount: "20000" }, // วงเงิน เงินสดย่อยที่เบิกได้
        //   previuse_balance: { date: "", name: "เงินสดย่อยคงเหลือที่ยกมา ครั้งก่อน", volumn_no: "", no: "", amount: "" }, // เงินสดย่อยคงเหลือที่ยกมา ครั้งก่อน
        //   cash_withdraw: { date: "", name: "เงินสดย่อยที่เบิกมา ครั้งนี้", volumn_no: "", no: "", amount: "" }, // เงินสดย่อยที่เบิกมา ครั้งนี้
        //   list_cash_spend: [
        //     {
        //        date: "",
        //        name: "",
        //        volumn_no: "",
        //        no: "",
        //        amount: [
        //          { name: "ค่าอื่นๆ", amount: "" },
        //           ],
        //        status: "pending",
        //        receipt: false,
        //        copy_id_card: false,
        //        image_slip: [] }, // status = pending, fix, fixed, approved
        //   ],

        //   
        // },
      ],
      data_expense_type: [],

      slip_image: [],
      select_image: "",
      slip_index: -1,
      data_index: -1,

      month: "",

      type_export: "",
    };
  }

  async componentDidMount() {
    loading(false);
    // await this.Get(1);
    this.GetExpenseType();
  }
  Get = async (page) => {
    loading(true);
    let body = {
      page: page,
      data_search: this.state.search,
    };
    let result = await GET("api/transaction/list", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  GetExpenseType = async () => {
    loading(true);
    let result = await GET("api/admin/expense-types/list", null);
    if (result?.status) {
      console.log("result.data:", result.data);
      let obj = this.state.data;
      for (let item of obj) {
        item.list_cash_spend = item.list_cash_spend.map((e) => {
          e.amount = result.data
            .filter((e) => e.is_active)
            .map((re) => {
              return { name: re.expense_type_name, amount: "" };
            });
          return e;
        });
      }
      this.setState({
        data_expense_type: result.data.filter((e) => e.is_active).map((e) => e.expense_type_name),
      });
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100 position-relative">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="รายงานเงินสดย่อย" />
        <div className="body px-3 pb-3 pt-0" style={{ marginBottom: 200 }}>
          <h4 className="fw-bold mb-2">รายงานเงินสดย่อย</h4>
          <div className="d-flex flex-wrap mb-2">
            <input
              type="month"
              className="form-control wpx-200 me-2 mb-2"
              placeholder="ค้นหา..."
              onChange={(e) => {
                this.setState({ date: e.target.value });
              }}
              value={this.state.date}
            />
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
              className="btn btn-warning px-4 mb-2 me-2"
              onClick={async () => {
                this.setState({ modal_export: true, type_export: "Excel" });
              }}
            >
              Export Excel
            </button>
            <button
              className="btn btn-dark px-4 mb-2"
              onClick={async () => {
                this.setState({ modal_export: true, type_export: "PDF" });
              }}
            >
              Export PDF
            </button>
            <div className="d-flex ms-auto">
              <button
                className="btn btn-success px-4 mb-2 me-2"
                onClick={async () => {
                  this.setState({ modal_create: true });
                }}
              >
                สร้างเงินสดย่อยใหม่
              </button>
            </div>
          </div>
          {this.state.data &&
            this.state.data.map((data, data_index) => (
              <div className="card rounded border-0 overflow-hidden mb-3">
                <div className="p-3">
                  <h3 className="fw-bold">
                    {data.project_name} {format_date(data.month, "mmmm", "th")} {data.year} (ครั้งที่ {data.time})
                  </h3>
                  <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                      <thead className="bg-light text-secondary">
                        <tr>
                          <th colSpan={3} className="text-center">
                            ข้อมูลการใช้จ่ายเงินสดย่อย
                          </th>
                          <th colSpan={2} className="text-center">
                            ใบสำคัญ
                          </th>
                          <th colSpan={1 + this.state.data_expense_type.length} className="text-center">
                            ประเภทการจ่าย
                          </th>
                          <th className="text-center">เงินสดย่อย</th>
                          <th className="text-center">สถานะ</th>
                          <th colSpan={3} className="text-center">
                            หมายเหตุ
                          </th>
                          <th className="text-center">ลบ</th>
                        </tr>
                        <tr>
                          <th className="text-nowrap text-center">ลำดับ</th>
                          <th className="text-nowrap text-center">วันที่</th>
                          <th className="text-nowrap">รายการค่าใช้จ่าย</th>
                          <th className="text-nowrap text-center">เล่มที่</th>
                          <th className="text-nowrap text-center">เลขที่</th>
                          {this.state.data_expense_type.map((e) => (
                            <th className="text-nowrap text-center">{e}</th>
                          ))}
                          <th className="text-nowrap text-center">ยอดรวม</th>
                          <th className="text-nowrap text-center">คงเหลือ</th>
                          <th className="text-nowrap"></th>
                          <th className="text-nowrap text-center">ใบเสร็จ</th>
                          <th className="text-nowrap text-center">สำเนาบัตร</th>
                          <th className="text-nowrap text-center wpx-80">รูปภาพสลิป</th>
                          <th className="text-nowrap"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="bg-secondary-light"></td>
                          <td className="bg-secondary-light p-0">
                            <input
                              type="date"
                              className="rounded-0 form-control wpx-120"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].limit_withdraw.date = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.limit_withdraw.date}
                            />
                          </td>
                          <td className="bg-secondary-light text-nowrap">{data?.limit_withdraw.name}</td>
                          <td className="bg-secondary-light text-center p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control wpx-120"
                              placeholder="เล่มที่"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].limit_withdraw.volumn_no = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.limit_withdraw.volumn_no}
                            />
                          </td>
                          <td className="bg-secondary-light text-center p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control wpx-120"
                              placeholder="เลขที่"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].limit_withdraw.no = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.limit_withdraw.no}
                            />
                          </td>
                          {this.state.data_expense_type.map((e) => (
                            <th className="bg-secondary-light"></th>
                          ))}
                          <td className="bg-secondary-light"></td>
                          <td className="bg-secondary-light text-end p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control w-100 text-end"
                              placeholder="คงเหลือ"
                              maxLength={8}
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].limit_withdraw.amount = e.target.value;
                                obj[data_index].cash_withdraw.amount = Number(e.target.value) - Number(obj[data_index].previuse_balance.amount);
                                this.setState({ data: obj });
                              }}
                              value={data?.limit_withdraw.amount}
                            />
                          </td>
                          {[0, 0, 0, 0, 0].map((e) => (
                            <th className="bg-secondary-light"></th>
                          ))}
                        </tr>
                        <tr>
                          <td className="bg-secondary-light"></td>
                          <td className="bg-secondary-light p-0">
                            <input
                              type="date"
                              className="rounded-0 form-control wpx-120"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].previuse_balance.date = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.previuse_balance.date}
                            />
                          </td>
                          <td className="bg-secondary-light text-nowrap">{data?.previuse_balance.name}</td>
                          <td className="bg-secondary-light text-center p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control wpx-120"
                              placeholder="เล่มที่"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].previuse_balance.volumn_no = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.previuse_balance.volumn_no}
                            />
                          </td>
                          <td className="bg-secondary-light text-center p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control wpx-120"
                              placeholder="เลขที่"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].previuse_balance.no = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.previuse_balance.no}
                            />
                          </td>
                          {this.state.data_expense_type.map((e) => (
                            <th className="bg-secondary-light"></th>
                          ))}
                          <td className="bg-secondary-light"></td>
                          <td className="bg-secondary-light text-end" title="ยกมาจากเดือนก่อน">
                            {toFixed(data?.previuse_balance.amount)}
                          </td>
                          {[0, 0, 0, 0, 0].map((e) => (
                            <th className="bg-secondary-light"></th>
                          ))}
                        </tr>
                        <tr>
                          <td className="bg-secondary-light"></td>
                          <td className="bg-secondary-light p-0">
                            <input
                              type="date"
                              className="rounded-0 form-control wpx-120"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].cash_withdraw.date = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.cash_withdraw.date}
                            />
                          </td>
                          <td className="bg-secondary-light text-nowrap">{data?.cash_withdraw.name}</td>
                          <td className="bg-secondary-light text-center p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control wpx-120"
                              placeholder="เล่มที่"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].cash_withdraw.volumn_no = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.cash_withdraw.volumn_no}
                            />
                          </td>
                          <td className="bg-secondary-light text-center p-0">
                            <input
                              type="text"
                              className="rounded-0 form-control wpx-120"
                              placeholder="เลขที่"
                              onChange={(e) => {
                                let obj = this.state.data;
                                obj[data_index].cash_withdraw.no = e.target.value;
                                this.setState({ data: obj });
                              }}
                              value={data?.cash_withdraw.no}
                            />
                          </td>
                          {this.state.data_expense_type.map((e) => (
                            <th className="bg-secondary-light"></th>
                          ))}
                          <td className="bg-secondary-light"></td>
                          <td className="bg-secondary-light text-end" title="นำค่า 2 ค่ามาลบกัน (วงเงิน เงินสดย่อยที่เบิกได้ - เงินสดย่อยคงเหลือที่ยกมา ครั้งก่อน)">
                            {toFixed(data?.cash_withdraw.amount)}
                          </td>
                          {[0, 0, 0, 0, 0].map((e) => (
                            <th className="bg-secondary-light"></th>
                          ))}
                        </tr>

                        {data?.list_cash_spend?.map((item, index) =>
                          item.status !== "approved" ? (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="p-0">
                                <input
                                  type="date"
                                  className="rounded-0 form-control wpx-120"
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].date = e.target.value;
                                    this.setState({ data: obj });
                                  }}
                                  value={item.date}
                                />
                              </td>
                              <td className="text-nowrap p-0">
                                <input
                                  type="text"
                                  className="rounded-0 form-control w-100"
                                  placeholder="รายการค่าใช้จ่าย"
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].name = e.target.value;
                                    this.setState({ data: obj });
                                  }}
                                  value={item.name}
                                />
                              </td>
                              <td className="text-center p-0">
                                <input
                                  type="text"
                                  className="rounded-0 form-control wpx-120"
                                  placeholder="เล่มที่"
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].volumn_no = e.target.value;
                                    this.setState({ data: obj });
                                  }}
                                  value={item.volumn_no}
                                />
                              </td>
                              <td className="text-center p-0">
                                <input
                                  type="text"
                                  className="rounded-0 form-control wpx-120"
                                  placeholder="เลขที่"
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].no = e.target.value;
                                    this.setState({ data: obj });
                                  }}
                                  value={item.no}
                                />
                              </td>
                              {this.state.data_expense_type.map((e, i) => (
                                <td className="text-end p-0">
                                  <input
                                    type="text"
                                    className="rounded-0 form-control w-100 text-end"
                                    placeholder={e}
                                    onChange={(e) => {
                                      let obj = this.state.data;
                                      obj[data_index].list_cash_spend[index].amount[i].amount = e.target.value;
                                      this.setState({ data: obj });
                                    }}
                                    value={item.amount[i].amount}
                                  />
                                </td>
                              ))}
                              <td className="text-end">{toFixed(total(item.amount, "amount"))}</td>
                              <td className="text-end">{toFixed(Number(data.limit_withdraw.amount) - total(data?.list_cash_spend.filter((e, i) => i <= index).map((e) => total(e.amount, "amount"))))}</td>
                              <td className="text-nowrap text-center p-0">
                                <select
                                  className={`form-control w-100 rounded-0 border-0 wpx-100 text-center ${status[item.status].style}`}
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].status = e.target.value;
                                    this.setState({ data: obj });
                                  }}
                                  value={item.status}
                                >
                                  {Object.keys(status).map((e) => (
                                    <option value={e}>{status[e].name}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="text-center text-success px-1 py-0">
                                <Switch
                                  className="mt-2"
                                  offColor="#dfdfdf"
                                  height={20}
                                  width={40}
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].receipt = e;
                                    this.setState({ data: obj });
                                  }}
                                  checked={item.receipt}
                                />
                              </td>
                              <td className="text-center text-danger px-1 py-0">
                                <Switch
                                  className="mt-2"
                                  offColor="#dfdfdf"
                                  height={20}
                                  width={40}
                                  onChange={(e) => {
                                    let obj = this.state.data;
                                    obj[data_index].list_cash_spend[index].copy_id_card = e;
                                    this.setState({ data: obj });
                                  }}
                                  checked={item.copy_id_card}
                                />
                              </td>
                              <td className="py-1 text-center">
                                <div className="d-flex justify-content-center">
                                  {item.image_slip.map((e) => (
                                    <img
                                      className="wpx-25 hpx-25 rounded-3 img-fluid mx-1 pointer"
                                      src={e}
                                      alt="slip"
                                      onClick={async () => {
                                        this.setState({ modal_detail: true, slip_image: item.image_slip, data_index: data_index, slip_index: index, select_image: item.image_slip[0] });
                                      }}
                                    />
                                  ))}
                                  {item.image_slip.length !== 2 && (
                                    <div
                                      className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-primary-light text-primary"
                                      onClick={async () => {
                                        document.getElementById("image").click();
                                        this.setState({ slip_image: [], slip_index: index });
                                      }}
                                    >
                                      {"\uf03e"}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-1">
                                {/* DELETE */}
                                {(item.status === "pending" || profile.user_type === "super_user") && (
                                  <div
                                    className="icon text-14 mx-auto d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-danger-light text-danger"
                                    onClick={async () => {
                                      if (await alert("", "warning", "ลบรายการ", "คุณต้องการลบรายการนี้หรือไม่?", "ยืนยัน", "ยกเลิก")) {
                                        let obj = this.state.data;
                                        obj[data_index].list_cash_spend.splice(index, 1);
                                        this.setState({ data: obj });
                                      }
                                    }}
                                  >
                                    {"\uf00d"}
                                  </div>
                                )}
                                {/* ถ้าไม่มีรูปแสดงเป็นสีแดง */}
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td>{item.date}</td>
                              <td className="text-nowrap">{item.name}</td>
                              <td className="text-center">{item.volumn_no}</td>
                              <td className="text-center">{item.no}</td>
                              {this.state.data_expense_type.map((e, i) => (
                                <td className="text-end">{toFixed(item.amount[i].amount)}</td>
                              ))}
                              <td className="text-end">{toFixed(total(item.amount, "amount"))}</td>
                              <td className="text-end">{toFixed(Number(data.limit_withdraw.amount) - total(data?.list_cash_spend.filter((e, i) => i <= index).map((e) => total(e.amount, "amount"))))}</td>
                              <td className={`text-nowrap text-center p-0 ${status[item.status].style}`}>
                                {profile.user_type === "super_user" ? (
                                  <select
                                    className={`form-control w-100 rounded-0 border-0 wpx-100 text-center ${status[item.status].style}`}
                                    onChange={(e) => {
                                      data.list_cash_spend[index].status = e.target.value;
                                      this.setState({ data });
                                    }}
                                    value={item.status}
                                  >
                                    {Object.keys(status).map((e) => (
                                      <option value={e}>{status[e].name}</option>
                                    ))}
                                  </select>
                                ) : (
                                  status[item.status].name
                                )}
                              </td>
                              <td className="text-center text-success px-1 py-0">
                                <Switch
                                  className="mt-2"
                                  offColor="#dfdfdf"
                                  height={20}
                                  width={40}
                                  disabled
                                  onChange={(e) => {
                                    data.list_cash_spend[index].receipt = e;
                                    this.setState({ data });
                                  }}
                                  checked={item.receipt}
                                />
                              </td>
                              <td className="text-center text-danger px-1 py-0">
                                <Switch
                                  className="mt-2"
                                  offColor="#dfdfdf"
                                  height={20}
                                  width={40}
                                  disabled
                                  onChange={(e) => {
                                    data.list_cash_spend[index].copy_id_card = e;
                                    this.setState({ data });
                                  }}
                                  checked={item.copy_id_card}
                                />
                              </td>
                              <td className="py-1 text-center">
                                <div className="d-flex justify-content-center">
                                  {item.image_slip.map((e) => (
                                    <img
                                      className="wpx-25 hpx-25 rounded-3 img-fluid mx-1 pointer"
                                      src={e}
                                      alt="slip"
                                      onClick={async () => {
                                        this.setState({ modal_detail: true, slip_image: item.image_slip, slip_index: index, select_image: item.image_slip[0] });
                                      }}
                                    />
                                  ))}
                                  {item.image_slip.length !== 2 && item.status !== "approved" && (
                                    <div
                                      className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-primary-light text-primary"
                                      onClick={async () => {
                                        document.getElementById("image").click();
                                        this.setState({ slip_image: [], slip_index: index });
                                      }}
                                    >
                                      {"\uf03e"}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="py-1">
                                {/* DELETE */}
                                {(item.status === "pending" || (profile.user_type === "super_user" && item.status !== "approved")) && (
                                  <div
                                    className="icon text-14 mx-auto d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-danger-light text-danger"
                                    onClick={async () => {
                                      if (await alert("", "warning", "ลบรายการ", "คุณต้องการลบรายการนี้หรือไม่?", "ยืนยัน", "ยกเลิก")) {
                                        data.list_cash_spend.splice(index, 1);
                                        this.setState({ data });
                                      }
                                    }}
                                  >
                                    {"\uf00d"}
                                  </div>
                                )}
                                {/* ถ้าไม่มีรูปแสดงเป็นสีแดง */}
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td colSpan={5}>รวมทั้งสิ้น</td>
                          {this.state.data_expense_type.map((e) => (
                            <td className="text-end fw-bold">{toFixed(total(data?.list_cash_spend.map((d) => d.amount.find((a) => a.name === e)?.amount || 0)))}</td>
                          ))}
                          <td className="text-end fw-bold">{toFixed(total(data?.list_cash_spend.map((d) => total(d.amount, "amount"))))}</td>
                          <td className={`text-end fw-bold ${Number(data.limit_withdraw.amount) - total(data?.list_cash_spend.map((e) => total(e.amount, "amount"))) < 0 ? "text-danger" : ""}`}>{toFixed(Number(data.limit_withdraw.amount) - total(data?.list_cash_spend.map((e) => total(e.amount, "amount"))))}</td>
                          <td className="text-end"></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        {total(data?.list_cash_spend.filter((e) => e.status === "fix").map((d) => total(d.amount, "amount"))) > 0 && (
                          <tr>
                            <td className="bg-danger-light text-end" colSpan={5 + this.state.data_expense_type.length}>
                              ยอดที่ไม่ผ่านการอนุมัติ
                            </td>
                            <td className="bg-danger text-white text-end">{toFixed(total(data?.list_cash_spend.filter((e) => e.status === "fix").map((d) => total(d.amount, "amount"))))}</td>
                            <td className="bg-danger-light" colSpan={6}></td>
                          </tr>
                        )}
                        <tr>
                          <td
                            className="bg-success-light pointer"
                            colSpan={18}
                            onClick={async () => {
                              let obj = this.state.data;
                              obj[data_index].list_cash_spend.push({
                                date: "",
                                name: "",
                                volumn_no: "",
                                no: "",
                                amount: this.state.data_expense_type.map((re) => {
                                  return { name: re.expense_type_name, amount: "" };
                                }),
                                status: "pending",
                                receipt: false,
                                copy_id_card: false,
                                image_slip: [],
                              });
                              this.setState({ data: obj });
                            }}
                          >
                            <span className="icon text-primary me-2">{"\uf055"}</span>เพิ่มรายการ
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
                        let obj = this.state.data;
                        obj[data_index].list_cash_spend[this.state.slip_index].image_slip.push(image);
                        this.setState({ data: obj });
                        e.target.value = "";
                        e.target.files = null;
                      }}
                    />
                  </div>
                  <div className="mt-3">
                    <div className="d-flex justify-content-end">
                      <div>ค่าใช้จ่ายรวมทั้งสิ้น</div>
                      <h4 className="fw-bold wpx-150 text-danger mb-0 text-end">{toFixed(total(data?.list_cash_spend.map((d) => total(d.amount, "amount"))))}</h4>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div>ยอดเงินสดย่อยคงเหลือทั้งสิ้น</div>
                      <h4 className="fw-bold wpx-150 text-success mb-0 text-end">{toFixed(Number(data.limit_withdraw.amount) - total(data?.list_cash_spend.map((e) => total(e.amount, "amount"))))}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="position-fixed w-100 bg-white p-3 d-flex justify-content-end" style={{ bottom: 0 }}>
          <button
            className="btn btn-outline-success px-4 mb-2 me-2"
            onClick={async () => {
              this.setState({ modal_create: true });
            }}
          >
            ยกเลิก
          </button>
          <button
            className="btn btn-success px-4 mb-2 me-2"
            onClick={async () => {
              this.setState({ modal_create: true });
            }}
          >
            บันทึก
          </button>
        </div>
        {/* CREATE */}
        <Modal show={this.state.modal_create} onHide={() => this.setState({ modal_create: false })}>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}ประเภทค่าใช้จ่าย</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">เดือน</div>
              <input
                type="month"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                min={new Date()}
                onChange={(e) => {
                  this.setState({ month: e.target.value });
                }}
                value={this.state.month}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1">
            <div className="w-100 d-flex">
              <button
                className="btn btn-danger w-100 me-1"
                onClick={() => {
                  this.setState({ modal_create: false });
                }}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-success w-100 ms-1"
                onClick={() => {
                  let data = this.state.data;
                  data.push({
                    project_id: "", // รหัสโครงการ
                    project_name: "", // ชื่อโครงการ
                    month: format_date(this.state.month,"mm"), // เดือน
                    year: format_date(this.state.month,"yyyy","th"), // เดือน
                    time: this.state.data.filter((e) => e.month === format_date(this.state.month,"mm") && e.year ===  format_date(this.state.month,"yyyy","th")).length + 1, // ครั้งที่
                    limit_withdraw: { date: "", name: "วงเงิน เงินสดย่อยที่เบิกได้", volumn_no: "", no: "", amount: "" }, // วงเงิน เงินสดย่อยที่เบิกได้
                    previuse_balance: { date: "", name: "เงินสดย่อยคงเหลือที่ยกมา ครั้งก่อน", volumn_no: "", no: "", amount: "" }, // เงินสดย่อยคงเหลือที่ยกมา ครั้งก่อน
                    cash_withdraw: { date: "", name: "เงินสดย่อยที่เบิกมา ครั้งนี้", volumn_no: "", no: "", amount: "" }, // เงินสดย่อยที่เบิกมา ครั้งนี้
                    list_cash_spend: [],
                    // status = pending, fix, fixed, approved
                  });
                  this.setState({ modal_create: false });
                }}
              >
                บันทึก
              </button>
            </div>
          </Modal.Footer>
        </Modal>
        {/* EXPORT */}
        <Modal show={this.state.modal_export} onHide={() => this.setState({ modal_export: false })}>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">Export {this.state.type_export}</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">เดือนเริ่มต้น</div>
              <input
                type="month"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                min={new Date()}
                onChange={(e) => {
                  this.setState({ month: e.target.value });
                }}
                value={this.state.month}
              />
            </div>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">เดือนสิ้นสุด</div>
              <input
                type="month"
                className="form-control"
                placeholder="กรอกข้อมูล..."
                min={new Date()}
                onChange={(e) => {
                  this.setState({ month: e.target.value });
                }}
                value={this.state.month}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1">
            <div className="w-100 d-flex">
              <button
                className="btn btn-danger w-100 me-1"
                onClick={() => {
                  this.setState({ modal_export: false });
                }}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-success w-100 ms-1"
                onClick={() => {
                  this.setState({ modal_export: false });
                }}
              >
                Export {this.state.type_export}
              </button>
            </div>
          </Modal.Footer>
        </Modal>
        {/* VIEW */}
        <Modal show={this.state.modal_detail} size="lg">
          <Modal.Header>
            <h4 className="fw-bold mb-0">รูปภาพ</h4>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="w-100 d-flex justify-content-center p-3 bg-secondary-light">
              <img className="w-100 hpx-350 rounded-3 img-fluid mx-1 pointer" src={this.state.select_image} alt="slip" style={{ objectFit: "contain" }} />
            </div>
            <div className="d-flex justify-content-center flex-wrap bg-secondary-light pb-3">
              {this.state.slip_image.map((e, i) => (
                <div className="wpx-60 hpx-60 rounded-3 border position-relative mx-2">
                  <img
                    className="wpx-60 hpx-60 rounded-3 img-fluid pointer"
                    src={e}
                    alt="slip"
                    onClick={() => {
                      this.setState({ select_image: e });
                    }}
                  />
                  {this.state.data[this.state.data_index].list_cash_spend[this.state.slip_index]?.status !== "approved" && (
                    <span
                      className="wpx-20 hpx-20 rounded-circle bg-danger pointer text-white text-20 position-absolute icon d-flex align-items-center justify-content-center shadow"
                      style={{ right: -12, top: -12 }}
                      onClick={async () => {
                        if (await alert("", "warning", "ลบรายการ", "คุณต้องการลบรายการนี้หรือไม่?", "ยืนยัน", "ยกเลิก")) {
                          let obj = this.state.data;
                          obj[this.state.data_index].list_cash_spend[this.state.slip_index].image_slip.splice(i, 1);
                          let slip_image = this.state.slip_image;
                          slip_image.splice(i, 1);
                          this.setState({ data: obj, slip_image: slip_image, modal_detail: slip_image.length === 0 ? false : true });
                        }
                      }}
                    >
                      {"\uf00d"}
                    </span>
                  )}
                </div>
              ))}
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
