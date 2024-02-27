import React from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import store from "redux/store";
import DashboardLayout from "pages/dashboardLayout";
import { PrimeReactProvider } from "primereact/api";
import "public/assets/css/bootstrap.min.css";
import "public/assets/css/feathericon.min.css";
import "public/assets/plugins/fontawesome/css/fontawesome.min.css";
import "public/assets/plugins/fontawesome/css/all.min.css";
import "public/assets/css/font-awesome.min.css";
import "public/assets/css/style.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  let isQRCodePage = false;
  if (
    router.pathname == "/changePatientAvatar" ||
    router.pathname == "/uploadPatientImgFile" ||
    router.pathname == "/patientInquiry"
  ) {
    isQRCodePage = true;
  }

  return (
    <>
      {isQRCodePage ? (
        <>
          <Head>
            <link rel="shortcut icon" href="assets/img/icon/logo-orange.png" />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="assets/img/icon/logo-orange.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="assets/img/icon/logo-orange.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="assets/img/icon/logo-orange.png"
            />
          </Head>
          <Component {...pageProps} />
        </>
      ) : (
        <>
          <Head>
            <link rel="shortcut icon" href="assets/img/icon/logo-orange.png" />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="assets/img/icon/logo-orange.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="assets/img/icon/logo-orange.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="assets/img/icon/logo-orange.png"
            />
          </Head>

          <PrimeReactProvider>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <DashboardLayout ClinicUser={pageProps.ClinicUser}>
                  <Component {...pageProps} />
                </DashboardLayout>
              </QueryClientProvider>
            </Provider>
          </PrimeReactProvider>
        </>
      )}
    </>
  );
}

