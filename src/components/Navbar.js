import { Link } from "react-router-dom";
import React, { Component } from "react";
import { project, Sidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import { profile, PUT, alert } from "./CustomComponent.js";
import { Modal, Toast } from "react-bootstrap";
import LOGO from "../assets/images/logo.png";
import "../assets/css/bootstrap.css";

export default class NavbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false,
      menu: false,
      array_menu: [
        { name: "Console 🟢", route: "/admin/console", icon: "\uf005", child: [] },
        { name: "อัพโหลดไฟล์ข้อมูล 🟢", route: "/admin/upload-data", icon: "\uf093", child: [] },
        { name: "รายการค่าใช้จ่าย 🟢", route: "/admin/expenses", icon: "\uf15c", child: [] },
        { name: "รายการค้างชำระ 🟢", route: "/admin/outstanding-payments", icon: "\uf15c", child: [] },
        { name: "รายการประวัติการชำระ 🟢", route: "/admin/payment-history", icon: "\uf15c", child: [] },
        { name: "ลูกค้าโครงการ 🟢", route: "/admin/customer", icon: "\uf007", child: [] },
        { name: "ผู้ดูแลระบบ 🟢", route: "/admin/user", icon: "\uf4fe", child: [] },
        { name: "รายการกระแสเงินสดรับ-กระแสเงินสดจ่าย", route: "/admin/list-cash-flow", icon: "\uf15c", child: [] },
        {
          name: "การตั้งค่า 🟢", route: "", icon: "\uf013",
          child: [
            { name: "บัญชีธนาคาร 🟢", route: "/admin/bank-accounts", icon: "\uf19c", child: [] },
            { name: "ประเภทค่าใช้จ่าย 🟢", route: "/admin/expense-types", icon: "\uf03a", child: [] },
            { name: "สิทธิ์ผู้ใช้งาน 🟢", route: "/admin/role", icon: "\uf023", child: [] },
            { name: "แบนเนอร์ 🟢", route: "/admin/banners", icon: "\uf302", child: [] },
            { name: "รายงานกระแสเงินสด 🟢", route: "/admin/setting-cash-flow-report", icon: "\uf302", child: [] },
          ],
        },
        {
          name: "รายงาน", route: "", icon: "\uf518",
          child: [
            { name: "รายงานกระแสเงินสดรับ-กระแสเงินสดจ่าย", route: "/admin/cash-flow-report", icon: "\uf15c", child: [] },
            { name: "รายงานเงินสดย่อย", route: "/admin/petty-cash-report", icon: "\uf15c", child: [] },
          ],
        },
        { name: "ประวัติการใช้งานระบบ", route: "/admin/logs", icon: "\uf15c", child: [] },
        { name: "รายการค้างชำระ", route: "/customer/outstanding-payments", icon: "\uf15c", child: [] },
        { name: "รายการใบเสร็จ", route: "/customer/receipts", icon: "\uf15c", child: [] },
        { name: "ข้อมูลห้องทั้งหมด", route: "/customer/all-rooms", icon: "\uf015", child: [] },
      ],
    };
  }
  
  async componentDidMount() {}
  async componentDidUpdate() {}
  icon = (icon) => { return <label className="icon">{icon}</label> };
  
  render() {
    return (
      <div>
        {this.state.menu && (
          <div
            className="position-fixed w-100 min-vh-100"
            style={{ zIndex: 2000 }}
            onClick={() => {
              this.setState({ menu: false });
            }}
          ></div>
        )}
       <Sidebar
  className="position-fixed bg-white"
  backgroundColor={"#ffffff"}
  style={{
    zIndex: 1000,
    width: "250px",      // ความกว้าง sidebar คงที่
    height: "100vh",     // ความสูงเต็มจอ
    overflow: "hidden",  // ซ่อน scrollbar ด้านนอก
  }}
  breakPoint="lg"
  toggled={this.state.sidebar}
  onFocus={() => {
    this.setState({ sidebar: true });
  }}
>
  <Menu
    className="d-flex flex-column"
    style={{
      height: "100%",
      overflowY: "auto",   // ทำให้ scroll ได้
      paddingBottom: "60px", // กันไม่ให้ติดขอบล่าง
    }}
  >
    <div className="w-100 px-3 d-flex align-items-start justify-content-between my-2">
      <img src={LOGO} height={42} alt="LOGO" className="mx-auto" />
      <span
        className="icon text-24 pointer d-block d-lg-none d-xl-none"
        onClick={() => {
          this.setState({ sidebar: false });
        }}
      >
        {"\uf00d"}
      </span>
    </div>

    {this.state.array_menu.map((item, index) => {
      if (item.child.length === 0) {
        return (
          <MenuItem
            key={index}
            icon={this.icon(item.icon)}
            active={window.location.pathname === item.route}
            component={<Link to={item.route} />}
          >
            {item.name}
          </MenuItem>
        );
      } else {
        return (
          <SubMenu
            key={index}
            icon={this.icon(item.icon)}
            label={item.name}
            defaultOpen={item.child.map((e) => e.route).includes(window.location.pathname)}
          >
            {item.child.map((child, cIndex) => (
              <MenuItem
                key={cIndex}
                icon={this.icon(child.icon)}
                active={window.location.pathname === child.route}  
                component={<Link to={child.route} />}
              >
                {child.name}
              </MenuItem>
            ))}
          </SubMenu>
        );
      }
    })}
  </Menu>
</Sidebar>

        <div className="body d-flex align-items-center justify-content-between mb-1 px-3 py-2">
          <div className="d-flex align-items-center">
            {this.props.sidebar !== "false" && (
              <label
                className="me-3 d-block d-lg-none d-xl-none pointer"
                onClick={() => {
                  this.setState({ sidebar: !this.state.sidebar });
                }}
              >
                <span className="icon text-24">{"\uf0c9"}</span>
              </label>
            )}
            <div className="d-none d-sm-flex">
              {this.props.page1 && <label className={this.props.page2 ? "text-secondary" : "text-success"}>{this.props.page1}</label>}
              {this.props.page2 && <label className="text-secondary mx-2">{">"}</label>}
              {this.props.page2 && <label className={this.props.page3 ? "text-secondary" : "text-success"}>{this.props.page2}</label>}
              {this.props.page3 && <label className="text-secondary mx-2">{">"}</label>}
              {this.props.page3 && <label className="text-success">{this.props.page3}</label>}
            </div>
          </div>
          <div className="d-flex align-items-center bg-white py-1 px-1" style={{ borderRadius: 26 }}>
            <div className="bg-success-light text-success wpx-40 hpx-40 d-flex justify-content-center align-items-center rounded-circle me-3">{profile.full_name?.slice(0, 2).toUpperCase() || "US"}</div>
            <div className="me-3">
              <div className="fw-bold">{profile.full_name || "fisrtname lastname"}</div>
              <small className="me-2">{profile.email || "example@email.com"}</small>
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
      </div>
    );
  }
}
