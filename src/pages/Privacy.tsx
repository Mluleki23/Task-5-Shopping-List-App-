import "../App.css";

export default function Privacy() {
  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Privacy Policy</h1>
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information
          when you use our Shopping List App.
        </p>
        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (name, email, password)</li>
          <li>Shopping list data you create</li>
          <li>Usage data for app improvement</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to provide the app services, authenticate your account, and store your shopping lists.
          Your data is stored securely and is not shared with third parties.
        </p>
        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through the Contact Us page.
        </p>
      </div>
    </div>
  );
}