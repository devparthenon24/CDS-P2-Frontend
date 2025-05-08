import EXAMPLE from "../assets/images/example.png";
import React, { Component } from "react";
import { POST, alert, alert_url, float, loading } from "../components/CustomComponent.js";
import { Modal } from "react-bootstrap";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
export default class Notfound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {loading(false);}
  render() {
    return (
      <div className="w-100 min-vh-100 background">
        <div className="center w-100 min-vh-100 d-flex justify-content-center align-items-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-8 col-xxl-6 mx-auto">
            <div className="p-5 text-center">
              <h1 className="fw-bold mb-4 text-72">404</h1>
              <h3 className="mb-4">ขออภัย ไม่พบหน้าเว็บไซต์ที่คุณต้องการ</h3>
              <button
                type="button"
                className="btn btn-success wpx-200 mt-3 mx-auto"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                กลับไปสู่หน้าหลัก
              </button>
              <div className="w-100 text-center mt-4">
                <small className="text-secondary">เวอร์ชั่น {process.env.REACT_APP_VERSION}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
