import React from "react";
import { Provider } from "react-redux";
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
  return (
    <>
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
  );
}

