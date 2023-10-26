// import { configureStore } from "@reduxjs/toolkit";
// import clinicDepartmentApi, {
//   middleware as clinicApiMiddleware,
// } from "redux/slices/clinicDepartmentApiSlice";

// const store = configureStore({
//   reducer: {
//     [clinicDepartmentApi.reducerPath]: clinicDepartmentApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(clinicApiMiddleware), // Add the middleware here
// });

import { configureStore } from "@reduxjs/toolkit";
import {
  clinicDepartmentApi,
  middleware as clinicDepartmentMiddleware,
} from "redux/slices/clinicDepartmentsApiSlice";

// Other slices can be imported in a similar manner:
// import {
//   clinicServicesApi,
//   middleware as clinicServiceMiddleware,
// } from "redux/slices/clinicServicesApiSlice";

const store = configureStore({
  reducer: {
    [clinicDepartmentApi.reducerPath]: clinicDepartmentApi.reducer,
    // [clinicServicesApi.reducerPath]: clinicServicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      clinicDepartmentMiddleware
      // clinicServiceMiddleware
    ),
});

export default store;

