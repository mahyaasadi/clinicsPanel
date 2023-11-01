import createGeneralApiSlice from "redux/slices/ApiSlice";

export const discountApiSlice = createGeneralApiSlice({
  tagType: "ClinicDiscounts",
  getAllUrl: "CenterDiscount/getAll",
  addUrl: "CenterDiscount/add",
  editUrl: "CenterDiscount/update",
  //   deleteUrl: "ClinicDepartment/delete",
});

// Export all the necessary parts
export const reducer = discountApiSlice.reducer;
export const middleware = discountApiSlice.middleware;

export const {
  useGetAllQuery,
  useAddMutation,
  useEditMutation,
  //   useDeleteMutation,
} = discountApiSlice;
