import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthRoute from "./AuthRoute";

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
            <AuthRoute>
              <NavigationWrapper>
                <ChatScreen />
              </NavigationWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <AuthRoute>
              <NavigationWrapper>
                <Navigate to="/tasks/today" />
              </NavigationWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/tasks/:tab"
          element={
            <AuthRoute>
              <NavigationWrapper>
                <TasksScreen />
              </NavigationWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/tasks/view/:id"
          element={
            <AuthRoute>
              <NavigationWrapper>
                <TasksScreen />
              </NavigationWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthRoute>
              <NavigationWrapper>
                <SettingsScreen />
              </NavigationWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/settings/:tab"
          element={
            <AuthRoute>
              <NavigationWrapper>
                <SettingsScreen />
              </NavigationWrapper>
            </AuthRoute>
          }
        />
        <Route path="/not-found" element={<NotFoundScreen />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
