import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthWrapper from "./AuthRoute";

import NotFoundScreen from "../modules/NotFoundScreen/NotFoundScreen";

import ChatScreen from "../modules/ChatScreen/ChatScreen";
import LoginScreen from "../modules/LoginScreen/LoginScreen";
import LogoutScreen from "../modules/LogoutScreen/LogoutScreen";
import RegisterScreen from "../modules/RegisterScreen/RegisterScreen";
import NoAuthOnlyRoute from "./NoAuthOnlyRoute";
import TasksScreen from "../modules/TasksScreen/TasksScreen";
import NavigationWrapper from "../shared/components/NavigationWrapper/NavigationWrapper";
import ForgotPasswordScreen from "../modules/ForgotPassword/ForgotPassword";
import ConfirmAccountScreen from "../modules/ConfirmAccountScreen/ConfirmAccountScreen";
import SettingsScreen from "../modules/SettingsScreen";
import CalendarScreen from "../modules/CalendarScreen/CalendarScreen";
import ReportsScreen from "../modules/ReportsScreen/ReportsScreen";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password/:id" element={<ForgotPasswordScreen />} />
        <Route path="/confirm-account/:id" element={<ConfirmAccountScreen />} />
        <Route path="/logout" element={<LogoutScreen />} />
        <Route
          path="/sign-up"
          element={
            <NoAuthOnlyRoute>
              <RegisterScreen />
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
          path="/settings"
          element={
            <AuthWrapper>
              <NavigationWrapper>
                <SettingsScreen />
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
          path="/settings/:tab"
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
