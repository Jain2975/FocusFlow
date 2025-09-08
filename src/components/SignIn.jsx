import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const SignIn = ({ onBack, onSignIn, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check dummy user credentials
      if (formData.email === "demo@focusflow.com" && formData.password === "demo123") {
        onSignIn({
          id: 1,
          name: "Demo User",
          email: "demo@focusflow.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          joinedDate: "2024-01-15",
          stats: {
            totalSessions: 127,
            totalMinutes: 2840,
            streak: 12,
            achievements: 8
          }
        });
      } else {
        setErrors({ general: "Invalid email or password. Try demo@focusflow.com / demo123" });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@focusflow.com",
      password: "demo123"
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary/20 via-transparent to-meditation/20" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <motion.button
            onClick={onBack}
            className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-zen rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧘‍♀️</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">
                  Sign in to continue your mindful journey
                </p>
              </div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-6"
                >
                  {errors.general}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="zen"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or try demo</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleDemoLogin}
                >
                  Use Demo Account
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={onSwitchToSignUp}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm font-medium text-foreground mb-2">Demo Credentials:</h3>
                <p className="text-xs text-muted-foreground">
                  Email: demo@focusflow.com<br />
                  Password: demo123
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
