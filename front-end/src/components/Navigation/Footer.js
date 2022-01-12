import React from "react";
import "./footer.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-text flex">REACT REDUX EXPRESS SEQUELIZE PSQL</div>
      <div className="footer-container">
        <a href="https://github.com/cra88y/infininote" className="footer-link">
          GITHUB
        </a>
        <a href="https://www.linkedin.com/in/camer0n/" className="footer-link">
          LINKEDIN
        </a>
      </div>
    </footer>
  );
}
