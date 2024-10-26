import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { ShowPassword } from "../utils/ShowPassword";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";

const SigninForm = ({}) => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [signingIn, setSigningIn] = useState(false);
  const { setToken, setUser, token } = useAuth();
  const { toastError, toastInfo } = useToast();

  const previousPath = location.state?.from || "/home";

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    token && navigate("/home");
  }, [token]);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    setSigningIn(true);
    try {
      const { data } = await axios.post("/auth/sign-in", { email, password });
      setToken(data.accessToken);
      setUser(data.user);
      toastInfo("Signed in!");
      setCredentials({ email: "", password: "" });
      navigate(previousPath);
    } catch (error) {
      const errorMessage = error.response.data.message;
      toastError(`${errorMessage}`);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <form
      className="flex flex-col w-[250px] max-w-full p-4 text-xs text-primary-foreground rounded-md border border-secondary-accent z-10"
      onSubmit={submit}
    >
      <h2 className="w-full text-center pb-4 text-lg font-bold">
        Sign in to Filmpin
      </h2>
      <Input
        required={true}
        type="email"
        placeholder="Email"
        id="email"
        ref={emailRef}
        value={credentials.email}
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
      />
      <div className="relative">
        <Input
          required={true}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          id="password"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          value={credentials.password}
        />
        {credentials.password && (
          <ShowPassword
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}
      </div>
      <Link
        to={`/account/recover`}
        className="pb-2 w-fit outline-none text-primary-foreground text-xs focus:text-primary-highlight focus:underline"
      >
        {" "}
        Forgot password?{" "}
      </Link>
      <Button
        type="submit"
        disabled={signingIn}
        text={`${signingIn ? "Signing in..." : "Sign in"}`}
      />
      <Link
        to={`/account/verify`}
        className="self-center w-fit pt-2 outline-none text-primary-foreground text-xs transition-colors duration-300 focus:text-primary-highlight focus:underline"
      >
        {" "}
        Verify your account{" "}
      </Link>
      <Link
        to={`/sign-up`}
        className="self-center w-fit pt-2 outline-none text-primary-foreground text-xs transition-colors duration-300 focus:text-primary-highlight focus:underline"
      >
        {" "}
        Don't have an account? click here{" "}
      </Link>
    </form>
  );
};

export default SigninForm;
