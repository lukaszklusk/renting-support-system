import React, { useState, useEffect, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";

import useData from "../../../hooks/useData";
import { useUserReport } from "../../../hooks/useReports";

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
  const getUserReport = useUserReport();

  const [viewOpen, setViewOpen] = React.useState(false);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    const data = await getUserReport(username);
    const pdfBlob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    setReport(url);
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };

  const handleViewOpen = async () => {
    try {
      setViewOpen(true);
      !report && fetchReport();
    } catch (err) {
      console.error("err:", err);
    }
  };

  const handleDownload = async () => {
    try {
      !report && (await fetchReport());
      saveAs(report, "test.pdf");
    } catch (err) {
      console.error("err:", err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("onLoadSuccess");
    setNumPages(numPages);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [createData("General", 159, 6.0, 24, 4.0)];

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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <span onClick={handleViewOpen} style={{ cursor: "pointer" }}>
                    <VisibilityIcon />
                  </span>
                </TableCell>
                <TableCell align="right">
                  <span onClick={handleDownload} style={{ cursor: "pointer" }}>
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
            {report ? (
              <Document
                file={report}
                onLoadSuccess={onDocumentLoadSuccess}
                onPassword={() => {}}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            ) : (
              <CircularProgress />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleViewClose() || handleDownload();
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
