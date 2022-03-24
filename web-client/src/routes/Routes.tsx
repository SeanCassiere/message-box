import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NoAuthOnlyRoute from "./NoAuthOnlyRoute";
import RequireAuth from "./RequireAuth";
import RequirePermission from "./RequirePermission";
import NavigateToNotFound from "./NavigateToNotFound";

import NotFoundScreen from "../modules/NotFoundScreen";
import LogoutScreen from "../modules/LogoutScreen";
import LoginScreen from "../modules/LoginScreen";
import SuspenseLoadingWrapper from "../shared/components/SuspenseLoadingWrapper";

const ChatScreen = React.lazy(() => import("../modules/ChatScreen"));
const TasksScreen = React.lazy(() => import("../modules/TasksScreen"));
const ReportsScreen = React.lazy(() => import("../modules/ReportsScreen"));
const CalendarScreen = React.lazy(() => import("../modules/CalendarScreen"));
const TeamActivityScreen = React.lazy(() => import("../modules/TeamActivity"));
const SettingsScreen = React.lazy(() => import("../modules/SettingsScreen"));
const RegisterScreen = React.lazy(() => import("../modules/RegisterScreen"));
const ForgotPasswordScreen = React.lazy(() => import("../modules/ForgotPasswordScreen"));
const ConfirmAccountScreen = React.lazy(() => import("../modules/ConfirmAccountScreen"));
const Reset2FAScreen = React.lazy(() => import("../modules/Reset2FAScreen"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes that require the user to be authenticated */}
        <Route element={<RequireAuth />}>
          <Route element={<RequirePermission requiredPermission="task:read" />}>
            <Route path="tasks" element={<TasksScreen />}>
              <Route path="view/:id" element={<TasksScreen />} />
              <Route path=":tab" element={<TasksScreen />} />
            </Route>
          </Route>

          <Route element={<RequirePermission requiredPermission="team-activity:read" />}>
            <Route path="team-activity" element={<TeamActivityScreen />}></Route>
          </Route>

          <Route element={<RequirePermission requiredPermission="calendar:read" />}>
            <Route path="calendar" element={<CalendarScreen />}>
              <Route path=":id" element={<CalendarScreen />} />
            </Route>
          </Route>

          <Route element={<RequirePermission requiredPermission="report:read" />}>
            <Route path="reports" element={<ReportsScreen />}></Route>
          </Route>

          <Route element={<RequirePermission requiredPermission="chat:read" />}>
            <Route path="chat" element={<ChatScreen />}></Route>
          </Route>

          <Route element={<RequirePermission requiredPermission="profile:read" />}>
            <Route path="settings" element={<SettingsScreen />}>
              <Route path=":tab/:module" element={<SettingsScreen />} />
              <Route path=":tab" element={<SettingsScreen />} />
            </Route>
          </Route>
          {/** end of authenticated routes */}
        </Route>

        {/* wo/Auth -> only no-authenticated */}
        <Route
          path="sign-up"
          element={
            <NoAuthOnlyRoute>
              <SuspenseLoadingWrapper>
                <RegisterScreen />
              </SuspenseLoadingWrapper>
            </NoAuthOnlyRoute>
          }
        />

        {/* Full public all routes */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="login" element={<LoginScreen />} />
        <Route
          path="forgot-password/:id"
          element={
            <SuspenseLoadingWrapper>
              <ForgotPasswordScreen />
            </SuspenseLoadingWrapper>
          }
        />
        <Route
          path="reset-2fa/:token"
          element={
            <SuspenseLoadingWrapper>
              <Reset2FAScreen />
            </SuspenseLoadingWrapper>
          }
        />
        <Route
          path="confirm-account/:id"
          element={
            <SuspenseLoadingWrapper>
              <ConfirmAccountScreen />
            </SuspenseLoadingWrapper>
          }
        />
        <Route path="logout" element={<LogoutScreen />} />
        <Route path="not-found" element={<NotFoundScreen />} />
        <Route path="*" element={<NavigateToNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
