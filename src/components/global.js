global.role = [
  { menu_name: "admin/expenses", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/upload-data", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/outstanding-payments", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/payment-history", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/customer", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/user", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/list-cash-flow", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/bank-accounts", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/expense-types", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/role", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/banners", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/setting-cash-flow-report", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/cash-flow-report", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/petty-cash-report", permission: { get: false, post: false, put: false, delete: false, approved: false } },
  { menu_name: "admin/logs", permission: { get: false, post: false, put: false, delete: false, approved: false } },
];
global.role_name = {
  "admin/expenses": "รายการค่าใช้จ่าย",
  "admin/upload-data": "อัพโหลดไฟล์ข้อมูล",
  "admin/outstanding-payments": "รายการค้างชำระ",
  "admin/payment-history": "รายการประวัติการชำระ",
  "admin/customer": "ลูกค้าโครงการ",
  "admin/user": "ผู้ดูแลระบบ",
  "admin/list-cash-flow": "รายงานกระแสเงินสดรับ - กระแสเงินสดจ่าย",
  "admin/bank-accounts": "การตั้งค่า > บัญชีธนาคาร",
  "admin/expense-types": "การตั้งค่า > ประเภทค่าใช้จ่าย",
  "admin/role": "การตั้งค่า > สิทธิ์ผู้ใช้งาน",
  "admin/banners": "การตั้งค่า > แบนเนอร์",
  "admin/setting-cash-flow-report": "การตั้งค่า > ตั้งค่ารายงานกระแสเงินสดรับ - กระแสเงินสดจ่าย",
  "admin/cash-flow-report": "รายงาน > รายงานกระแสเงินสดรับ - กระแสเงินสดจ่าย",
  "admin/petty-cash-report": "รายงาน > รายงานเงินสดย่อย",
  "admin/logs": "ประวัติการใช้งานระบบ",
};
//   สถานะการโอน
global.status_transfer = {
  0: "",
  1: "โอนกรรมสิทธิ์แล้ว",
  2: "ยังไม่โอนกรรมสิทธิ์",
  3: "ห้องว่าง",
};

// ซื้ออาคารโดย
global.status_buy_building = {
  0: "",
  1: "เงินสด",
  2: "ผ่อนชำระกับธนาคาร",
  3: "ผู้เช่าซื้อกับการเคหะแห่งชาติ",
  4: "ซื้อต่อกับลูกค้าเดิม",
  5: "อื่น ๆ",
};

// ธนาคาร
global.bank = ["ธนาคารกรุงเทพ", 
  "ธนาคารกสิกรไทย", 
  "ธนาคารกรุงไทย", 
  "ธนาคารไทยพาณิชย์", 
  "ธนาคารกรุงศรีอยุธยา", 
  "ธนาคารออมสิน", 
  "ธนาคารทหารไทยธนชาต", 
  "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)", 
  "ธนาคารอิสลามแห่งประเทศไทย", 
  "ธนาคารซีไอเอ็มบี ไทย", 
  "ธนาคารยูโอบี", 
  "ธนาคารสแตนดาร์ดชาร์เตอร์ด", 
  "ธนาคารทิสโก้", 
  "ธนาคารเกียรตินาคินภัทร", 
  "ธนาคารแลนด์ แอนด์ เฮ้าส์"];
