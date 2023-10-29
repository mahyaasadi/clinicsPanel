import createGeneralApiSlice from "redux/slices/ApiSlice";

export const clinicServicesApi = createGeneralApiSlice({
  tagType: "ClinicServices",
  getAllUrl: "ClinicDepartment/getOne",
  addUrl: "ClinicDepartment/AddService",
  editUrl: "ClinicDepartment/EditService",
  deleteUrl: "ClinicDepartment/DeleteService",
});

export const reducer = clinicServicesApi.reducer;
export const middleware = clinicServicesApi.middleware;

export const {
  useGetAllQuery,
  useAddMutation,
  useEditMutation,
  useDeleteMutation,
} = clinicServicesApi;
