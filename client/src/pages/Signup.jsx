import { Helmet } from "react-helmet";
import SignupForm from "../components/forms/SignupForm";

const Signup = () => {
  return (
    <div className="flex flex-col p-4 justify-center items-center h-full w-full text-primary bg-primary rounded-lg">
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <SignupForm />
    </div>
  );
};

export default Signup;
