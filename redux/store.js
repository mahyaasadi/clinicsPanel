// import { configureStore } from "@reduxjs/toolkit";
// import {
//   clinicDepartmentApi,
//   middleware as clinicDepartmentMiddleware,
// } from "redux/slices/clinicDepartmentsApiSlice";

// const store = configureStore({
//   reducer: {
//     [clinicDepartmentApi.reducerPath]: clinicDepartmentApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(clinicDepartmentMiddleware),
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import clinicDepartmentApi, {
  middleware as clinicApiMiddleware,
} from "redux/slices/clinicDepartmentApiSlice";

import discountApi, {
  middleware as discountMiddleware,
} from "redux/slices/discountApiSlice";

const store = configureStore({
  reducer: {
    [clinicDepartmentApi.reducerPath]: clinicDepartmentApi.reducer,
    [discountApi.reducerPath]: discountApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clinicApiMiddleware, discountMiddleware),
});

export default store;

