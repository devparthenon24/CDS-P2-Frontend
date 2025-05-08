import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Loading from "./page/Loading";
import Login from "./page/Login";
import Template from "./page/Template";
import Console from "./page/admin/Console";
import Expenses from "./page/admin/Expenses";
import UploadData from "./page/admin/UploadData";
import OutstandingPaymentsAdmin from "./page/admin/OutstandingPayments";
import PaymentHistory from "./page/admin/PaymentHistory";
import Customer from "./page/admin/Customer";
import User from "./page/admin/User";
import ListCashFlow from "./page/admin/ListCashFlow";
import ExpenseTypes from "./page/admin/ExpenseTypes";
import BankAccounts from "./page/admin/BankAccounts";
import Role from "./page/admin/Role";
import Banners from "./page/admin/Banners";
import SettingCashFlowReport from "./page/admin/SettingCashFlowReport";
import CashFlowReport from "./page/admin/CashFlowReport";
import PettyCashReport from "./page/admin/PettyCashReport";
import Logs from "./page/admin/Logs";

import OutstandingPaymentsCustomer from "./page/customer/OutstandingPayments";
import Receipts from "./page/customer/Receipts";
import AllRooms from "./page/customer/AllRooms";

import PaymentHistoryDocument from "./page/document/PaymentHistory";

import Notfound from "./page/Notfound";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Loading />} />
    <Route path="/login" element={<Login />} />
    <Route path="/template" element={<Template />} />

    <Route path="/admin/console" element={<Console />} />
    <Route path="/admin/expenses" element={<Expenses />} />
    <Route path="/admin/upload-data" element={<UploadData />} />
    <Route path="/admin/outstanding-payments" element={<OutstandingPaymentsAdmin />} />
    <Route path="/admin/payment-history" element={<PaymentHistory />} />
    <Route path="/admin/customer" element={<Customer />} />
    <Route path="/admin/user" element={<User />} />
    <Route path="/admin/list-cash-flow" element={<ListCashFlow />} />
    <Route path="/admin/expense-types" element={<ExpenseTypes />} />
    <Route path="/admin/bank-accounts" element={<BankAccounts />} />
    <Route path="/admin/role" element={<Role />} />
    <Route path="/admin/banners" element={<Banners />} />
    <Route path="/admin/setting-cash-flow-report" element={<SettingCashFlowReport />} />
    <Route path="/admin/cash-flow-report" element={<CashFlowReport />} />
    <Route path="/admin/petty-cash-report" element={<PettyCashReport />} />
    <Route path="/admin/logs" element={<Logs />} />

    <Route path="/customer/outstanding-payments" element={<OutstandingPaymentsCustomer />} />
    <Route path="/customer/receipts" element={<Receipts />} />
    <Route path="/customer/all-rooms" element={<AllRooms />} />

    <Route path="/document/payment-history" element={<PaymentHistoryDocument />} />

    <Route path="/*" element={<Notfound />} />
  </Routes>
);

export default AppRoutes;
