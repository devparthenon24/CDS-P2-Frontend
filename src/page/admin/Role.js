import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading, Swal, Switch, Navbar, Modal, Toast, Resizer, Pagination } from "../../components/CustomComponent.js";
import "../../components/global.js";
export default class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,

      search: "",
      count: 0,

      data: [],

      role_id: "",
      role_name: "",
      role_detail: global.role || [],
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
    let result = await GET("api/admin/role/list", body);
    if (result?.status) {
      this.setState({ data: result.data, count: result.count });
    }
    loading(false);
  };
  CreateUpdate = async () => {
    if(!this.state.role_name) { alert("","warning","แจ้งเตือน","กรุณาระบุชื่อบทบาท"); return;}
    if(!JSON.stringify(this.state.role_detail).includes("true")) { alert("","warning","แจ้งเตือน","กรุณาให้สิทธิ์อย่างน้อย 1 รายการ"); return;}
    loading(true);
    let id = this.state.role_id;
    let body = {
      role_name: this.state.role_name,
      role_detail: this.state.role_detail,
    };
    let result = !id ? await POST("api/admin/role/create", body) : await PUT("api/admin/role/update/" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  Delete = async (id) => {
    loading(true);
    let result = await DELETE("api/admin/role/delete/" + id, null);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  getPermissionKey = (label) => {
    const keyMap = {
      ดู: "get",
      เพิ่ม: "post",
      แก้ไข: "put",
      ลบ: "delete",
      อนุมัติ: "approved",
    };
    return keyMap[label] || "";
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="สิทธิ์ผู้ใช้งาน" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">สิทธิ์ผู้ใช้งาน</h4>
          <div className="d-flex align-items-center flex-wrap">
            <input
              type="text"
              className="form-control wpx-250 me-2 mb-2"
              placeholder="ชื่อบทบาท..."
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
            <button
              className="btn btn-success px-4 ms-auto mb-2"
              onClick={async () => {
                this.setState({ modal_create: true, role_id: "", role_name: "", role_detail: global.role || [] });
              }}
            >
              เพิ่มสิทธิ์ผู้ใช้งาน
            </button>
          </div>
          <div className="card rounded border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th className="wpx-50 text-center">ลำดับ</th>
                    <th className="text-nowrap">ชื่อบทบาท</th>
                    <th>รายละเอียด</th>
                    <th className="text-center wpx-90">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-nowrap">{item.role_name || ""}</td>
                      <td>{item.role_detail.map(e => global.role_name[e.menu_name]).toString().replaceAll(",",", ") || ""}</td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          {/* Update */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-warning-light text-orange"
                            onClick={async () => {
                              this.setState({ modal_update: true, role_id: item.role_id, role_name: item.role_name, role_detail: item.role_detail });
                            }}
                          >
                            {"\uf044"}
                          </div>
                          {/* Delete */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-danger-light text-danger"
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
                                  this.Delete(item.role_id);
                                }
                              });
                            }}
                          >
                            {"\uf1f8"}
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
        {/* CREATE UPDATE */}
        <Modal show={this.state.modal_create || this.state.modal_update} onHide={() => this.setState({ modal_create: false, modal_update: false })} size="lg">
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}สิทธิ์ผู้ใช้งาน</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex mb-2">
              <div className="wpx-120 mt-2">ชื่อบทบาท</div>
              <input
                className="form-control"
                type="text"
                placeholder="ระบุชื่อบทบาท..."
                onChange={(e) => {
                  this.setState({ role_name: e.target.value });
                }}
                value={this.state.role_name}
              />
            </div>
            <div className="w-100">
              <table className="table table-bordered">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th>รายการ</th>
                    {["ทั้งหมด", "ดู", "เพิ่ม", "แก้ไข", "ลบ", "อนุมัติ"].map((label, index) => (
                      <th key={index} className="wpx-60 text-center">
                        {label} <br />
                        <input
                          type="checkbox"
                          onClick={(e) => {
                            const checked = e.target.checked;
                            this.setState({
                              role_detail: this.state.role_detail.map((item) => {
                                const newPermission = { ...item.permission };
                                if (label === "ทั้งหมด") {
                                  Object.keys(newPermission).forEach((key) => {
                                    newPermission[key] = checked;
                                  });
                                } else {
                                  const permissionKey = this.getPermissionKey(label);
                                  newPermission[permissionKey] = checked;
                                }
                                return { ...item, permission: newPermission };
                              }),
                            });
                          }}
                          checked={label === "ทั้งหมด" ? this.state.role_detail.every((item) => Object.values(item.permission || {}).every((v) => v)) : this.state.role_detail.every((item) => item.permission[this.getPermissionKey(label)])}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.state.role_detail &&
                    this.state.role_detail.map((item, index) => (
                      <tr key={index}>
                        <td>{global.role_name[item.menu_name]}</td>
                        {["ทั้งหมด", "ดู", "เพิ่ม", "แก้ไข", "ลบ", "อนุมัติ"].map((label, idx) => (
                          <td key={idx} className="text-center">
                            <input
                              type="checkbox"
                              onClick={(e) => {
                                const checked = e.target.checked;
                                let role_detail = [...this.state.role_detail];
                                const permissionKey = this.getPermissionKey(label);

                                if (label === "ทั้งหมด") {
                                  Object.keys(role_detail[index].permission).forEach((key) => {
                                    role_detail[index].permission[key] = checked;
                                  });
                                } else {
                                  role_detail[index].permission[permissionKey] = checked;
                                }

                                this.setState({ role_detail });
                              }}
                              checked={label === "ทั้งหมด" ? Object.values(item.permission || {}).every((v) => v) : item.permission[this.getPermissionKey(label)]}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer className="py-1">
            <div className="w-100 d-flex">
              <button
                className="btn btn-danger w-100 me-1"
                onClick={() => {
                  this.setState({ modal_create: false, modal_update: false });
                }}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-success w-100 ms-1"
                onClick={() => {
                  this.CreateUpdate();
                }}
              >
                บันทึก
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
