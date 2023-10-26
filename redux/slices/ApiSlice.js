// // clinicDepartmentApiSlice.js
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const clinicDepartmentApi = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: "https://api.irannobat.ir/" }),
//   tagTypes: ["ClinicDepartment"],
//   endpoints: (builder) => ({
//     getAllClinicDepartments: builder.query({
//       query: (ClinicID) => `ClinicDepartment/getAll/${ClinicID}`,
//       providesTags: ["ClinicDepartment"],
//     }),
//     addClinicDepartment: builder.mutation({
//       query: (newDepartment) => ({
//         url: "ClinicDepartment/add",
//         method: "POST",
//         body: newDepartment,
//       }),
//       invalidatesTags: ["ClinicDepartment"],
//     }),
//     editClinicDepartment: builder.mutation({
//       query: (updatedDepartment) => ({
//         url: "ClinicDepartment/edit",
//         method: "PUT",
//         body: updatedDepartment,
//       }),
//       invalidatesTags: ["ClinicDepartment"],
//     }),
//     deleteClinicDepartment: builder.mutation({
//       query: (data) => ({
//         url: `ClinicDepartment/delete`,
//         method: "DELETE",
//         body: data,
//       }),
//       invalidatesTags: ["ClinicDepartment"],
//     }),
//   }),
// });

// export const reducer = clinicDepartmentApi.reducer;

// export const middleware = clinicDepartmentApi.middleware;

// export const {
//   useGetAllClinicDepartmentsQuery,
//   useAddClinicDepartmentMutation,
//   useEditClinicDepartmentMutation,
//   useDeleteClinicDepartmentMutation,
// } = clinicDepartmentApi;

// export default clinicDepartmentApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export default function createGeneralApiSlice({
  tagType,
  getAllUrl,
  addUrl,
  editUrl,
  deleteUrl,
}) {
  console.log({ tagType, getAllUrl });
  return createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.irannobat.ir/" }),
    tagTypes: [tagType],
    endpoints: (builder) => ({
      getAll: builder.query({
        query: (ID) => `${getAllUrl}/${ID}`,
        providesTags: [tagType],
      }),
      add: builder.mutation({
        query: (newData) => ({
          url: addUrl,
          method: "POST",
          body: newData,
        }),
        invalidatesTags: [tagType],
      }),
      edit: builder.mutation({
        query: (updatedData) => ({
          url: editUrl,
          method: "PUT",
          body: updatedData,
        }),
        invalidatesTags: [tagType],
      }),
      delete: builder.mutation({
        query: (data) => ({
          url: editUrl,
          method: "DELETE",
          body: data,
        }),
        invalidatesTags: [tagType],
      }),
    }),
  });
}
