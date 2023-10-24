import React from "react";
import "public/assets/css/bootstrap.min.css";
import "public/assets/css/feathericon.min.css";
import "public/assets/plugins/fontawesome/css/fontawesome.min.css";
import "public/assets/plugins/fontawesome/css/all.min.css";
import "public/assets/css/font-awesome.min.css";
import "public/assets/css/style.css";
import DashboardLayout from "pages/dashboardLayout";
import { Provider } from 'react-redux';
import store from 'redux/store';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <DashboardLayout ClinicUser={pageProps.ClinicUser}>
          <Component {...pageProps} />
        </DashboardLayout>
      </Provider>
    </>
  );
}

