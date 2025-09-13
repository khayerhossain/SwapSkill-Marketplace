
import FooterPage from "@/components/shared/Footer";
import NavbarPage from "@/components/shared/Navbar";
import { Toaster } from "react-hot-toast";

const layout = ({ children }) => {
  return (
    <div>
      <NavbarPage />
      <div className="min-h-screen">
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <FooterPage /> 
     
    </div>
  );
};

export default layout;
