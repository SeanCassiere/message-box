import { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthWrapper from "./AuthRoute";
import NoAuthOnlyRoute from "./NoAuthOnlyRoute";
import NavigationWrapper from "../shared/components/Layout/NavigationWrapper";

import NotFoundScreen from "../modules/NotFoundScreen";
import LogoutScreen from "../modules/LogoutScreen";
import LoginScreen from "../modules/LoginScreen";
import SuspenseLoadingWrapper from "../shared/components/SuspenseLoadingWrapper";

const ChatScreen = lazy(() => import(/* webpackChunkName: 'ChatScreen' */ "../modules/ChatScreen"));
const TasksScreen = lazy(() => import(/* webpackChunkName: 'TasksScreen' */ "../modules/TasksScreen"));
const ReportsScreen = lazy(() => import(/* webpackChunkName: 'ReportsScreen' */ "../modules/ReportsScreen"));
const CalendarScreen = lazy(() => import(/* webpackChunkName: 'CalendarScreen' */ "../modules/CalendarScreen"));
const SettingsScreen = lazy(() => import(/* webpackChunkName: 'SettingsScreen' */ "../modules/SettingsScreen"));
const RegisterScreen = lazy(() => import(/* webpackChunkName: 'RegisterScreen' */ "../modules/RegisterScreen"));
const ForgotPasswordScreen = lazy(
  () => import(/* webpackChunkName: 'ForgotPasswordScreen' */ "../modules/ForgotPasswordScreen")
);
const ConfirmAccountScreen = lazy(
  () => import(/* webpackChunkName: 'ConfirmAccountScreen' */ "../modules/ConfirmAccountScreen")
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/forgot-password/:id"
          element={
            <SuspenseLoadingWrapper>
              <ForgotPasswordScreen />
            </SuspenseLoadingWrapper>
          }
        />
        <Route
          path="/confirm-account/:id"
          element={
            <SuspenseLoadingWrapper>
              <ConfirmAccountScreen />
            </SuspenseLoadingWrapper>
          }
        />
        <Route path="/logout" element={<LogoutScreen />} />
        <Route
          path="/sign-up"
          element={
            <NoAuthOnlyRoute>
              <SuspenseLoadingWrapper>
                <RegisterScreen />
              </SuspenseLoadingWrapper>
            </NoAuthOnlyRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <ChatScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/tasks"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <Navigate to="/tasks/today" />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/tasks/:tab"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <TasksScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/tasks/view/:id"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <TasksScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/calendar"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <CalendarScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/reports"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <ReportsScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/settings/:tab/:module"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <SettingsScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/settings/:tab"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <SettingsScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <SettingsScreen />
              </NavigationWrapper>
            </AuthWrapper>
          }
        />
        <Route path="/not-found" element={<NotFoundScreen />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
