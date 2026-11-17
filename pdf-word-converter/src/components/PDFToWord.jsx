import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  Document,
  Packer,
  Paragraph,
  ImageRun,
  PageBreak
} from "docx";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PDFToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setFile(null);
      setMessage("Please select a valid PDF file.");
    }
  };

  const convertPDF = async () => {
    if (!file) {
      setMessage("Please upload a PDF file first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Converting your PDF...");

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer)
      }).promise;

      const children = [];

      let pageWidth = 0;
      let pageHeight = 0;

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({ scale: 1 });

        if (pageNumber === 1) {
          pageWidth = viewport.width;
          pageHeight = viewport.height;
        }

        const renderViewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        canvas.width = renderViewport.width;
        canvas.height = renderViewport.height;

        await page.render({
          canvasContext: context,
          viewport: renderViewport
        }).promise;

        const imageBlob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });

        if (!imageBlob) {
          throw new Error("Could not render PDF page.");
        }

        const imageData = new Uint8Array(
          await imageBlob.arrayBuffer()
        );

        children.push(
          new Paragraph({
            spacing: {
              before: 0,
              after: 0
            },
            children: [
              new ImageRun({
                data: imageData,
                transformation: {
                  width: viewport.width * 96 / 72,
                  height: viewport.height * 96 / 72
                }
              })
            ]
          })
        );

        if (pageNumber < pdf.numPages) {
          children.push(
            new Paragraph({
              children: [new PageBreak()]
            })
          );
        }

        canvas.remove();
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: Math.round(pageWidth * 20),
                  height: Math.round(pageHeight * 20)
                },
                margin: {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                }
              }
            },
            children
          }
        ]
      });

      const blob = await Packer.toBlob(doc);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "") + ".docx";

      link.click();

      URL.revokeObjectURL(url);

      setMessage("PDF converted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Conversion failed. Please try another PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="converter-container">
      <h2>PDF to Word Converter</h2>

      <p>
        Convert your PDF documents into Word files while
        preserving their original appearance.
      </p>

      <div className="upload-box">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
        />

        {file && <p>Selected: {file.name}</p>}

        <button onClick={convertPDF} disabled={loading}>
          {loading ? "Converting..." : "Convert to Word"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default PDFToWord;