import React from "react";
import "public/assets/css/bootstrap.min.css";
import "public/assets/css/feathericon.min.css";
import "public/assets/plugins/fontawesome/css/fontawesome.min.css";
import "public/assets/plugins/fontawesome/css/all.min.css";
import "public/assets/css/font-awesome.min.css";
import "public/assets/css/style.css";
import DashboardLayout from "pages/dashboardLayout";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <DashboardLayout ClinicUser={pageProps.ClinicUser}>
        <Component {...pageProps} />
      </DashboardLayout>
    </>
  );
}

