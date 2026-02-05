import { useState } from "react";
import { User, Lock, Eye, EyeOff, Shield } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import logo from "figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png";
import maizeFieldBg from "figma:asset/5e25c6c038ecd78f23bb6453b71467354e3bd141.png";

interface LoginProps {
  onLogin: (role: "user" | "admin") => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [userType, setUserType] = useState<"user" | "admin">(
    "user",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 🔔 SEND VERIFICATION EMAIL
      await sendEmailVerification(cred.user);

      alert("Verification email sent. Please check your inbox.");

      onLogin("user");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(userType);
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      onLogin(userType);
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Vibrant Maize Field Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${maizeFieldBg})`,
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Two Column Container */}
      <div className="w-full h-full relative z-10 grid lg:grid-cols-2">
        {/* LEFT SIDE - Logo + Title */}
        <div className="hidden lg:flex flex-col items-center justify-center px-12 xl:px-24 text-white text-center">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img
                src={logo}
                alt="SmartSeed Recommender Logo"
                className="w-28 h-28 xl:w-32 xl:h-32 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Title */}
            <h1 className="text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-8 leading-tight">
              Smart Maize Seed
              <br />
              Recommendations
            </h1>

            {/* Description */}
            <p className="text-base xl:text-lg 2xl:text-xl text-white/90 leading-relaxed">
              Empowering Kenyan farmers with AI-powered seed
              variety recommendations using satellite imagery,
              climate data, and soil analytics for optimal crop
              yields.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form (Exact Copy) */}
        <div className="flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Main Login Container with Glass Effect */}
            <div className="bg-white/98 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Logo and Header - Mobile Only */}
              <div className="lg:hidden text-center pt-4 pb-3 sm:pt-10 sm:pb-8 px-4 sm:px-8 bg-gradient-to-b from-white to-gray-50/50">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 xl:w-20 xl:h-20 flex-shrink-0">
                    <img
                      src={logo}
                      alt="SmartSeed Recommender Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h1 className="text-slate-900 text-xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-left">
                    SmartSeed Recommender
                  </h1>
                </div>
                <p className="text-slate-600 text-xs sm:text-base xl:text-lg font-medium">
                  Kenya Agricultural Intelligence Platform
                </p>
              </div>

              {/* Login Content */}
              <div className="px-4 sm:px-8 xl:px-10 pb-4 sm:pb-10 pt-4 lg:pt-10">
                {/* User Type Toggle - Only show if not in signup mode */}
                {!isSignup && (
                  <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 p-1 sm:p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg sm:rounded-xl shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        setUserType("user");
                        setError("");
                        setEmail("");
                        setPassword("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg transition-all duration-200 text-xs sm:text-base font-medium ${
                        userType === "user"
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                    >
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      User Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserType("admin");
                        setError("");
                        setEmail("");
                        setPassword("");
                      }}
                      className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md sm:rounded-lg transition-all duration-200 text-xs sm:text-base font-medium ${
                        userType === "admin"
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-600/30"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                      }`}
                    >
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                      Admin Login
                    </button>
                  </div>
                )}

                {/* Login/Signup Form */}
                <form
                  onSubmit={
                    isSignup ? handleSignup : handleLogin
                  }
                  className="space-y-3 sm:space-y-5"
                >
                  {/* Full Name Input (Signup Only) */}
                  {isSignup && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) =>
                          setFullName(e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                        className="w-full pl-3 sm:pl-4 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300"
                      />
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder={
                          isSignup
                            ? "your.email@example.com"
                            : userType === "admin"
                              ? "admin@smartseed.ke"
                              : "user@smartseed.ke"
                        }
                        required
                        className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type={
                          showPassword ? "text" : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        required
                        className="w-full pl-9 pr-10 sm:pr-12 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input (Signup Only) */}
                  {isSignup && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type={
                            showPassword ? "text" : "password"
                          }
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          placeholder="Confirm your password"
                          required
                          className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white/80 backdrop-blur-sm transition-all hover:border-gray-300"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl animate-shake">
                      <p className="text-xs sm:text-sm font-medium text-red-800 flex items-center gap-2">
                        <span className="text-red-500">⚠</span>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Login/Signup Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isSignup
                          ? "Creating account..."
                          : "Logging in..."}
                      </span>
                    ) : isSignup ? (
                      "Create Account"
                    ) : (
                      `Login as ${userType === "admin" ? "Admin" : "User"}`
                    )}
                  </button>
                </form>

                {/* Google Login Button */}
                {/* <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Logging in with Google...
                      </span>
                    ) : (
                      "Login with Google"
                    )}
                  </button>
                </div> */}

                {/* Toggle between Login and Signup */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError("");
                      setEmail("");
                      setPassword("");
                      setFullName("");
                      setConfirmPassword("");
                    }}
                    className="text-xs sm:text-sm text-gray-600 hover:text-green-600 font-medium transition-colors"
                  >
                    {isSignup ? (
                      <>
                        Already have an account?{" "}
                        <span className="text-green-600 font-semibold">
                          Login here
                        </span>
                      </>
                    ) : (
                      <>
                        Don't have an account?{" "}
                        <span className="text-green-600 font-semibold">
                          Sign up
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-center">
                <p className="text-xs sm:text-sm text-white font-medium">
                  Empowering farmers with AI and Earth
                  Observation technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}