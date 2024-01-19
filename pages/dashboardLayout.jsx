"use client";
import Header from "components/commonComponents/header";
import Sidebar from "components/commonComponents/sidebar";

export default function DashboardLayout({ children, ClinicUser }) {
  return (
    <div>
      <Header className="pb-2" ClinicUser={ClinicUser} />
      <Sidebar ClinicUser={ClinicUser} />
      {children}
      <Footer />
    </div>
  );
}

import Footer from "components/commonComponents/footer";