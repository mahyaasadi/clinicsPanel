import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export default function createGeneralApiSlice({
  tagType,
  getAllUrl,
  addUrl,
  editUrl,
  deleteUrl,
}) {
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
          url: deleteUrl,
          method: "DELETE",
          body: data,
        }),
        invalidatesTags: [tagType],
      }),
    }),
  });
}