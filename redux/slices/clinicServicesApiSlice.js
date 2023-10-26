import createGeneralApiSlice from "redux/slices/ApiSlice";

// Creating specific API slices
export const clinicServicesApi = createGeneralApiSlice({
  tagType: "ClinicServices",
  //   getAllUrl: "ClinicDepartment/getAll",
  addUrl: "ClinicDepartment/EditService",
  editUrl: "ClinicDepartment/EditService",
  deleteUrl: "ClinicDepartment/DeleteService",
});

// Export all the necessary parts
export const reducer = clinicServicesApi.reducer;
export const middleware = clinicServicesApi.middleware;

export const {
  useGetAllQuery,
  useAddMutation,
  useEditMutation,
  useDeleteMutation,
} = clinicServicesApi;
