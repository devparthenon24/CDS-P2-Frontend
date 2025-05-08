import EXAMPLE from "../../assets/images/example.png";
import React, { Component } from "react";
import Swal from "sweetalert2";
import Switch from "react-switch";
import Navbar from "../../components/Navbar.js";
import { Modal, Toast } from "react-bootstrap";
import { profile, alert, format_date, GET, POST, PUT, DELETE, DatePicker, Status, loading, float } from "../../components/CustomComponent.js";
import Pagination from "@mui/material/Pagination";
import Resizer from "react-image-file-resizer";
import "../../assets/css/bootstrap.css";
import "../../assets/css/style.css";
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal_create: false,
      modal_update: false,
      modal_detail: false,

      search: "",
      count: 0,

      data: [],
      data_role: [],
      data_project: [],

      user_id: "",
      username: "",
      password: "",
      user_type: "",
      role_id: "",
      project_list: [],
      address: "",
      full_name: "",
      email: "",
      phone: "",
      pin_number: "",
      is_active: false,

      confirm_password: "",
    };
  }

  async componentDidMount() {
    await this.Get(1);
  }
  Get = async (page) => {
    loading(true);
    let data, count, data_role, data_project;
    let [result1, result2, result3] = await Promise.all([GET("api/admin/user/list", { page: page, data_search: this.state.search }), GET("api/admin/role/list", null), GET("api/admin/console/list", null)]);
    if (result1?.status) {
      data = result1.data;
      count = result1.count;
    }
    if (result2?.status) {
      data_role = result2.data;
    }
    if (result3?.status) {
      data_project = result3.data;
    }
    this.setState({ data, count, data_role, data_project });
    loading(false);
  };
  CreateUpdate = async () => {
    if(!this.state.full_name) { alert("","warning","แจ้งเตือน","กรุณาระบุชื่อ - นามสกุล"); return;}
    if(!this.state.phone) { alert("","warning","แจ้งเตือน","กรุณาระบุเบอร์โทรศัพท์"); return;}
    if(!this.state.role_id) { alert("","warning","แจ้งเตือน","กรุณาเลือกสิทธิ์ผู้ใช้งาน"); return;}
    if(!this.state.email) { alert("","warning","แจ้งเตือน","กรุณาระบุอีเมล"); return;}
    if(!this.state.username) { alert("","warning","แจ้งเตือน","กรุณาระบุชื่อผู้ใช้"); return;}
    if(this.state.password !== this.state.confirm_password) { alert("","warning","แจ้งเตือน","รหัสผ่านไม่ตรงกัน"); return;}

    loading(true);
    let id = this.state.user_id;
    let body = {
      username: this.state.username,
      password: this.state.password,
      user_type: this.state.user_type,
      role_id: this.state.role_id,
      project_list: this.state.project_list,
      address: this.state.address,
      full_name: this.state.full_name,
      email: this.state.email,
      phone: this.state.phone,
      pin_number: this.state.pin_number,
      is_active: this.state.is_active,
    };
    let result = !id ? await POST("api/admin/user/create", body) : await PUT("api/admin/user/update/" + id, body);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  Delete = async (id) => {
    loading(true);
    let result = await DELETE("api/admin/user/" + id, null);
    if (result?.status) {
      alert("#", "success");
    }
    loading(false);
  };
  render() {
    return (
      <div className="w-100 min-vh-100">
        <Navbar header="Transaction History" page1="หน้าหลัก" page2="ผู้ดูแลระบบ" />
        <div className="body px-3 pb-3 pt-0">
          <h4 className="fw-bold mb-2">ผู้ดูแลระบบ</h4>
          <div className="d-flex align-items-center flex-wrap">
            <input
              type="text"
              className="form-control wpx-250 me-2 mb-2"
              placeholder="รหัสผู้ใช้, ชื่อ-สกุล..."
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
                this.setState({ modal_create: true, username: "", password: "", user_type: "", role_id: "", project_list: [], address: "", full_name: "", email: "", phone: "", pin_number: "", is_active: false });
              }}
            >
              เพิ่มผู้ดูแลระบบ
            </button>
          </div>
          <div className="card rounded border-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th className="wpx-50 text-center">ลำดับ</th>
                    <th>รหัสผู้ใช้</th>
                    <th>ชื่อ - สกุล</th>
                    <th>อีเมล</th>
                    <th>เบอร์โทรศัพท์</th>
                    <th>สถานะ</th>
                    <th className="text-center wpx-90">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data?.map((item, index) => (
                    <tr key={"table_" + index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.user_code}</td>
                      <td>{item.full_name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>
                        {item.is_active ? Status("ใช้งาน", "success"):Status("ปิดใช้งาน", "danger")}
                      </td>
                      <td className="py-1">
                        <div className="d-flex justify-content-center">
                          {/* Update */}
                          <div
                            className="icon text-14 mx-1 d-flex align-items-center justify-content-center wpx-25 hpx-25 pointer rounded-3 bg-warning-light text-orange"
                            onClick={async () => {
                              console.log("item.role_data?.role_id:",item.role_data?.role_id)
                              this.setState({ modal_update: true,user_id: item.user_id, username: item.username, password: "", user_type: item.user_type, role_id: item.role_data?.role_id || "", project_list: item.project_list ? JSON.parse(item.project_list) : [], address: item.address, full_name: item.full_name, email: item.email, phone: item.phone, pin_number: item.pin_number, is_active: item.is_active });
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
                                  this.Delete(item.user_id);
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
            <h5 className="fw-bold mb-0">{this.state.modal_create ? "เพิ่ม" : this.state.modal_update ? "แก้ไข" : ""}ผู้ดูแลระบบ</h5>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-12 col-lg-6">
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">ชื่อ - นามสกุล</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="กรอกข้อมูล..."
                    onChange={(e) => {
                      this.setState({ full_name: e.target.value });
                    }}
                    value={this.state.full_name}
                  />
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">เบอร์โทรศัพท์</div>
                  <input
                    type="text"
                    maxLength={10}
                    className="form-control"
                    placeholder="กรอกข้อมูล..."
                    onChange={(e) => {
                      if (!float(e.target.value)) {
                        return;
                      }
                      this.setState({ phone: e.target.value });
                    }}
                    value={this.state.phone}
                  />
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">สิทธิ์ผู้ใช้งาน</div>
                  <select
                    className="form-control"
                    onChange={(e) => {
                      this.setState({ role_id: e.target.value });
                    }}
                    value={this.state.role_id}
                  >
                    <option value="">-- กรุณาเลือก --</option>
                    {this.state.data_role.map((item, index) => (
                      <option key={index} value={item.role_id}>
                        {item.role_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">อีเมล</div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="กรอกข้อมูล..."
                    onChange={(e) => {
                      this.setState({ email: e.target.value });
                    }}
                    value={this.state.email}
                  />
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">ชื่อผู้ใช้</div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="กรอกข้อมูล..."
                    onChange={(e) => {
                      this.setState({ username: e.target.value });
                    }}
                    value={this.state.username}
                  />
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">รหัสผ่าน</div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="กรอกข้อมูล..."
                    onChange={(e) => {
                      this.setState({ password: e.target.value });
                    }}
                    value={this.state.password}
                  />
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">ยืนยันรหัสผ่าน</div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="กรอกข้อมูล..."
                    onChange={(e) => {
                      this.setState({ confirm_password: e.target.value });
                    }}
                    value={this.state.confirm_password}
                  />
                </div>
                <div className="d-flex mb-2">
                  <div className="wpx-120 mt-2">ใช้งาน</div>
                  <Switch
                    onChange={(e) => {
                      this.setState({ is_active: e });
                    }}
                    checked={this.state.is_active}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-6">
              
              <div className="d-flex align-items-center mb-3">
              <b>โครงการที่ใช้งานได้</b>
                    <input className="mx-3" type="checkbox" onChange={()=>{
                      let project_list = this.state.project_list;
                      if(project_list.length === this.state.data_project.length){
                        project_list = [];
                      }else{
                        project_list = this.state.data_project.map(e=>e.project_id);
                      }
                      this.setState({project_list:project_list});
                    }} 
                    checked={this.state.project_list.length === this.state.data_project.length}
                    /><span>ทั้งหมด</span>
                  </div>
              <div className="overflow-scroll" style={{maxHeight:"70vh"}}>
              
                {this.state.data_project.map(item => (
                  <div className="d-flex">
                    <input className="me-3" type="checkbox" onChange={()=>{
                      let project_list = this.state.project_list;
                      if(project_list.includes(item.project_id)){
                        project_list = project_list.filter(e => e !== item.project_id);
                      }else{
                        project_list.push(item.project_id);
                      }
                      this.setState({project_list:project_list});
                    }} 
                    checked={this.state.project_list.includes(item.project_id)}
                    /><span>{item.project_name}</span>
                  </div>
                ))}
                </div>
              </div>
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
