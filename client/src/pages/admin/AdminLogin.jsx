import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";


const isAdmin = true;
const AdminLogin = () => {

    const secretKey = useInputValidation("")

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  if(isAdmin) return <Navigate to={`/admin/dashboard`}/>
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6
                   transition-all duration-500 ease-out
                   hover:shadow-2xl hover:-translate-y-1 relative top-[-25px]"
      >
        <div className="animate-fade-slide ">
              <h1 className="text-3xl font-bold text-center text-gray-800">
                Admin Login
              </h1>
              <p className="text-center text-gray-500 mt-1">
                Please sign in to the admin account.
              </p>
              <form onSubmit={submitHandler}>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-1.5 border rounded-lg
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:scale-[1.02] placeholder:max-[234px]:text-xs"
                      value={secretKey.value}
                      onChange={secretKey.changeHandler}
                    />
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                             transition-all duration-300
                             hover:bg-blue-700 hover:scale-[1.02]
                             active:scale-95"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
