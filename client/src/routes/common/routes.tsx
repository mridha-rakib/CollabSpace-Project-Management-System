// import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { AUTH_ROUTES } from "./routePaths";
import SignUp from "@/page/auth/Sign-up";

export const authenticationRoutePaths = [
  //   { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  //   { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];
