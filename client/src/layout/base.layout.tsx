import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const BaseLayout = () => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full mx-auto h-auto ">
          <Outlet />
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
