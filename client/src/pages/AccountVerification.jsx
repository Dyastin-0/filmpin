import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useToast } from "../components/hooks/useToast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Helmet } from "react-helmet";

const AccountVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);
  const [sendingLink, setSendingLink] = useState(false);
  const [email, setEmail] = useState("");
  const { toastError, toastInfo } = useToast();

  const previousLocation = location.state?.from;

  useEffect(() => {
    user && navigate("/home");
  }, [user]);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSendingLink(true);
    try {
      await axios.post(`email/verify/sendVerification?email=${email}`);
      toastInfo("Verification link sent!");
      setEmail("");
      navigate("/sign-in");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification link.";
      toastError(`${errorMessage}`);
    } finally {
      setSendingLink(false);
    }
  };

  return (
    <div
      className="flex flex-col p-4 justify-center items-center h-full w-full
      text-primary-foreground bg-primary rounded-md"
    >
      <Helmet>
        <title>Send Verification Link</title>
      </Helmet>
      <form
        className="flex flex-col w-[250px] max-w-full p-4 gap-4 text-xs text-primary-foreground
				border border-secondary-accent rounded-md"
        onSubmit={submit}
      >
        <h2 className="w-full text-center text-lg font-bold">
          Send Verification Link
        </h2>
        {previousLocation === "/sign-up" && (
          <>
            <p className="text-primary-foreground text-xs">
              You can send another verification link if you did not receive one.
            </p>
            <p className="text-primary-foreground text-xs">
              Links are only valid for 5 minutes.
            </p>
          </>
        )}
        <Input
          required={true}
          type="email"
          placeholder="Email"
          id="email"
          ref={emailRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          disabled={sendingLink}
          text={`${sendingLink ? "Sending..." : "Send Verification Link"}`}
        />
      </form>
    </div>
  );
};

export default AccountVerification;
