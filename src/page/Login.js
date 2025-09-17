import EXAMPLE from "../assets/images/example.png";
import React, { Component } from "react";
import { POST, loading } from "../components/CustomComponent.js";

import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }
  componentDidMount() {
    loading(false);
    if (localStorage.getItem("cds-acc-tk")) {
      window.location.href = "/admin/console";
    }
  }
  Login = async () => {
    loading(true);
    let body = {
      username: this.state.username,
      password: this.state.password,
    };
    let result = await POST("api/login", body);
    if (result?.status) {
      localStorage.setItem("cds-acc-tk", btoa("Bearer " + result.data.token));
      localStorage.setItem("cds-profile", JSON.stringify({...result.data, password: ""}));
      window.location.href = "/admin/console";
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100 background">
        <div className="center w-100 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-8 col-xxl-6 mx-auto">
            <div className="card shadow overflow-hidden rounded-3 border-0">
              <div className="row mx-0">
                <div className="col-12 col-xl-6 p-0">
                  <img alt="example" src={EXAMPLE} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="col-12 col-xl-6 p-5">
                  <div className="w-100 text-center mt-2 mt-lg-4 mb-4">
                    <h3 className="fw-bold mb-4">เข้าสู่ระบบ</h3>
                    <label>ยินดีต้อนรับเข้าสู่เว็บไซต์ CDS</label>
                  </div>
                  <label className="mb-1">ชื่อผู้ใช้</label>
                  <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="ชื่อผู้ใช้"
                    onChange={(e) => {
                      this.setState({ username: e.target.value });
                    }}
                    value={this.state.username}
                  />
                  <label className="mb-1">รหัสผ่าน</label>
                  <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="รหัสผ่าน"
                    onChange={(e) => {
                      this.setState({ password: e.target.value });
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        this.Login();
                      }
                    }}
                    value={this.state.password}
                  />
                  <button
                    type="button"
                    className="btn btn-success w-100 mt-3"
                    onClick={() => {
                      this.Login();
                    }}
                  >
                    เข้าสู่ระบบ
                  </button>
                  <div className="w-100 text-center mt-4 mb-2 mb-lg-5">
                    <small className="text-secondary">เวอร์ชั่น {process.env.REACT_APP_VERSION}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
