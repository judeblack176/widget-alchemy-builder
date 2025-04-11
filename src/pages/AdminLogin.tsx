
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck } from "lucide-react";
import { useAdminAuth } from "@/components/layouts/AdminLayout";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  
  // In a real app, this would validate against a backend
  // For demo purposes, we're using a simple password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "admin123") {
      // Set admin status in localStorage
      login();
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Navigate to admin dashboard
      navigate("/admin");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <ShieldCheck size={48} className="text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-xs text-gray-500">
                Hint: The password is "admin123"
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
