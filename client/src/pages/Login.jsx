import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducer/auth";
import { server } from "../utils/config";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single", 3);
  const dispatch = useDispatch();
  const handleSignIn = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...")
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${server}/api/v1/user/signin`,
        {
          username: username.value,
          password: password.value,
        },
        config,
      );
      dispatch(userExists(response.data.user));
      toast.success(response.data.message , {
        id: toastId
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Something went wrong!", {
        id: toastId
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...")
    setIsLoading(true);
    console.log("hey");
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    try {
      const response = await axios.post(
        `${server}/api/v1/user/signup`,
        formData,
        {
          withCredentials: true,
          "Content-Type": "multipart/form-data",
        },
      );
      dispatch(userExists(response.data.user));
      toast.success(response.data.message, {
        id: toastId
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Something went wrong!", {
        id: toastId
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6
                   transition-all duration-500 ease-out
                   hover:shadow-2xl hover:-translate-y-1 relative top-[-25px]"
      >
        <div key={isLogin ? "login" : "signup"} className="animate-fade-slide ">
          {isLogin ? (
            <>
              <h1 className="text-3xl font-bold text-center text-gray-800">
                Welcome Back 👋
              </h1>
              <p className="text-center text-gray-500 mt-1">
                Please sign in to your account.
              </p>
              <form onSubmit={handleSignIn}>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="value"
                      placeholder="abcd@example.com"
                      className="w-full px-4 py-1.5 border rounded-lg
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={username.value}
                      onChange={username.changeHandler}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-1.5 border rounded-lg
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={password.value}
                      onChange={password.changeHandler}
                    />
                  </div>

                  <div className="flex justify-end text-sm">
                    <span className="text-blue-600 cursor-pointer hover:underline">
                      Forgot password?
                    </span>
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                             transition-all duration-300
                             hover:bg-blue-700 hover:scale-[1.02]
                             active:scale-95"
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don’t have an account?{" "}
                <span
                  disabled={isLoading}
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center text-gray-800">
                Welcome to Howdy 🚀
              </h1>
              <p className="text-center text-gray-500 mt-1">
                Create your account to get started.
              </p>
              {/* Profile Upload */}
              <div className="flex justify-center mt-4">
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={avatar.changeHandler}
                />

                <div className="relative">
                  {/* Avatar circle (NOT clickable) */}
                  <div
                    className="w-24 h-24 rounded-full border-2 border-gray-300
                  bg-gray-50 overflow-hidden"
                  >
                    {/* Head & Neck Icon */}
                    {avatar.preview ? (
                      <img
                        src={avatar.preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-10 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 14c3.866 0 7-3.134 7-7S15.866 0 12 0 5 3.134 5 7s3.134 7 7 7zM2 24c0-5.523 4.477-10 10-10s10 4.477 10 10"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Camera Badge (ONLY clickable element) */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-600
                 flex items-center justify-center text-white shadow-md
                 transition hover:scale-110 active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7h3l2-3h8l2 3h3v13H3V7z"
                      />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
              {avatar.error && (
                <p className="text-red-600 text-center mt-2">{avatar.error}</p>
              )}

              <form onSubmit={handleSignUp}>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      placeholder="Enter your name"
                      className="w-full px-4 py-1.5 border rounded-lg
               transition-all duration-300
               focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={name.value}
                      onChange={name.changeHandler}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <input
                      placeholder="Enter your bio"
                      className="w-full px-4 py-1.5 border rounded-lg
               transition-all duration-300
               focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={bio.value}
                      onChange={bio.changeHandler}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      placeholder="Enter your username"
                      className="w-full px-4 py-1.5 border rounded-lg
               transition-all duration-300
               focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={username.value}
                      onChange={username.changeHandler}
                    />
                    {username.error && (
                      <p className="text-red-600 mt-2">{username.error}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-1.5 border rounded-lg
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={password.value}
                      onChange={password.changeHandler}
                    />
                    {password.error && (
                      <p className="text-red-600 mt-2">{password.error}</p>
                    )}
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                             transition-all duration-300
                             hover:bg-blue-700 hover:scale-[1.02]
                             active:scale-95"
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <span
                  disabled={isLoading}
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Sign in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
