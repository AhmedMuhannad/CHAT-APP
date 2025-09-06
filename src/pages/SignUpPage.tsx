import { use, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, MessageSquare, User, Loader2 } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePatter";
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    userName: string;
    profileImage: File | null;
  }>({
    fullName: "",
    email: "",
    password: "",
    userName: "",
    profileImage: null,
  });
  const { signUp, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const sucess = validateForm();
    console.log(sucess);
    if (sucess) {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("userName", formData.userName);
      console.log("data is: ", data);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      signUp(data);
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 ">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {" "}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          <form action="" onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              {" "}
              <label className="label">
                <span className="label-text font-medium">Profile Image</span>
              </label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData({
                      ...formData,
                      profileImage: e.target.files[0],
                    });
                  }
                }}
                className="file-input file-input-bordered w-full"
              />
              <label className="label">
                <span className="label-text font-medium">Full name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  className="input input-bordered  w-full pl-10 focus:outline-hidden"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  className="input input-borderd w-full pl-10 focus:outline-hidden"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  className="input input-borderd w-full pl-10 focus:outline-hidden"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">User name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  className="input input-borderd w-full pl-10 focus:outline-hidden"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </div>
            </div>{" "}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>{" "}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>{" "}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
