import { FaFilePdf } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaFilePdf />
        <span>FileConvert</span>
      </div>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#pdf-tools">PDF Tools</a>
        <a href="#word-tools">Word Tools</a>
      </div>

      <button className="nav-button">
        Get Started
      </button>
    </nav>
  );
}

export default Navbar;