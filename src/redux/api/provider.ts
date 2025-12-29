// import { createApi,  fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://7a3ecf88eb3d.ngrok-free.app/api",
  baseUrl: " https://957695527930.ngrok-free.app/api",
  prepareHeaders: (headers) => {
    const auth = localStorage.getItem("token");
    headers.set("ngrok-skip-browser-warning", "69420");
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
const PERMISSION_TAG = "PERMISSIONS";
const ACTIVITY_TAG = "ACTIVITY";
const SUPPORT_TAG = "SUPPORT";
const AUDIT_TAG = "AUDIT";
export const providerApi = createApi({
  reducerPath: "providerApi",
  baseQuery,
  tagTypes: [
    AUDIT_TAG,
    USER_TAG,
    CLIENT_TAG,
    GOAL_TAG,
    PERMISSION_TAG,
    ACTIVITY_TAG,
    SUPPORT_TAG,
  ],
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
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/provider/logout",
        method: "PUT",
      }),
      invalidatesTags: [USER_TAG],
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

    getUserProfile: builder.query<any, void>({
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

    getClientProfile: builder.query<any, any>({
      query: ({ clientId }) => ({
        url: `/provider/clientProfile?clientId=${clientId}`,
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

    getGoals: builder.query<any, void>({
      query: () => ({
        url: "/provider/goal",
      }),
      providesTags: [GOAL_TAG],
    }),
    deleteGoal: builder.mutation({
      query: (goalId) => ({
        url: `/provider/deleteGoal?goalId=${goalId}`,
        method: "DELETE",
      }),
      invalidatesTags: [GOAL_TAG],
    }),

    editGoal: builder.mutation({
      query: ({ goalId, data }) => ({
        url: `/provider/editGoalBank?goalId=${goalId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [GOAL_TAG],
    }),
    viewPermissions: builder.query<any, string>({
      query: (providerId) => ({
        url: `/provider/viewPermission?providerId=${providerId}`,
      }),
      providesTags: [PERMISSION_TAG],
    }),

    updateProviderPermissions: builder.mutation<
      any,
      { providerId: string; permissions: string[] }
    >({
      query: (body) => ({
        url: `/provider/update-permissions`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [PERMISSION_TAG],
    }),
    viewAudits: builder.query({
      query: ({ page, search, action, resource, startDate, endDate }) => {
        const queryParams = new URLSearchParams();

        if (page) queryParams.append("page", page);
        if (search) queryParams.append("search", search);
        if (action && action !== "all") queryParams.append("action", action);
        if (resource && resource !== "all")
          queryParams.append("resource", resource);
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        return {
          url: `/logs/view?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: [AUDIT_TAG],
    }),
    viewStats: builder.query<any, void>({
      query: () => ({
        url: "/logs/statistics",
      }),
    }),

    getAssignedClients: builder?.query<any, void>({
      query: () => ({
        url: "/provider/assigned",
      }),
    }),

    addItpGoalToClient: builder.mutation({
      query: (body) => ({
        url: "/provider/addClientGoal",
        method: "POST",
        body,
      }),
      invalidatesTags: [CLIENT_TAG, GOAL_TAG],
    }),

    updateClient: builder.mutation({
      query: ({ clientId, data }) => ({
        url: `/provider/updateClient?clientId=${clientId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [CLIENT_TAG],
    }),
    sessionHistory: builder.query<any, any>({
      query: (clientId) => ({
        url: `/session/client?clientId=${clientId}`,
      }),
    }),
    updateItpGoal: builder.mutation({
      query: ({ clientId, data, itpGoalId }) => ({
        url: `/provider/update-itp?clientId=${clientId}&itpGoalId=${itpGoalId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [CLIENT_TAG],
    }),
    startSession: builder.mutation({
      query: (body) => ({
        url: "/session/start",
        method: "POST",
        body,
      }),
    }),
    collectSessionData: builder.mutation({
      query: (body) => ({
        url: "/session/collect",
        method: "POST",
        body,
      }),
      invalidatesTags: [CLIENT_TAG],
    }),

    generateNotes: builder.mutation({
      query: (sessionId) => ({
        url: `/session/notes?sessionId=${sessionId}`,
        method: "POST",
      }),
    }),
    abandonSession: builder.mutation({
      query: (sessionId) => ({
        url: `/session/abandon?sessionId=${sessionId}`,
        method: "DELETE",
      }),
    }),
    addActivity: builder.mutation({
      query: (body) => ({
        url: "/session/addActivity",
        method: "POST",
        body,
      }),
      invalidatesTags: [ACTIVITY_TAG],
    }),
    addSupport: builder.mutation({
      query: (body) => ({
        url: "/session/addSupport",
        method: "POST",
        body,
      }),
      invalidatesTags: [SUPPORT_TAG],
    }),
    getActivities: builder.query<any, void>({
      query: () => ({
        url: "/session/activity",
        method: "GET",
      }),
      providesTags: [ACTIVITY_TAG],
    }),
    getSupports: builder.query<any, void>({
      query: () => ({
        url: "/session/support",
        method: "GET",
      }),
      providesTags: [SUPPORT_TAG],
    }),
    saveSignature: builder.mutation({
      query: (body) => ({
        url: "/session/report",
        method: "PUT",
        body,
      }),
    }),

    getArchivedGoals: builder.query<any, any>({
      query: (clientId) => ({
        url: `/provider/archived?clientId=${clientId}`,
      }),
    }),
    progressReport: builder.query<any, any>({
      query: (clientId) => ({
        url: `/provider/progressReport?clientId=${clientId}`,
      }),
    }),
    goalReview: builder.query<any, any>({
      query: (clientId) => ({
        url: `/provider/goalProgress?clientId=${clientId}`,
      }),
    }),

    submitTicket: builder.mutation({
      query: (body) => ({
        url: "/org/submit",
        method: "POST",
        body,
      }),
    }),

    //report module-------------------
    reportsOverview: builder.query<any, { dateRange?: string } | void>({
      query: (params) => ({
        url: `/org/overview`,
        params: {
          dateRange: params?.dateRange ?? "30",
        },
      }),
    }),

    clientProgressReports: builder.query<
      any,
      { dateRange?: string; selectedClient?: string } | void
    >({
      query: (params) => ({
        url: `/org/client-progress`,
        params: {
          dateRange: params?.dateRange ?? "30",
          selectedClient: params?.selectedClient ?? "all",
        },
      }),
    }),

    providerActivityReports: builder.query<
      any,
      { dateRange?: string; selectedProvider?: string } | void
    >({
      query: (params) => ({
        url: `/org/provider-activity`,
        params: {
          dateRange: params?.dateRange ?? "30",
          selectedProvider: params?.selectedProvider ?? "all",
        },
      }),
    }),

    // download apis
    donloadFedecDistribution: builder.mutation({
      query: (body) => ({
        url: "/download/fedec",
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
    }),
    downloadSessionTrend: builder.mutation({
      query: (body) => ({
        url: "/download/sessionTrends",
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
    }),
    downloadDaignosisBreakdown: builder.mutation({
      query: (body) => ({
        url: "/download/breakDown",
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
    }),

    downloadGoalReviewReport: builder.mutation({
      query: (body) => ({
        url: "/download/goalReview",
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
    }),
    downloadSessionNotes: builder.mutation({
      query: (body) => ({
        url: "/download/sessionNote",
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
    }),
    downloadAuditlogs: builder.mutation<any, void>({
      query: (body) => ({
        url: "/download/audits",
        method: "POST",
        body,
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
    }),

    downloadSessionHistory: builder.mutation<any, void>({
      query: (goalBankId) => ({
        url: `/download/session?goalBankId=${goalBankId}`,
        method: "POST",
        responseHandler: (response) => response.blob(),
      }),
      invalidatesTags: [AUDIT_TAG],
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
  useViewStatsQuery,
  useUpdateProviderPermissionsMutation,
  useGetAssignedClientsQuery,
  useStartSessionMutation,
  useGetClientProfileQuery,
  useAddItpGoalToClientMutation,
  useUpdateClientMutation,
  useUpdateItpGoalMutation,
  useCollectSessionDataMutation,
  useGenerateNotesMutation,
  useAbandonSessionMutation,
  useSessionHistoryQuery,
  useGetActivitiesQuery,
  useGetSupportsQuery,
  useAddActivityMutation,
  useAddSupportMutation,
  useSaveSignatureMutation,
  useGetArchivedGoalsQuery,
  useProgressReportQuery,
  useDeleteGoalMutation,
  useEditGoalMutation,
  useLogoutMutation,
  useGoalReviewQuery,
  useClientProgressReportsQuery,
  useProviderActivityReportsQuery,
  useReportsOverviewQuery,
  useSubmitTicketMutation,
  useDonloadFedecDistributionMutation,
  useDownloadSessionTrendMutation,
  useDownloadDaignosisBreakdownMutation,
  useDownloadGoalReviewReportMutation,
  useDownloadSessionNotesMutation,
  useDownloadAuditlogsMutation,
  useDownloadSessionHistoryMutation,
} = providerApi;
