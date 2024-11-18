import { Helmet } from "react-helmet";
import Separator from "../components/ui/Separator";

const TermsOfService = () => {
  return (
    <div className="flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>Terms of Service</title>
      </Helmet>
      <div className="flex justify-center items-center w-full rounded-md">
        <h1 className="text-md text-primary-foreground font-bold">
          Terms of Service
        </h1>
      </div>
      <div className="flex flex-col items-center gap-2 w-[500px] max-w-full rounded-md text-xs text-primary-foreground">
        <h5 className="text-md w-full font-semibold">Introduction</h5>
        <Separator />
        <p>
          Welcome to Filmpin! These Terms of Service ("Terms") govern your use
          of our website, app, and API (collectively, the "Service"). By
          accessing or using the Service, you agree to be bound by these Terms.
          If you do not agree, please do not use the Service.
        </p>
        <h5 className="text-md font-semibold w-full">Use of the Service</h5>
        <Separator />
        <p>
          Filmpin provides a platform for exploring and interacting with
          movie-related content. You may use the Service for personal,
          non-commercial purposes. You are responsible for maintaining the
          confidentiality of your account credentials and for any activities
          under your account.
        </p>
        <h5 className="text-md font-semibold w-full">TMDb Data Usage</h5>
        <Separator />
        <p>
          Filmpin uses movie data and images provided by [The Movie Database
          (TMDb)](https://www.themoviedb.org). By using the Service, you agree
          to comply with TMDb's{" "}
          <a
            href="https://www.themoviedb.org/terms-of-use"
            className="text-primary-highlight hover:underline"
          >
            Terms of Service
          </a>{" "}
          and acknowledge that proper attribution will be made as required.
        </p>
        <h5 className="text-md font-semibold w-full">Amendments</h5>
        <Separator />
        <p>
          We may update or amend these Terms from time to time. You are bound by
          the version in effect when you access the Service. We recommend that
          you review these Terms periodically.
        </p>
        <h5 className="text-md font-semibold w-full">
          Account Creation and Security
        </h5>
        <Separator />
        <p>
          To access certain features of the Service, you may need to create an
          account. You are responsible for securing your account and promptly
          reporting any unauthorized use. Filmpin is not liable for any loss
          arising from failure to maintain the confidentiality of your account
          information.
        </p>
        <h5 className="text-md font-semibold w-full">
          Privacy and Personal Information
        </h5>
        <Separator />
        <p>
          Your use of the Service is governed by our{" "}
          <a href="/privacy" className="text-primary-highlight hover:underline">
            Privacy Policy
          </a>
          , which details how we collect and use your personal information.
        </p>
        <h5 className="text-md font-semibold w-full">Termination of Access</h5>
        <Separator />
        <p>
          Filmpin reserves the right to suspend or terminate your access to the
          Service if you violate these Terms. You may also terminate your
          account by deactivating it in your account settings.
        </p>
        <h5 className="text-md font-semibold w-full">
          Limitation of Liability
        </h5>
        <Separator />
        <p>
          Filmpin provides the Service "as is" and makes no guarantees regarding
          the availability or accuracy of the Service. We are not responsible
          for any damages arising from your use of the Service, including
          indirect, incidental, or consequential damages.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
