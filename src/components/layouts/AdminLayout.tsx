
import { ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Simple admin authentication - in a real app, this would connect to a backend
const isAdmin = () => {
  try {
    return localStorage.getItem("isAdmin") === "true";
  } catch {
    return false;
  }
};

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);
  
  const login = () => {
    localStorage.setItem("isAdmin", "true");
  };
  
  const logout = () => {
    localStorage.removeItem("isAdmin");
  };
  
  return { isAdmin: isAdmin(), login, logout };
};

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { isAdmin, logout } = useAdminAuth();
  const navigate = useNavigate();
  
  if (!isAdmin) return null;
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft size={16} className="mr-1" /> Back to Builder
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-widget-blue flex items-center">
              <ShieldCheck size={24} className="mr-2" />
              Admin Dashboard: {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/library">
              <Button variant="outline" className="mr-2">Widget Library</Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
