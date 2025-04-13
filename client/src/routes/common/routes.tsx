// import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import SignIn from "@/page/auth/Sign-in";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import SignUp from "@/page/auth/Sign-up";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import InviteUser from "@/page/invite/InviteUser";
import Tasks from "@/page/workspace/Tasks";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  //   { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  // { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  // { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  // { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];
