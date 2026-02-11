import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../utils/config";


const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1` }),
  tagTypes: ["Chat", "User"],
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => ({
        url: "/chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
        query: (name) => ({
            url: `/user/search/?name=${name}`,
            credentials: "include"
        }),
        providesTags: ["User"]
    }),
    sendFriendRequest: builder.mutation({
        query:(data) => ({
            url: "/user/sendrequest",
            method: "PUT",
            credentials:"include",
            body: data
        }),
        invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
        query: () => ({
            url: `/user/getnotifications`,
            credentials: "include"
        }),
        keepUnusedDataFor: 0, // means we are not doing any caching
    }),
    acceptFriendRequest: builder.mutation({
        query:(data) => ({
            url: "/user/acceptrequest",
            method: "PUT",
            credentials:"include",
            body: data
        }),
        invalidatesTags: ["Chat"],
    }),
  }),
});

export default api;
export const { useGetMyChatsQuery, useLazySearchUserQuery, useSendFriendRequestMutation, useGetNotificationsQuery, useAcceptFriendRequestMutation } = api
