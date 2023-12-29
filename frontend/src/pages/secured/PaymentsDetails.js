import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import BlockIcon from "@mui/icons-material/Block";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import SectionHeader from "../../components/common/SectionHeader";
import LastPayment from "../../components/common/LastPayment";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { format, startOfMonth, addMonths } from "date-fns";

import useData from "../../hooks/useData";
import {
  paymentToTimelinePayment,
  epochDaysToDate,
  dateToEpochDays,
} from "../../hooks/usePayments";

const PaymentsDetails = () => {
  const { id } = useParams();

  const {
    username,
    payments,
    isClient,
    isOwner,
    isDataFetched,
    apartments,
    agreements,
  } = useData();

  const [apartment, setApartment] = useState(null);
  const [apartmentPayments, setApartmentPayments] = useState([]);
  const [paymentsTimeline, setPaymentsTimeline] = useState([]);
  const [activePaymentsTimeline, setActivePaymentsTimeline] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const calculatePaymentsTimeline = (
    apartment,
    apartmentPayments,
    agreements
  ) => {
    let myApartmentPaymentsTimeline = [];

    const creationDate = epochDaysToDate(apartment.creationTimestamp);
    const agreementDate = epochDaysToDate(
      apartmentPayments.length > 0
        ? apartmentPayments.reduce((minElement, currentElement) => {
            return currentElement.startDate < minElement.startDate
              ? currentElement
              : minElement;
          }, apartmentPayments[0]).startDate
        : { startDate: dateToEpochDays(new Date()) }
    );

    let monthStart = isOwner ? creationDate : agreementDate;

    if (startOfMonth(monthStart).getMonth() !== monthStart.getMonth()) {
      monthStart = startOfMonth(creationDate);
    }

    const lastAgreementMonthPayment =
      apartmentPayments.length > 0
        ? apartmentPayments.reduce((maxElement, currentElement) => {
            return currentElement.startDate > maxElement.startDate
              ? currentElement
              : maxElement;
          }, apartmentPayments[0])
        : { startDate: dateToEpochDays(new Date()) };

    const lastAgreementMonthEpochDays = lastAgreementMonthPayment.startDate;
    const lastAgreementMonth = epochDaysToDate(lastAgreementMonthEpochDays);

    while (monthStart < lastAgreementMonth) {
      const monthEnd = addMonths(monthStart, 1);

      const payment = apartmentPayments.find(
        (payment) =>
          monthStart <= epochDaysToDate(payment.startDate) &&
          epochDaysToDate(payment.startDate) < monthEnd
      );

      if (payment || isOwner) {
        myApartmentPaymentsTimeline.push(
          payment
            ? payment
            : {
                startDate: dateToEpochDays(monthStart),
                status: "vacant",
              }
        );
      }

      monthStart = addMonths(monthStart, 1);
    }

    setPaymentsTimeline(
      myApartmentPaymentsTimeline.map((payment) =>
        paymentToTimelinePayment(payment, agreements)
      )
    );
  };

  useEffect(() => {
    const myApartment = apartments.find(
      (apartment) => apartment.id === parseInt(id)
    );
    setApartment(myApartment);
  }, [apartments, id]);

  useEffect(() => {
    const myApartmentPayments = payments.filter(
      (payment) => payment.apartmentId === parseInt(id)
    );
    setApartmentPayments(myApartmentPayments);
  }, [payments, id]);

  useEffect(() => {
    apartment &&
      apartmentPayments &&
      calculatePaymentsTimeline(apartment, apartmentPayments, agreements);
  }, [apartment, apartmentPayments, agreements]);

  useEffect(() => {
    const yearsSet = new Set();

    paymentsTimeline.forEach((item) => {
      const words = item.month.split(" ");
      if (words.length >= 2) {
        yearsSet.add(words[1]);
      }
    });

    setTabs(Array.from(yearsSet));
  }, [paymentsTimeline]);

  useEffect(() => {
    tabs.length > 0 && setActiveTab(tabs[0]);
  }, [tabs]);

  useEffect(() => {
    setActivePaymentsTimeline(
      paymentsTimeline.filter((payment) => payment.month.includes(activeTab))
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isDataFetched && apartment && (
        <>
          <SectionHeader title={apartment.name} />

          {activeTab && (
            <>
              {tabs.length < 8 ? (
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                  {tabs.map((tab) => (
                    <Tab key={tab} value={tab} label={tab} />
                  ))}
                </Tabs>
              ) : (
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab} value={tab} label={tab} />
                  ))}
                </Tabs>
              )}
            </>
          )}
          <Timeline position="alternate">
            {activePaymentsTimeline.map((payment, idx) => (
              <TimelineItem key={idx}>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align={idx % 2 === 0 ? "right" : "left"}
                  variant="body2"
                  color="text.secondary"
                >
                  {payment.month.split(" ")[0]}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot
                    sx={{
                      backgroundColor: payment.color,
                    }}
                  >
                    {payment.status === "paid" ||
                    payment.status === "paid_late" ? (
                      <CheckCircleIcon />
                    ) : payment.status === "overdue" ? (
                      <ClearIcon />
                    ) : payment.status === "due" ? (
                      <HourglassBottomIcon />
                    ) : payment.status === "non_exist" ? (
                      <BlockIcon />
                    ) : payment.status === "future" ? (
                      <HourglassTopIcon />
                    ) : (
                      <HomeIcon />
                    )}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>

                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <LastPayment payment={payment} fullHistory={true} />
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </>
      )}
    </Box>
  );
};

export default PaymentsDetails;
