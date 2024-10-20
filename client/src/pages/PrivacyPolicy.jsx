import { Helmet } from "react-helmet";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md">
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <div className="flex justify-center items-center w-full rounded-md">
        <h1 className="text-3xl text-primary-foreground font-bold">
          Privacy Policy
        </h1>
      </div>
      <div className="flex flex-col items-center gap-4 w-full rounded-md text-xs text-primary-foreground">
        <p className="w-full md:w-[400px] lg:w-[500px]">
          Your privacy is important to us. It is Filmpin's policy to respect
          your privacy regarding any information we may collect from you across
          our website,{" "}
          <a
            href="https://filmpin.dyastin.tech"
            className="text-primary-highlight hover:underline"
          >
            https://filmpin.dyastin.tech
          </a>
          , and other sites we own and operate.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          This Privacy Policy applies to all personal information submitted by
          you on Filmpin, or via use of the Filmpin API, and any information
          that may be automatically retrieved through your use of these
          channels.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          By accepting our Terms of Use and this Privacy Policy when you create
          a Filmpin account, and by accessing and using the Website, App, or
          API, you consent to the collection, use, disclosure, storage, and
          processing of your information in accordance with this Privacy Policy.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          We may amend or update this Privacy Policy from time to time, with or
          without notice to you. You agree to be bound by the Privacy Policy
          that is in effect at the time you access and use the Website, App, or
          API.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          In order to use particular services that we offer, you may need to
          submit certain personal information such as your email address, name,
          address, telephone number, gender, and date of birth. You may be asked
          to submit further information from time to time.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          A cookie is a small piece of data that is stored on your computer or
          mobile device. Like many websites, we use cookies and similar
          technologies to collect additional website usage data and to operate
          our services. Although most web browsers automatically accept cookies,
          many browsers’ settings can be set to decline cookies or alert you
          when a website is attempting to place a cookie on your computer.
          However, some of our services may not function properly if you disable
          cookies. When your browser or device allows it, we use both session
          cookies and persistent cookies to keep you signed in, to better
          understand how you interact with our services, to monitor aggregate
          usage patterns, and to personalize and otherwise operate our services
          such as by providing account security and personalized content.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          The personal information you provide us will only be used in relation
          to the services we provide you, to communicate with you in relation to
          our services, or to cooperate with any government, industry, or
          regulatory authorities.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          You may request at any time to access the personal information that we
          hold on your behalf or to correct or update any of your personal
          information (to the extent that you are unable to do so yourself on
          the Website). If you have registered an account with Filmpin, you can
          access, correct, delete, or modify the personal information you
          provided to us and associated with your account via your Settings
          page.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          We will securely store your personal information, although you
          acknowledge and agree that your personal information may be
          transferred outside of your country in connection with the services we
          offer.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          We will hold your personal information both before and after the
          deactivation of your account, but only for as long as we are lawfully
          entitled to do so, or until you request that we permanently delete it.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          Your account can be deactivated in Settings, and you can request
          permanent deletion as part of this process. When deactivated, your
          Filmpin account (including your username, profile, and content) will
          no longer be viewable on the Website, App, or API, but they will be
          retained on our servers unless and until permanent deletion is
          completed, if requested. It is possible to reactivate your account at
          any time prior to a permanent deletion. We cannot restore permanently
          deleted accounts.
        </p>
        <p className="w-full md:w-[400px] lg:w-[500px]">
          You must keep any login, password, or account information relating to
          your use of the Website secure at all times, and must immediately
          notify us of any unauthorized use of such information or any other
          breach of security. We will not be liable for any loss or damage if
          you fail to comply with this security obligation.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
