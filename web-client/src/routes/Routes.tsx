import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NoAuthOnlyRoute from "./NoAuthOnlyRoute";

import NotFoundScreen from "../modules/NotFoundScreen";
import LogoutScreen from "../modules/LogoutScreen";
import LoginScreen from "../modules/LoginScreen";
import SuspenseLoadingWrapper from "../shared/components/SuspenseLoadingWrapper";
import NavigateToNotFound from "./NavigateToNotFound";
import RequireAuth from "./RequireAuth";

const ChatScreen = lazy(() => import("../modules/ChatScreen"));
const TasksScreen = lazy(() => import("../modules/TasksScreen"));
const ReportsScreen = lazy(() => import("../modules/ReportsScreen"));
const CalendarScreen = lazy(() => import("../modules/CalendarScreen"));
const TeamActivityScreen = lazy(() => import("../modules/TeamActivity"));
const SettingsScreen = lazy(() => import("../modules/SettingsScreen"));
const RegisterScreen = lazy(() => import("../modules/RegisterScreen"));
const ForgotPasswordScreen = lazy(() => import("../modules/ForgotPasswordScreen"));
const ConfirmAccountScreen = lazy(() => import("../modules/ConfirmAccountScreen"));
const Reset2FAScreen = lazy(() => import("../modules/Reset2FAScreen"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes that require the user to be authenticated */}
        <Route element={<RequireAuth />}>
          <Route path="tasks" element={<TasksScreen />}>
            <Route path="view/:id" element={<TasksScreen />} />
            <Route path=":tab" element={<TasksScreen />} />
          </Route>

          <Route path="team-activity" element={<TeamActivityScreen />}></Route>

          <Route path="calendar" element={<CalendarScreen />}>
            <Route path=":id" element={<CalendarScreen />} />
          </Route>

          <Route path="reports" element={<ReportsScreen />}></Route>

          <Route path="chat" element={<ChatScreen />}></Route>

          <Route path="settings" element={<SettingsScreen />}>
            <Route path=":tab/:module" element={<SettingsScreen />} />
            <Route path=":tab" element={<SettingsScreen />} />
          </Route>
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
