import { Helmet } from "react-helmet";
import SigninForm from "../components/forms/SigninForm";

const Signin = () => {
  return (
    <div className="flex flex-col p-4 justify-center items-center h-full w-full text-primary bg-primary rounded-lg">
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <SigninForm />
    </div>
  );
};

export default Signin;
