import React, { Component } from "react";
export default class Loading extends Component {
  componentDidMount() {
    window.location.href = localStorage.getItem("cds-acc-tk") ? "/admin/console" : "/login";
  }
  render() {
    return <div></div>;
  }
}
