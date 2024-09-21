import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const Verification = () => {
  const [searchParams] = useSearchParams();
  z;
  const [message, setMessage] = useState(null);
  const verificationToken = searchParams.get("verificationToken");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!verificationToken) {
        setMessage("Missing verification token.");
        return;
      }

      try {
        const response = await axios.post(
          `/email/verify?verificationToken=${verificationToken}`
        );
        setMessage(response.data.message);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to verify your account.";
        setMessage(errorMessage);
      }
    };

    verifyAccount();
  }, [verificationToken]);

  return (
    <div
      className="flex flex-col p-4 justify-center items-center h-full w-full
      text-primary-foreground border border-secondary-accent rounded-md"
    >
      <Helmet>
        <title>Verify Your Account</title>
      </Helmet>
      <div
        className="flex flex-col w-[250px] max-w-full p-4 gap-2 text-xs text-primary-foreground
        bg-accent drop-shadow-sm rounded-md"
      >
        <div className="flex justify-center">
          <h1 className="text-primary-highlight text-lg font-bold">Film</h1>
          <h1 className="text-primary-foreground text-lg font-bold">pin</h1>
        </div>
        <h2 className="w-full text-center text-md font-semibold">
          Account Verification
        </h2>
        <p className="text-primary-foreground text-center text-xs">{message}</p>
      </div>
    </div>
  );
};

export default Verification;
