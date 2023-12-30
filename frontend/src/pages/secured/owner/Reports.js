import React, { useState, useEffect, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";

import useData from "../../../hooks/useData";
import {
  useUserOverviewReport,
  useUserSimpleReport,
  useUserDetailedReport,
} from "../../../hooks/useReports";

import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";

import { styled } from "@mui/material/styles";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Reports = () => {
  const { username, isDataFetched } = useData();

  const getOverviewReport = useUserOverviewReport();
  const getSimpleReport = useUserSimpleReport();
  const getDetailedReport = useUserDetailedReport();

  const [viewOpen, setViewOpen] = React.useState(false);

  const [activeReport, setActiveReport] = useState(null);
  const [activeReportType, setActiveReportType] = useState("");

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const [overviewReport, setOverviewReport] = useState(null);
  const [simpleReport, setSimpleReport] = useState(null);
  const [detailedReport, setDetailedReport] = useState(null);

  const fetchOverviewReport = async () => {
    const data = await getOverviewReport(username);
    const pdfBlob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    setOverviewReport(url);
  };

  const fetchSimpleReport = async () => {
    const data = await getSimpleReport(username);
    const pdfBlob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    setSimpleReport(url);
  };

  const fetchDetailedReport = async () => {
    const data = await getDetailedReport(username);
    const pdfBlob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    setDetailedReport(url);
  };

  const handleViewClose = () => {
    setActiveReportType("");
    setViewOpen(false);
  };

  const handleViewOpen = async (type) => {
    try {
      setActiveReportType(type);
      setViewOpen(true);
      if (type === "overview") {
        !overviewReport && fetchOverviewReport();
      } else if (type === "simple") {
        !simpleReport && fetchSimpleReport();
      } else if (type === "detailed") {
        !detailedReport && fetchDetailedReport();
      }
    } catch (err) {
      console.error("err:", err);
    }
  };

  const handleDownload = async (type) => {
    try {
      if (type === "overview") {
        !overviewReport && (await fetchOverviewReport());
        saveAs(overviewReport, "rentsys_overview_report.pdf");
      } else if (type === "simple") {
        !simpleReport && (await fetchSimpleReport());
        saveAs(simpleReport, "rentsys_simple_report.pdf");
      } else if (type === "detailed") {
        !detailedReport && (await fetchDetailedReport());
        saveAs(detailedReport, "rentsys_detailed_report.pdf");
      }
    } catch (err) {
      console.error("err:", err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    // Sprawdź, czy numer strony nie przekracza liczby stron w dokumencie
    const totalPages = numPages;
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const reports = ["overview", "simple", "detailed"];

  useEffect(() => {
    setOverviewReport(null);
    setSimpleReport(null);
    setDetailedReport(null);
  }, [isDataFetched]);

  useEffect(() => {
    if (activeReportType === "overview") {
      setActiveReport(overviewReport);
    } else if (activeReportType === "simple") {
      setActiveReport(simpleReport);
    } else if (activeReportType === "detailed") {
      setActiveReport(detailedReport);
    } else {
      setActiveReport(null);
    }
  }, [overviewReport, simpleReport, detailedReport, activeReportType]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, marginTop: "1rem" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">View</TableCell>
              <TableCell align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow
                key={report}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {report?.charAt(0).toUpperCase() + report?.slice(1)}
                </TableCell>
                <TableCell align="right">
                  <span
                    onClick={() => handleViewOpen(report)}
                    style={{ cursor: "pointer" }}
                  >
                    <VisibilityIcon />
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span
                    onClick={() => handleDownload(report)}
                    style={{ cursor: "pointer" }}
                  >
                    <CloudDownloadIcon />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BootstrapDialog
        fullScreen
        TransitionComponent={Transition}
        onClose={handleViewClose}
        aria-labelledby="customized-dialog-title"
        open={viewOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Report View
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleViewClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {activeReport ? (
              <>
                {numPages > 1 && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={handlePreviousPage}
                  >
                    Previous Page
                  </Button>
                )}

                <Document
                  file={activeReport}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onPassword={() => {}}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
                {numPages > 1 && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                )}
              </>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleDownload(activeReportType) || handleViewClose();
            }}
          >
            Download
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Box>
  );
};

export default Reports;
