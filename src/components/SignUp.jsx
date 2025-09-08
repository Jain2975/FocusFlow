import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from "lucide-react";

const SignUp = ({ onBack, onSignUp, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
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
      // Create new user
      onSignUp({
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email,
        avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face`,
        joinedDate: new Date().toISOString().split('T')[0],
        stats: {
          totalSessions: 0,
          totalMinutes: 0,
          streak: 0,
          achievements: 0
        }
      });
      setIsLoading(false);
    }, 1000);
  };

  const passwordRequirements = [
    { text: "At least 6 characters", met: formData.password.length >= 6 },
    { text: "Contains letters", met: /[a-zA-Z]/.test(formData.password) },
    { text: "Passwords match", met: formData.password === formData.confirmPassword && formData.confirmPassword !== "" }
  ];

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
                  <span className="text-2xl">🌱</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Join FocusFlow</h1>
                <p className="text-muted-foreground">
                  Start your mindful productivity journey today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name}</p>
                  )}
                </div>

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
                      placeholder="Create a password"
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Password Requirements:</p>
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-primary text-white' : 'bg-muted'
                        }`}>
                          {req.met && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`text-sm ${req.met ? 'text-primary' : 'text-muted-foreground'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="zen"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={onSwitchToSignIn}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs">✓</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-1">What you'll get:</h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Track your focus sessions and meditation progress</li>
                      <li>• Sync across all your devices</li>
                      <li>• Personalized insights and achievements</li>
                      <li>• Access to premium guided meditations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
