import { useState } from "react";
import Navbar from "./components/Navbar";
import ToolCard from "./components/ToolCard";
import PDFToWord from "./components/PDFToWord";

import {
  FaFilePdf,
  FaFileWord,
  FaImage,
  FaCompress,
  FaObjectGroup,
  FaCut,
  FaExchangeAlt,
  FaFileAlt
} from "react-icons/fa";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState("");

  const pdfTools = [
    {
      icon: <FaFileWord />,
      title: "PDF to Word",
      description: "Convert PDF documents into editable Word files."
    },
    {
      icon: <FaImage />,
      title: "PDF to Image",
      description: "Convert PDF pages into JPG or PNG images."
    },
    {
      icon: <FaCompress />,
      title: "Compress PDF",
      description: "Reduce PDF file size easily."
    },
    {
      icon: <FaObjectGroup />,
      title: "Merge PDF",
      description: "Combine multiple PDF files into one."
    },
    {
      icon: <FaCut />,
      title: "Split PDF",
      description: "Extract pages from your PDF documents."
    },
    {
      icon: <FaExchangeAlt />,
      title: "Word to PDF",
      description: "Convert Word documents into PDF files."
    },
    {
      icon: <FaFileAlt />,
      title: "PDF to TXT",
      description: "Extract text from PDF documents."
    }
  ];

  const filteredTools = pdfTools.filter((tool) =>
    tool.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      {selectedTool === "PDF to Word" ? (
        <div>
          <button
            className="back-button"
            onClick={() => setSelectedTool("")}
          >
            ← Back to Tools
          </button>

          <PDFToWord />
        </div>
      ) : (
        <>
          <section className="hero" id="home">
            <h1>
              All Your File Conversions
              <span> In One Place</span>
            </h1>

            <p>
              Convert, compress, merge and manage your PDF
              and Word documents easily.
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search PDF tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button>Search</button>
            </div>
          </section>

          <section className="tools-section" id="pdf-tools">
            <h2>PDF & Word Tools</h2>

            <p className="section-description">
              Choose a tool to get started with your documents.
            </p>

            <div className="tools-grid">
              {filteredTools.map((tool, index) => (
                <ToolCard
                  key={index}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  onClick={() => {
                    if (tool.title === "PDF to Word") {
                      setSelectedTool("PDF to Word");
                    } else {
                      alert(tool.title + " selected!");
                    }
                  }}
                />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <p className="no-results">No tools found.</p>
            )}
          </section>

          <footer>
            <p>© 2026 FileConvert. All rights reserved.</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;