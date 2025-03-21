import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-provider";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Outlet />
      </SidebarProvider>
    </AuthProvider>
  );
};

export default AppLayout;
