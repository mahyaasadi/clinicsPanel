import { configureStore } from "@reduxjs/toolkit";
import clinicDepartmentApi, {
  middleware as clinicApiMiddleware,
} from "redux/slices/clinicDepartmentApiSlice";

const store = configureStore({
  reducer: {
    [clinicDepartmentApi.reducerPath]: clinicDepartmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clinicApiMiddleware), // Add the middleware here
});

export default store;

// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from './slices/userSlice';
// import postsReducer from './slices/postsSlice';

// const store = configureStore({
//     reducer: {
//         user: userReducer,
//         posts: postsReducer
//     }
// });

// export default store;
