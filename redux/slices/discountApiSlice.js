import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const discountApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.irannobat.ir/" }),
  tagTypes: ["discounts"],
  reducerPath: "discounts",
  endpoints: (builder) => ({
    getAllDiscounts: builder.query({
      query: (ClinicID) => `CenterDiscount/getAll/${ClinicID}`,
      providesTags: ["discounts"],
    }),
    addDiscount: builder.mutation({
      query: (newDiscount) => ({
        url: "CenterDiscount/add",
        method: "POST",
        body: newDiscount,
      }),
      invalidatesTags: ["discounts"],
    }),
    editDiscount: builder.mutation({
      query: (updatedDiscount) => ({
        url: "CenterDiscount/update",
        method: "PUT",
        body: updatedDiscount,
      }),
      invalidatesTags: ["discounts"],
    }),
    deleteDiscount: builder.mutation({
      query: (data, DiscountID) => ({
        url: `CenterDiscount/delete/${DiscountID}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["discounts"],
    }),
  }),
});

export const reducer = discountApi.reducer;

export const middleware = discountApi.middleware;

export const {
  useGetAllDiscountsQuery,
  useAddDiscountMutation,
  useEditDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;

export default discountApi;
