import createGeneralApiSlice from "redux/slices/ApiSlice";

// Creating specific API slices
export const clinicDepartmentApi = createGeneralApiSlice({
  tagType: "ClinicDepartment",
  getAllUrl: "ClinicDepartment/getAll",
  addUrl: "ClinicDepartment/add",
  editUrl: "ClinicDepartment/edit",
  deleteUrl: "ClinicDepartment/delete",
});

// Export all the necessary parts
export const reducer = clinicDepartmentApi.reducer;
export const middleware = clinicDepartmentApi.middleware;

export const {
  useGetAllQuery,
  useAddMutation,
  useEditMutation,
  useDeleteMutation,
} = clinicDepartmentApi;
