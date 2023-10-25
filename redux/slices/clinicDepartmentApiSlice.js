// clinicDepartmentApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const clinicDepartmentApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.irannobat.ir/" }),
  endpoints: (builder) => ({
    getAllClinicDepartments: builder.query({
      query: (ClinicID) => `ClinicDepartment/getAll/${ClinicID}`,
      providesTags: ["ClinicDepartment"],
    }),
    addClinicDepartment: builder.mutation({
      query: (newDepartment) => ({
        url: "ClinicDepartment/add",
        method: "POST",
        body: newDepartment,
      }),
      invalidatesTags: ["ClinicDepartment"],
    }),
    editClinicDepartment: builder.mutation({
      query: (updatedDepartment) => ({
        url: "ClinicDepartment/edit",
        method: "PUT",
        body: updatedDepartment,
      }),
      invalidatesTags: ["ClinicDepartment"],
    }),
    deleteClinicDepartment: builder.mutation({
      query: (data) => ({
        url: `ClinicDepartment/delete`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["ClinicDepartment"],
    }),
  }),
});

// You might already have the reducer
export const reducer = clinicDepartmentApi.reducer;

// Make sure to export the middleware too
export const middleware = clinicDepartmentApi.middleware;

export const {
  useGetAllClinicDepartmentsQuery,
  useAddClinicDepartmentMutation,
  useEditClinicDepartmentMutation,
  useDeleteClinicDepartmentMutation,
} = clinicDepartmentApi;

export default clinicDepartmentApi;
