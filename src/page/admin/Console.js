import LOGO from "../../assets/images/logo.png";
import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import {
  profile,
  alert,
  total,
  float,
  toFixed,
  number_zero,
  format_date,
  random_charactor,
  GET,
  POST,
  PUT,
  DELETE,
  loading,
  Status,
  DatePicker,
  Select,
  Table,

  Switch,
  Navbar,
  Modal,
  Resizer
 } from "../../components/CustomComponent.js";
export default class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,

      search: "",
      count: 0,

      data: [],
    };
  }
  componentDidMount() {
    loading(false);
    if (localStorage.getItem("accTk")) {
      window.location.href = "/template";
    }
    this.Get(1);
  }
  Get = async (page) => {
    loading(true);
    let result = await GET("api/admin/console/list", null);
    if (result?.status) {
      this.setState({ data: result.data });
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100 background">
        {this.state.menu && (
          <div
            className="position-fixed w-100 min-vh-100"
            style={{ zIndex: 2000 }}
            onClick={() => {
              this.setState({ menu: false });
            }}
          ></div>
        )}
        <div className="container py-3">
          <div className="d-flex justify-content-between mb-4">
            <img alt="example" src={LOGO} width={100} style={{ objectFit: "contain" }} />
            <div className="d-flex align-items-center bg-white py-1 px-1" style={{ borderRadius: 26 }}>
              <div className="bg-success-light text-success wpx-40 hpx-40 d-flex justify-content-center align-items-center rounded-circle me-3">{profile.full_name?.slice(0, 2).toUpperCase() || "US"}</div>
              <div className="me-3">
                <div className="fw-bold">{ profile?.full_name || "fisrtname lastname"}</div>
                <small className="me-2">{ profile?.email || "example@email.com"}</small>
              </div>
              <span
                className="icon pointer text-24 me-2"
                onClick={() => {
                  this.setState({ menu: true });
                }}
              >
                {"\uf107"}
              </span>
              {this.state.menu && (
                <div className="position-relative" style={{ width: 0, zIndex: 2001 }}>
                  <div className="position-absolute bg-white shadow rounded" style={{ right: 0, top: 32 }}>
                    <button className="btn btn-outline-success border-0 wpx-200 text-start" onClick={() => {}}>
                      <span className="icon me-2">{"\uf007"}</span>โปรไฟล์
                    </button>
                    <button
                      className="btn btn-outline-danger border-0 wpx-200 text-start"
                      onClick={async () => {
                        this.setState({ menu: false });
                        if (await alert("","warning", "ออกจากระบบ", "ยืนยันการออกจากระบบหรือไม่?", "ออกจากระบบ","ยกเลิก")) {
                          localStorage.clear();
                          window.location.href = "/";
                        }
                      }}
                    >
                      <span className="icon me-2">{"\uf2f5"}</span>ออกจากระบบ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center flex-wrap mb-3">
            <input
              type="text"
              className="form-control wpx-200 me-2 mb-2"
              placeholder="ค้นหา..."
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
          </div>
          <div className="row">
            <div
                className="col-12 col-sm-6 col-md-4 col-xl-3 mb-3 pointer console-hover"
                onClick={() => {
                  window.location.href = "/admin/expenses";
                }}
              >
                <div className="card rounded border-0 shadow p-0 overflow-hidden position-relative select-project">
                  <div className="card-header p-0 d-none d-sm-flex bg-success-light hpx-170 align-items-center justify-content-center border-0">
                    <h1 className="text-success text-48">ADMIN</h1>
                  </div>
                  <div className="card-body p-3">
                    <h5>เมนูสำหรับผู้ดูแลระบบ</h5>
                    <small>เข้าสู่หน้าจัดการข้อมูล</small>
                  </div>
                </div>
              </div>
            {this.state.data.map((item, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-xl-3 mb-3 pointer console-hover"
                onClick={() => {
                  localStorage.setItem("cds-project", JSON.stringify(item));
                  window.location.href = "/admin/expenses";
                }}
              >
                <div className="card rounded border-0 shadow p-0 overflow-hidden position-relative select-project">
                  <div className="card-header p-0 d-none d-sm-block hpx-170">
                    <img alt="example" src={item.picture || EXAMPLE} style={{ width: "100%", height: 170, objectFit: "cover" }} />
                  </div>
                  <div className="card-body p-3">
                    <h5 style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", height: 20}}>{item.project_name || "-"}</h5>
                    <small>หมายเลขผู้เสียภาษี : {item.tax_number || "-"}</small>
                  </div>
                  {item.is_update ? (
                    <div className="wpx-150 bg-success-light text-center position-absolute py-1 text-success shadow" style={{ right: -35, top: 15, transform: "rotate(36deg)" }}>
                      อัพเดทแล้ว
                    </div>
                  ) : (
                    <div className="wpx-150 bg-danger-light text-center position-absolute py-1 text-danger shadow" style={{ right: -35, top: 15, transform: "rotate(36deg)" }}>
                      รออัพเดท
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
