// import { createApi,  fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:2001/api",
  prepareHeaders: (headers) => {
    const auth = localStorage.getItem("token");
    if (auth) {
      headers.set("Authorization", `Bearer ${auth}`);
    }
    return headers;
  },
});
export interface ProviderResponse {
  success: boolean;
  message: string;
  data: any[];
}


const USER_TAG = "USER";
const CLIENT_TAG = "CLIENT";
const GOAL_TAG = "GOAL";
export const providerApi = createApi({
  reducerPath: "providerApi",
  baseQuery,
  tagTypes: [USER_TAG, CLIENT_TAG, GOAL_TAG],
  endpoints: (builder) => ({
    orgRegistration: builder.mutation({
      query: (body) => ({
        url: "/org/register",
        method: "POST",
        body,
      }),
    }),
    providerLogin: builder.mutation({
      query: (body) => ({
        url: "/provider/login",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/provider/verify",
        method: "PUT",
        body,
      }),
    }),

    sendOtp: builder.mutation({
      query: (body) => ({
        url: "/provider/send",
        method: "PUT",
        body,
      }),
    }),

    getUserProfile: builder.query<void, void>({
      query: () => ({
        url: "/provider/profile",
      }),
      providesTags: [USER_TAG],
    }),
    getAllClients: builder.query<any, void>({
      query: () => ({
        url: "/provider/getClients",
      }),
      providesTags: [CLIENT_TAG],
    }),

    addClient: builder.mutation({
      query: (body) => ({
        url: "/provider/addClient",
        method: "POST",
        body,
      }),
      invalidatesTags: [CLIENT_TAG],
    }),
    getProviders: builder.query<ProviderResponse, void>({
      query: () => ({
        url: "/provider/getProviders",
      }),
      providesTags: [USER_TAG],
    }),

    addProvider: builder.mutation({
      query: (body) => ({
        url: "/provider/addProvider",
        method: "POST",
        body,
      }),
      invalidatesTags: [USER_TAG],
    }),
    updateProvider: builder.mutation({
      query: ({ providerId, body }) => ({
        url: `/provider/updatePro?providerId=${providerId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: [USER_TAG],
    }),

    addGoal: builder.mutation({
      query: (body) => ({
        url: "/provider/addGoal",
        method: "POST",
        body,
      }),
      invalidatesTags: [GOAL_TAG],
    }),

    getGoals : builder.query<any, void>({
        query: ()=>({
            url:'/provider/goal'
        }),
        providesTags:[GOAL_TAG]
    }),
    viewPermissions: builder.query<any, void>({
        query:(providerId)=> ({
           url:`/provider/viewPermission?providerId=${providerId}` // pending
        })
    }),
    viewAudits: builder.query({
  query: ({ page, search, action, resource, startDate, endDate }) => {
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page);
    if (search) queryParams.append("search", search);
    if (action && action !== "all") queryParams.append("action", action);
    if (resource && resource !== "all") queryParams.append("resource", resource);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    return {
      url: `/logs/view?${queryParams.toString()}`,
      method: "GET",
    };
  },
}),
     viewStats: builder.query<any, void>({
         query: ()=>({
            url:'/logs/statistics'
        }),
     }),
  }),
});

export const {
  useProviderLoginMutation,
  useOrgRegistrationMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
  useGetUserProfileQuery,
  useGetAllClientsQuery,
  useAddClientMutation,
  useGetProvidersQuery,
  useAddProviderMutation,
  useUpdateProviderMutation,
  useAddGoalMutation,
  useGetGoalsQuery,
  useViewPermissionsQuery,
  useViewAuditsQuery,
  useViewStatsQuery
} = providerApi;
