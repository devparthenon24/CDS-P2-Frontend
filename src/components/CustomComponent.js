import React, { Component } from "react";
import Swal from "sweetalert2";
import Pagination from "@mui/material/Pagination";
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
const tokens = localStorage.getItem("cds-acc-tk") || "";
const profile = localStorage.getItem("cds-profile") ? JSON.parse(localStorage.getItem("cds-profile")) : null;
const project = localStorage.getItem("cds-project") ? JSON.parse(localStorage.getItem("cds-project")) : null;
const alert = (url, icon, title, detail, confirm, cancel) => {
  if (document.getElementsByClassName("swal2-modal").length === 0) {
    return Swal.fire({
      icon: icon || "warning",
      title: icon === "success" ? "สำเร็จ" : title || "แจ้งเตือน",
      text: icon === "success" ? "ทำรายการสำเร็จ" : detail || " ",
      confirmButtonText: confirm || "ตกลง",
      showCancelButton: cancel ? true : false,
      cancelButtonText: cancel || "ยกเลิก",
    }).then((result) => {
      if (confirm) {
        if (url && url !== "#") {
          window.location.href = url;
        } else if (url && url === "#") {
          console.log("RELOAD");
          window.location.reload();
        }
        return !!result.isConfirmed;
      } else if (url && url !== "#") {
        window.location.href = url;
      } else if (url && url === "#") {
        window.location.reload();
      }
    });
  }
};
const total = (array, key) => {
  if (!Array.isArray(array)) return 0;
  return key ? array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) : array.reduce((sum, item) => sum + (Number(item) || 0), 0);
};
const float = (num, length) => {
  const regexPattern = length ? /^\d*\.?\d{0,100}$/ : /^\d*\.?\d{0,2}$/;
  return !!regexPattern.test(num);
};
const toFixed = (number, size = 2, ceil = false) => {
  if (!number && number !== 0) return "0.00";
  if (number === 0) return "0.00";

  const num = Number(number.toString());
  const precision = size || 2;
  const processedNum = ceil ? Math.ceil(num * Math.pow(10, precision)) / Math.pow(10, precision) : num;

  return processedNum.toFixed(precision).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
const format_date = (date, format, locale, type_excel) => {
  const array_month = locale?.toLowerCase() === "en" ? ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."] : ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  const array_full_month = locale?.toLowerCase() === "en" ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] : ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  let processedDate = date;

  if (type_excel) {
    if (Number(date)) {
      processedDate = new Date(date * 24 * 60 * 60 * 1000 + Date.parse("1899-12-30"));
    } else if (typeof date === "string") {
      const separator = date.includes("/") ? "/" : date.includes(".") ? "." : null;
      if (separator && date.split(separator)[2]?.length === 4) {
        const [day, month, year] = date.split(separator);
        const adjustedYear = Number(year) < 2100 ? Number(year) : Number(year) - 543;
        processedDate = `${adjustedYear}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}`;
      }
    }
  }

  const new_date = new Date(processedDate);
  if (isNaN(new_date.getTime())) return "-";
  const day = new_date.getDate();
  const month = new_date.getMonth();
  const rawYear = new_date.getFullYear();
  const year = locale?.toLowerCase() === "en" ? (rawYear > 2100 ? rawYear - 543 : rawYear) : rawYear > 2100 ? rawYear : rawYear + 543;
  const hour = new_date.getHours();
  const minute = new_date.getMinutes();
  const second = new_date.getSeconds();
  if (!format) {
    return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${String(year).padStart(4, "0")}`;
  }

  if (format === "date") {
    return new_date.getTime();
  }
  let formatted = format
    .toLowerCase()
    // Time formats
    .replace(/hh:mm:ss/g, `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`)
    .replace(/hh:mm/g, `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`)
    .replace(/hh/g, String(hour).padStart(2, "0"))
    .replace(/h:m:s/g, `${hour}:${minute}:${second}`)
    .replace(/h:m/g, `${hour}:${minute}`)
    // Day formats
    .replace(/dd/g, String(day).padStart(2, "0"))
    .replace(/d/g, day)
    // Month formats
    .replace(/mmmm/g, array_full_month[month])
    .replace(/mmm/g, array_month[month])
    .replace(/mm/g, String(month + 1).padStart(2, "0"))
    .replace(/m/g, month + 1)
    // Year formats
    .replace(/yyyy/g, String(year).padStart(4, "0"))
    .replace(/yyy/g, year.toString().slice(-3))
    .replace(/yy/g, year.toString().slice(-2))
    .replace(/y/g, year);

  return formatted.includes("n") || formatted.includes("N") ? "" : formatted;
};
const GET = async (url, body) => {
  return new Promise((resolve) => {
    let queryString = "";
    if (body) {
      queryString =
        "?" +
        Object.entries(body)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
    }
    const apiUrl = (process.env.REACT_APP_API_URL + url).replaceAll(" ", "") + queryString;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
        project_id: project?.project_id,
      },
      cache: "no-cache",
    })
      .then((result) => result.json())
      .then((result) => {
        if (process.env.REACT_APP_API_URL.includes("localhost")) {
          console.log(url, " GET : ", result);
        }
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "ไม่พบโทเค็น") {
          localStorage.clear();
          alert("/", "warning", "แจ้งเตือน", message);
          resolve({ status: false, message });
          return;
        }
        if (message === "fetch is not defined") {
          alert("", "warning", "แจ้งเตือน", "ไม่พบข้อมูล");
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "แจ้งเตือน", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const POST = async (url, body) => {
  return new Promise((resolve) => {
    fetch((process.env.REACT_APP_API_URL + url).replaceAll(" ", ""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
        project_id: project?.project_id,
      },
      cache: "no-cache",
      body: JSON.stringify(body),
    })
      .then((result) => result.json())
      .then((result) => {
        if (process.env.REACT_APP_API_URL.includes("localhost")) {
          console.log(url, " POST : ", result);
        }
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "ไม่พบโทเค็น") {
          localStorage.clear();
          alert("/", "warning", "แจ้งเตือน", message);
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "แจ้งเตือน", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const PUT = async (url, body) => {
  return new Promise((resolve) => {
    fetch((process.env.REACT_APP_API_URL + url).replaceAll(" ", ""), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
        project_id: project?.project_id,
      },
      cache: "no-cache",
      body: JSON.stringify(body),
    })
      .then((result) => result.json())
      .then((result) => {
        if (process.env.REACT_APP_API_URL.includes("localhost")) {
          console.log(url, " PUT : ", result);
        }
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "ไม่พบโทเค็น") {
          localStorage.clear();
          alert("/", "warning", "แจ้งเตือน", message);
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "แจ้งเตือน", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const DELETE = async (url, body) => {
  return new Promise((resolve) => {
    fetch((process.env.REACT_APP_API_URL + url).replaceAll(" ", ""), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: atob(tokens),
        project_id: project?.project_id,
      },
      cache: "no-cache",
    })
      .then((result) => result.json())
      .then((result) => {
        if (process.env.REACT_APP_API_URL.includes("localhost")) {
          console.log(url, " DELETE : ", result);
        }
        if (result.status) {
          resolve(result);
          return;
        }
        const message = ERROR(result);
        if (message === "ไม่พบโทเค็น") {
          localStorage.clear();
          alert("/", "warning", "แจ้งเตือน", message);
          resolve({ status: false, message });
          return;
        }
        alert("", "warning", "แจ้งเตือน", message);
        resolve({ status: false, message });
      })
      .catch(() => {
        resolve({ status: false, message: "Error" });
      });
  });
};
const ERROR = (result) => {
  if (!result) return "";
  if (result.detail) {
    return result.detail;
  }
  if (result.data) {
    if (result.data.message) {
      return result.data.message;
    }
    return result.data;
  }
  return result.message || "";
};
const random_charactor = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
};
const loading = (status) => {
  try {
    const loading = document.getElementById("loading");
    if (status === true) {
      loading.classList.remove("d-none");
    } else if (status === false) {
      loading.classList.add("d-none");
    }
  } catch (e) {}
};
const Status = (status, color) => {
  return <span className={"text-nowrap bg-" + (color || "primary") + "-light text-" + (color || "primary") + " px-3 rounded-4"}>{status}</span>;
};
class DatePicker extends Component {
  state = {
    value: "",
    default: new Date(),
    array_date: [],
    array_month: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
    array_year: [],
    showCalendar: false,
    min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
  };
  componentDidMount = () => {
    let year = [];
    for (let i = -100; i < 100; i++) {
      year.push(new Date().getFullYear() + i);
    }
    this.setState({ array_year: year });
    if (this.props.value) {
      this.setState({
        default: new Date(this.props.value),
        value: new Date(this.props.value),
      });
    }
    if (this.props.min) {
      this.setState({ min: new Date(this.props.min) });
    } else {
      this.setState({
        min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      });
    }
    if (this.props.max) {
      this.setState({ max: new Date(this.props.max) });
    } else {
      this.setState({
        max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
      });
    }
    this.getDates();
  };
  componentWillReceiveProps = (props) => {
    if (props.min) {
      this.setState({ min: new Date(props.min) });
    } else {
      this.setState({
        min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      });
    }
    if (props.max) {
      this.setState({ max: new Date(props.max) });
    } else {
      this.setState({
        max: new Date(new Date().setFullYear(new Date().getFullYear() + 100)),
      });
    }
    if (props.value) {
      this.setState({
        default: new Date(props.value),
        value: new Date(props.value),
      });
    } else {
      this.setState({ default: new Date(), value: "" });
    }
  };
  onChangeDate = (option) => {
    if (option === "") {
      this.props.onChange("");
    } else {
      this.props.onChange(Number(option.getFullYear()) + "-" + ("0" + (Number(option.getMonth()) + 1)).slice(-2) + "-" + ("0" + option.getDate()).slice(-2));
    }
    this.setState({ value: option, showCalendar: false });
  };
  getDates = () => {
    let dates = [];
    let date = new Date(this.state.default.getFullYear(), this.state.default.getMonth(), 1);
    for (let d = 0; d < new Date(date).getDay(); d++) {
      dates.push("");
    }
    while (date.getMonth() === this.state.default.getMonth()) {
      dates.push(new Date(date).getDate());
      date.setDate(date.getDate() + 1);
    }
    this.setState({ array_date: dates });
  };
  render() {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          fontSize: "0.8rem",
        }}
      >
        {this.state.showCalendar && (
          <div
            style={{
              bottom: 0,
              left: 0,
              top: 0,
              right: 0,
              backgroundColor: "#0000",
              zIndex: 1000,
              position: "fixed",
            }}
            onClick={() => {
              this.setState({ showCalendar: false });
            }}
          ></div>
        )}
        <div style={{ width: "100%" }}>
          <input
            className={this.props.className}
            style={{ cursor: "pointer" }}
            type="text"
            value={this.state.value && typeof this.state.value === "object" ? ("0" + this.state.value.getDate()).slice(-2) + "/" + ("0" + (Number(this.state.value.getMonth()) + 1)).slice(-2) + "/" + Number(this.state.value.getFullYear()) : this.state.value}
            placeholder={this.state.placeholder ? this.state.placeholder : "dd/mm/yyyy"}
            onFocus={() => {
              this.setState({
                showCalendar: true,
                default: this.state.value ? new Date(this.state.value) : new Date(),
              });
              setTimeout(() => {
                this.getDates();
                let offsets = document.getElementById("calendar");
                let box_left = offsets.getBoundingClientRect().left;
                let box_top = offsets.getBoundingClientRect().top;
                let width = window.innerWidth;
                let height = window.innerHeight;
                if (box_left + 300 > width) {
                  offsets.style.left = "-300px";
                }
                if (box_top + 335 > height) {
                  offsets.style.top = "-335px";
                }
                offsets.style.opacity = "1";
              }, 1);
            }}
            onChange={(e) => {
              this.setState({ value: e.target.value });
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.target.blur();
              }
            }}
            onBlur={() => {
              const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
              if (regex.test(this.state.value)) {
                this.setState({ default: new Date(Number(this.state.value.split("/")[2]) > 2100 ? Number(this.state.value.split("/")[2]) - 543 : Number(this.state.value.split("/")[2]), Number(this.state.value.split("/")[1]) - 1, Number(this.state.value.split("/")[0])) });
                setTimeout(() => {
                  this.onChangeDate(new Date(this.state.default.getFullYear(), this.state.default.getMonth(), this.state.default.getDate()));
                }, 10);
              } else if (typeof this.state.value === "object" && this.state.value !== "Invalid Date") {
                console.log("Invalid Date");
              } else if (this.state.value.length === 8 && Number(this.state.value)) {
                this.setState({ default: new Date(Number(this.state.value.slice(-4)) > 2100 ? Number(this.state.value.slice(-4)) - 543 : Number(this.state.value.slice(-4)), Number(this.state.value.slice(2, 4)) - 1, Number(this.state.value.slice(0, 2))) });
                setTimeout(() => {
                  this.onChangeDate(new Date(this.state.default.getFullYear(), this.state.default.getMonth(), this.state.default.getDate()));
                }, 10);
              } else {
                this.setState({ value: "" });
              }
            }}
            disabled={this.props.disabled}
            maxLength={10}
          />
          {this.state.showCalendar && (
            <div
              id="calendar"
              style={{
                opacity: 0,
                zIndex: 1001,
                width: 300,
                position: "absolute",
                marginTop: "0.2rem",
                paddingTop: "0.3rem",
                paddingBottom: "0.3rem",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                wordWrap: "break-word",
                backgroundColor: "#ffffff",
                backgroundClip: "border-box",
                border: "1px solid rgba(0,0,0,.125)",
                borderRadius: 8,
                boxShadow: "0 0.3rem 1rem rgba(0, 0, 0, .15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {this.state.default.getMonth() === 0 && this.state.default.getFullYear() === new Date().getFullYear() - 100 ? (
                  <span style={{ color: "#e1e2e2", padding: "1rem" }}>{"<"}</span>
                ) : (
                  <span
                    style={{ cursor: "pointer", padding: "1rem" }}
                    onClick={() => {
                      let date = this.state.default;
                      date.setMonth(date.getMonth() - 1);
                      this.setState({ default: date });
                      setTimeout(() => {
                        this.getDates();
                      }, 1);
                    }}
                  >
                    {"<"}
                  </span>
                )}
                {/* เดือน */}
                <select
                  style={{ width: 100, borderWidth: 0, textAlign: "center" }}
                  onChange={(e) => {
                    let date = this.state.default;
                    date.setMonth(e.target.value);
                    this.setState({ default: date });
                    setTimeout(() => {
                      this.getDates();
                    }, 1);
                  }}
                  value={this.state.default ? this.state.default.getMonth() : " "}
                >
                  {this.state.array_month.map((item, index) => (
                    <option value={index}>{item}</option>
                  ))}
                </select>
                <label
                  style={{
                    marginLeft: "0.3rem",
                    marginRight: "0.3rem",
                    paddingBottom: 0,
                    cursor: "pointer",
                  }}
                >
                  {this.props.type === "th" ? "พ.ศ." : "ค.ศ."}
                </label>
                {/* ปี */}
                <select
                  style={{ width: 60, borderWidth: 0, textAlign: "center" }}
                  onChange={(e) => {
                    let date = this.state.default;
                    date.setFullYear(e.target.value);
                    this.setState({ default: date });
                    setTimeout(() => {
                      this.getDates();
                    }, 1);
                  }}
                  value={this.state.default ? this.state.default.getFullYear() : " "}
                >
                  {this.state.array_year.map((item, index) => (
                    <option value={item}>{this.props.type === "th" ? item + 543 : item} </option>
                  ))}
                </select>
                {this.state.default.getMonth() === 11 && this.state.default.getFullYear() === new Date().getFullYear() + 99 ? (
                  <span style={{ color: "#e1e2e2", padding: "1rem" }}>{">"}</span>
                ) : (
                  <span
                    style={{ cursor: "pointer", padding: "1rem" }}
                    onClick={() => {
                      let date = this.state.default;
                      date.setMonth(date.getMonth() + 1);
                      this.setState({ default: date });
                      setTimeout(() => {
                        this.getDates();
                      }, 1);
                    }}
                  >
                    {">"}
                  </span>
                )}
              </div>
              <div style={{ marginBottom: "1rem", marginLeft: 0, marginRight: 0, width: "100%", display: "flex", flexWrap: "wrap" }}>
                {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((item, index) => (
                  <div key={"day_" + index} style={{ width: "14.28%", padding: "0,25rem 0", textAlign: "center" }}>
                    {item}
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "-1rem",
                  marginLeft: 0,
                  marginRight: 0,
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  height: 220,
                }}
              >
                {this.state.array_date.map((item, index) => (
                  <div
                    key={"date_" + index}
                    style={
                      this.state.value && typeof this.state.value === "object" && item && this.state.value.getDate() === item && this.state.value.getMonth() === this.state.default.getMonth() && this.state.value.getFullYear() === this.state.default.getFullYear()
                        ? new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) > this.state.min.getTime() && new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) < this.state.max.getTime()
                          ? {
                              width: "14.28%",
                              paddingTop: "0.3rem",
                              paddingBottom: "0.3rem",
                              textAlign: "center",
                              cursor: "pointer",
                              backgroundColor: "#0d6efd",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }
                          : {
                              width: "14.28%",
                              paddingTop: "0.3rem",
                              paddingBottom: "0.3rem",
                              textAlign: "center",
                              backgroundColor: "#0d6efd",
                              color: "#e1e2e2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }
                        : new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) > this.state.min.getTime() && new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) < this.state.max.getTime()
                        ? {
                            width: "14.28%",
                            paddingTop: "0.3rem",
                            paddingBottom: "0.3rem",
                            textAlign: "center",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }
                        : {
                            width: "14.28%",
                            paddingTop: "0.3rem",
                            paddingBottom: "0.3rem",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#e1e2e2",
                          }
                    }
                    onClick={() => {
                      if (new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) > this.state.min.getTime() && new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item) < this.state.max.getTime()) {
                        this.onChangeDate(new Date(this.state.default.getFullYear(), this.state.default.getMonth(), item));
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: "0.3rem",
                  paddingRight: "0.3rem",
                }}
              >
                {this.props.clearable !== false ? (
                  <label
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => {
                      this.onChangeDate("");
                    }}
                  >
                    clear
                  </label>
                ) : (
                  <label></label>
                )}
                <label
                  style={{ cursor: "pointer", color: "#0d6efd" }}
                  onClick={() => {
                    this.onChangeDate(new Date());
                  }}
                >
                  To day
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
class Select extends Component {
  state = {
    showSelectOption: false,
    search: "",
      count: 0,
    selected: "",
    visibleOptions: 100,
  };
  componentDidMount = () => {};
  componentWillReceiveProps = (props) => {};
  render() {
    return (
      <div style={{ position: "relative", padding: 0 }} className={this.props.className}>
        {this.state.showSelectOption && (
          <div
            style={{
              bottom: 0,
              left: 0,
              top: 0,
              right: 0,
              backgroundColor: "#0000",
              zIndex: 1000,
              position: "fixed",
            }}
            onClick={() => {
              this.setState({ showSelectOption: false });
            }}
          ></div>
        )}
        <div style={{ position: "relative" }}>
          <input
            className={this.props.className.replaceAll("mb-2", "").replaceAll("mb-3", "").replaceAll("mb-4", "").replaceAll("mb-5", "")}
            style={{
              width: "100%",
              backgroundColor: this.props.disabled ? "#e9ecef" : "#00000000",
              border: 0,
            }}
            type="text"
            value={!this.state.search && !this.state.showSelectOption && this.props.value ? this.props.options.find((e) => e.value === this.props.value)?.label : this.state.search}
            placeholder={this.props.placeholder || ""}
            onFocus={() => {
              this.setState({
                showSelectOption: true,
                search: "",
      count: 0,
                selected: "",
                visibleOptions: 100,
              });
            }}
            onChange={(e) => {
              this.setState({ search: e.target.value, visibleOptions: 100 });
            }}
            disabled={this.props.disabled}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: 8,
              top: "50%",
            }}
          >
            <div
              style={{
                width: 10,
                height: 2,
                backgroundColor: "#c2c2c2",
                transform: "rotate(45deg)",
              }}
            ></div>
            <div
              style={{
                width: 10,
                height: 2,
                backgroundColor: "#c2c2c2",
                transform: "rotate(315deg)",
                marginLeft: -4,
              }}
            ></div>
          </div>
        </div>
        {this.state.showSelectOption && (
          <div
            style={{
              minWidth: 150,
              width: "100%",
              padding: 6,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#d2d2d2",
              borderStyle: "solid",
              backgroundColor: "#fdfdfd",
              position: "absolute",
              top: 40,
              zIndex: 1001,
            }}
          >
            <div
              style={{
                maxHeight: 400,
                overflow: "auto",
              }}
              onScroll={(e) => {
                const target = e.target;
                if (this.state.visibleOptions < this.props.options.length) {
                  this.setState((prevState) => ({ visibleOptions: prevState.visibleOptions + 100 }));
                }
              }}
            >
              {this.props.options
                .filter((e) => !this.state.search || e.label.includes(this.state.search))
                .slice(0, this.state.visibleOptions)
                .map((item, index) => (
                  <div
                    id={"select-option-" + index}
                    key={index}
                    style={{
                      display: "flex",
                      width: "100%",
                      cursor: "pointer",
                      padding: 4,
                      backgroundColor: this.state.selected === index ? "#dfdfdf" : "#fff0",
                    }}
                    onClick={() => {
                      this.setState({
                        showSelectOption: false,
                        search: "",
      count: 0,
                        selected: "",
                      });
                      this.props.onChange(item.value, item);
                    }}
                    onMouseEnter={() => this.setState({ selected: index })}
                  >
                    {item.front || ""}
                    {item.label}
                  </div>
                ))}
              {this.props.options.filter((e) => !this.state.search || e.label.includes(this.state.search)).length === 0 && (
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    color: "#2c2c2c",
                  }}
                >
                  ไม่พบข้อมูล...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLargeScreen: window.matchMedia("(min-width: 992px)").matches,
    };
  }
  componentDidMount() {
    this.mediaQueryListener = window.matchMedia("(min-width: 992px)");
    this.mediaQueryListener.addEventListener("change", this.handleScreenSizeChange);
  }
  componentWillUnmount() {
    this.mediaQueryListener.removeEventListener("change", this.handleScreenSizeChange);
  }
  handleScreenSizeChange = (event) => {
    this.setState({ isLargeScreen: event?.matches });
  };
  renderTable = () => {
    return (
      <table className="table table-borderless table-hover mb-0 rounded overflow-hidden">
        <thead>
          <tr>
            {this.props.showOption.includes("checkbox") && (
              <td className="text-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checkboxes = document.getElementsByName("checkbox");
                    checkboxes.forEach((checkbox) => {
                      checkbox.checked = e.target.checked;
                    });
                    this.props.onOptionChange(
                      "checkbox",
                      [...checkboxes].map((ch) => (ch.className.includes("d-none") ? false : ch.checked)),
                      -1
                    );
                  }}
                />
              </td>
            )}
            {this.props.data &&
              this.props.data[0] &&
              Object.keys(this.props.data[0])
                .filter((item) => item != "checkbox")
                .map((item) => (
                  <td className={"text-" + this.props.data[0][item]?.alignment || "start"} style={{ width: this.props.data[0][item]?.width || "auto" }}>
                    {item}
                  </td>
                ))}
            {(!this.props.showOption || this.props.showOption.filter((e) => e != "checkbox").length !== 0) && <td className="text-center">จัดการ</td>}
          </tr>
        </thead>
        <tbody>
          {this.props.data.map((obj, index) => (
            <tr key={index}>
              {this.props.showOption.includes("checkbox") && (
                <td className="text-center">
                  <input
                    type="checkbox"
                    name="checkbox"
                    className={obj["checkbox"] === undefined || obj["checkbox"].value === true ? "" : "d-none"}
                    onChange={(e) => {
                      this.props.onOptionChange(
                        "checkbox",
                        [...document.getElementsByName("checkbox")].map((ch) => ch.checked),
                        -1
                      );
                    }}
                  />
                </td>
              )}
              {this.props.data &&
                Object.keys(this.props.data[0])
                  .filter((item) => item != "checkbox")
                  .map((item) => (
                    <td className={"text-" + this.props.data[0][item].alignment || "start"} style={{ width: this.props.data[0][item].width || "auto" }}>
                      {obj[item]?.value || ""}
                    </td>
                  ))}
              {(!this.props.showOption || this.props.showOption.filter((e) => e != "checkbox").length !== 0) && (
                <td style={{ width: 54 * (this.props.showOption.length || 1) }}>
                  <div className="d-flex justify-content-center">
                    {this.props.showOption.includes("print") && (
                      <div
                        className="status bg-primary-light text-primary"
                        onClick={async () => {
                          this.props.onOptionChange("print", obj, index);
                        }}
                      >
                        {"\uf02f"}
                      </div>
                    )}
                    {this.props.showOption.includes("view") && (
                      <div
                        className="status bg-success-light text-success"
                        onClick={async () => {
                          this.props.onOptionChange("view", obj, index);
                        }}
                      >
                        {"\uf06e"}
                      </div>
                    )}
                    {this.props.showOption.includes("download") && (
                      <div
                        className="status bg-info-light text-info"
                        onClick={async () => {
                          this.props.onOptionChange("download", obj, index);
                        }}
                      >
                        {"\uf019"}
                      </div>
                    )}
                    {this.props.showOption.includes("email") && (
                      <div
                        className="status bg-secondary-light text-secondary"
                        onClick={async () => {
                          this.props.onOptionChange("email", obj, index);
                        }}
                      >
                        {"\uf0e0"}
                      </div>
                    )}
                    {this.props.showOption.includes("update") && (
                      <div
                        className="status bg-warning-light text-orange"
                        onClick={async () => {
                          this.props.onOptionChange("update", obj, index);
                        }}
                      >
                        {"\uf044"}
                      </div>
                    )}
                    {this.props.showOption.includes("delete") && (
                      <div
                        className="status bg-danger-light text-danger"
                        onClick={async () => {
                          this.props.onOptionChange("delete", obj, index);
                        }}
                      >
                        {"\uf1f8"}
                      </div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  renderCards = () => {
    return (
      <div className="row">
        {this.props.data && this.props.data.length !== 0 ? (
          <div>
            {this.props.data.map((obj, index) => (
              <div className="col-12 col-sm-6 mb-3" key={index}>
                <div className="card p-2 border-0 shadow-sm position-relative">
                  <div className="d-flex justify-content-end position-absolute" style={{ top: 2, right: 4 }}>
                    {this.props.showOption.includes("print") && (
                      <div
                        className="icon px-1 pointer text-primary"
                        onClick={async () => {
                          this.props.onOptionChange("print", obj, index);
                        }}
                      >
                        {"\uf02f"}
                      </div>
                    )}
                    {this.props.showOption.includes("view") && (
                      <div
                        className="icon px-1 pointer text-success"
                        onClick={async () => {
                          this.props.onOptionChange("view", obj, index);
                        }}
                      >
                        {"\uf06e"}
                      </div>
                    )}
                    {this.props.showOption.includes("download") && (
                      <div
                        className="icon px-1 pointer text-info"
                        onClick={async () => {
                          this.props.onOptionChange("download", obj, index);
                        }}
                      >
                        {"\uf019"}
                      </div>
                    )}
                    {this.props.showOption.includes("email") && (
                      <div
                        className="icon px-1 pointer text-secondary"
                        onClick={async () => {
                          this.props.onOptionChange("email", obj, index);
                        }}
                      >
                        {"\uf0e0"}
                      </div>
                    )}
                    {this.props.showOption.includes("update") && (
                      <div
                        className="icon px-1 pointer text-orange"
                        onClick={async () => {
                          this.props.onOptionChange("update", obj, index);
                        }}
                      >
                        {"\uf044"}
                      </div>
                    )}
                    {this.props.showOption.includes("delete") && (
                      <div
                        className="icon px-1 pointer text-danger"
                        onClick={async () => {
                          this.props.onOptionChange("delete", obj, index);
                        }}
                      >
                        {"\uf1f8"}
                      </div>
                    )}
                  </div>
                  {Object.keys(obj).map((item) => (
                    <span>
                      {item}: {obj[item].value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-12 text-center">
            <span className="text-muted">ไม่พบข้อมูล</span>
          </div>
        )}
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.props.data && this.props.data.length !== 0 ? (
          <div>
            {this.state.isLargeScreen ? this.renderTable() : this.renderCards()}
            {this.props.showPagination !== false && (
              <div className="w-100 d-flex align-items-center justify-content-between flex-wrap mt-2">
                <span className="mb-3">รายการทั้งหมด {this.props.count || 0} รายการ</span>
                <Pagination className="mb-3" count={Math.ceil(this.props.count / 10) || 1} showFirstButton showLastButton onChange={(_, page) => this.props.onOptionChange("page", page, -1)} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-5">
            <img
              alt="no data"
              src={
                "data:image/png;base64,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"
              }
              width="300"
              height="300"
              className="d-inline-block align-top"
            />
            <div className="text-16 text-secondary">ไม่มีข้อมูล</div>
          </div>
        )}
      </div>
    );
  }
}
export { profile, project, alert, total, float, toFixed, format_date, random_charactor, GET, POST, PUT, DELETE, loading, Status, DatePicker, Select, Table };
export { default as Navbar } from "../components/Navbar.js";
export { default as Swal } from "sweetalert2";
export { default as Switch } from "react-switch";
export { Modal, Toast } from "react-bootstrap";
export { default as Resizer } from "react-image-file-resizer";
export { default as Pagination } from "@mui/material/Pagination";

