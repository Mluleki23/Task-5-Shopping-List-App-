import "../App.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Shopping List App. All rights reserved.</p>
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <a href="/privacy">Privacy & Security</a>
        </div>
      </div>
    </footer>
  );
}