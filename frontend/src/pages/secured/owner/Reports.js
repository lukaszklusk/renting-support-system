import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import useData from "../../../hooks/useData";

import { useUserReport } from "../../../hooks/useReports";

import opracowanieparm1617_20170110 from "./opracowanieparm1617_20170110.pdf";
import { saveAs } from "file-saver";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Reports = () => {
  const { username } = useData();
  const getUserReport = useUserReport();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);

  // const pdfURL =
  //   "/Users/krzysiekmiskowicz/Downloads/opracowanieparm1617_20170110.pdf";

  // const pdfURL = "./opracowanieparm1617_20170110.pdf";

  const handleClick = async () => {
    console.log("+");
    try {
      const data = await getUserReport(username);
      // console.log("data:", data);
      const pdfBlob = new Blob([data], { type: "application/pdf" });
      console.log("pdfBlob:", pdfBlob);
      const url = URL.createObjectURL(pdfBlob);
      console.log("url:", url);
      console.log("saving pdf");
      saveAs(pdfBlob, "test.pdf");
      setPdfUrl(url);
    } catch (err) {
      console.error("err:", err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("onLoadSuccess");
    setNumPages(numPages);
  };

  return (
    <div>
      <h1>Reports</h1>
      <button onClick={handleClick}>Btn</button>
      <div>
        <h1>PDF Viewer</h1>
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onPassword={() => {}}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        )}
        <p>
          Strona {pageNumber} z {numPages}
        </p>
      </div>

      {/* <div>
        <Document
          file={opracowanieparm1617_20170110}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={1} />
        </Document>
      </div>
      <p>
        Page {pageNumber} of {numPages}
      </p> */}
    </div>
  );
};

export default Reports;
