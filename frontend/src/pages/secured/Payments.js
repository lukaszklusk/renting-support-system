import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SectionHeader from "../../components/common/SectionHeader";
import LastPayment from "../../components/common/LastPayment";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Link from "@mui/material/Link";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import BlockIcon from "@mui/icons-material/Block";

import { format, startOfMonth, subMonths } from "date-fns";

import useData from "../../hooks/useData";
import {
  paymentToTimelinePayment,
  epochDaysToDate,
} from "../../hooks/usePayments";

const Payments = () => {
  const {
    username,
    payments,
    isClient,
    isOwner,
    isDataFetched,
    apartments,
    agreements,
  } = useData();

  const navigate = useNavigate();

  const [rentedApartments, setRentedApartments] = useState([]);
  const [vacantApartments, setVacantApartments] = useState([]);

  const [rentedApartmentsLastPayments, setRentedApartmentsLastPayments] =
    useState({});
  const [vacantApartmentsLastPayments, setVacantApartmentsLastPayments] =
    useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleActiveTabChange = (event, newActiveTab) => {
    setActiveTab(newActiveTab);
  };

  const calculateApartmentsLastPayments = (
    apartments,
    payments,
    agreements
  ) => {
    let apartmentsLastTimelinePayments = {};

    apartments.forEach((apartment) => {
      const apartmentPayments = payments.filter(
        (payment) => payment.apartmentId === apartment.id
      );

      const nextMonthPayments = apartmentPayments.filter((payment) =>
        isEpochFromMonthsAgo(payment.startDate, -1)
      );

      const thisMonthPayments = apartmentPayments.filter((payment) =>
        isEpochFromMonthsAgo(payment.startDate, 0)
      );

      const lastMonthPayments = apartmentPayments.filter((payment) =>
        isEpochFromMonthsAgo(payment.startDate, 1)
      );
      const last2MonthPayments = apartmentPayments.filter((payment) =>
        isEpochFromMonthsAgo(payment.startDate, 2)
      );

      const apartmentLastPayments = [
        // last2MonthPayments.length > 0
        //   ? last2MonthPayments[last2MonthPayments.length - 1]
        //   : { status: "" },
        lastMonthPayments.length > 0
          ? lastMonthPayments[lastMonthPayments.length - 1]
          : {
              startDate: getEpochDaysFromStartOfMonthsAgo(0),
              status:
                getEpochDaysFromStartOfMonthsAgo(0) >
                apartment.creationTimestamp
                  ? "vacant"
                  : "non_exist",
            },
        thisMonthPayments.length > 0
          ? thisMonthPayments[thisMonthPayments.length - 1]
          : {
              startDate: getEpochDaysFromStartOfMonthsAgo(-1),
              status:
                getEpochDaysFromStartOfMonthsAgo(-1) >
                apartment.creationTimestamp
                  ? "vacant"
                  : "non_exist",
            },
        nextMonthPayments.length > 0
          ? nextMonthPayments[nextMonthPayments.length - 1]
          : {
              startDate: getEpochDaysFromStartOfMonthsAgo(-2),
              status:
                getEpochDaysFromStartOfMonthsAgo(-2) >
                apartment.creationTimestamp
                  ? "vacant"
                  : "non_exist",
            },
      ];
      apartmentsLastTimelinePayments[apartment.name] =
        apartmentLastPayments.map((payment) =>
          paymentToTimelinePayment(payment, agreements)
        );
    });

    return apartmentsLastTimelinePayments;
  };

  const isEpochFromMonthsAgo = (epochDays, monthsAgo) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const date = epochDaysToDate(epochDays);

    const monthDiff =
      (currentYear - date.getFullYear()) * 12 + currentMonth - date.getMonth();
    return monthsAgo - 1 < monthDiff && monthDiff <= monthsAgo;
  };

  const getEpochDaysFromStartOfMonthsAgo = (monthsAgo) => {
    const currentDate = new Date();

    const monthsAgoStartDate = startOfMonth(subMonths(currentDate, monthsAgo));
    const monthsAgoStartEpochDays = Math.floor(
      monthsAgoStartDate.getTime() / (1000 * 60 * 60 * 24)
    );
    return monthsAgoStartEpochDays;
  };

  useEffect(() => {
    setRentedApartments(
      apartments?.filter((apartment) => apartment.tenant != null)
    );
    setVacantApartments(
      apartments?.filter((apartment) => apartment.tenant == null)
    );
  }, [apartments]);

  useEffect(() => {
    setRentedApartmentsLastPayments(
      calculateApartmentsLastPayments(rentedApartments, payments, agreements)
    );
  }, [rentedApartments, payments]);

  useEffect(() => {
    setVacantApartmentsLastPayments(
      calculateApartmentsLastPayments(vacantApartments, payments, agreements)
    );
  }, [vacantApartments, payments]);

  const handleRedirect = (apartmentName) => {
    console.log("apartments:", apartments);
    console.log("apartmentName:", apartmentName);

    const apartment = apartments.find(
      (apartment) => apartment.name === apartmentName
    );

    const newUrl = `/apartments/${apartment.id}/payments`;
    navigate(newUrl);
  };

  // console.log("rentedApartments:", rentedApartments);
  // console.log("rentedApartmentsLastPayments:", rentedApartmentsLastPayments);

  return (
    <Box sx={{ width: "100%" }}>
      {isDataFetched && isOwner && (
        <>
          <Tabs value={activeTab} onChange={handleActiveTabChange} centered>
            <Tab label="Rented" />
            <Tab label="Vacant" />
          </Tabs>

          {activeTab === 0 && (
            <>
              {rentedApartments?.length > 0 ? (
                <>
                  {Object.entries(rentedApartmentsLastPayments).map(
                    ([apartmentName, lastPayments]) => (
                      <React.Fragment key={apartmentName}>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRedirect(apartmentName)}
                        >
                          <SectionHeader title={apartmentName} />
                        </div>
                        <div className="mb-5">
                          <Stepper
                            activeStep={1}
                            alternativeLabel
                            className="mt-4"
                          >
                            {lastPayments.map((payment) => (
                              <Step key={payment.id}>
                                <StepLabel
                                  style={{
                                    color: payment.color,
                                  }}
                                  StepIconComponent={
                                    payment.status === "paid" ||
                                    payment.status === "paid_late"
                                      ? CheckCircleIcon
                                      : payment.status === "overdue"
                                      ? ClearIcon
                                      : payment.status === "due"
                                      ? HourglassBottomIcon
                                      : payment.status === "non_exist"
                                      ? BlockIcon
                                      : TrendingFlatIcon
                                  }
                                >
                                  <LastPayment payment={payment} />
                                </StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        </div>
                      </React.Fragment>
                    )
                  )}
                </>
              ) : (
                <SectionHeader title="No Rented Apartments" />
              )}
            </>
          )}

          {activeTab === 1 && (
            <>
              {vacantApartments?.length > 0 ? (
                <>
                  {Object.entries(vacantApartmentsLastPayments).map(
                    ([apartmentName, lastPayments]) => (
                      <React.Fragment key={apartmentName}>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRedirect(apartmentName)}
                        >
                          <SectionHeader title={apartmentName} />
                        </div>
                        <div className="mb-5">
                          <Stepper
                            activeStep={1}
                            alternativeLabel
                            className="mt-4"
                          >
                            {lastPayments.map((payment) => (
                              <Step key={payment.id}>
                                <StepLabel
                                  style={{
                                    color: payment.color,
                                  }}
                                  StepIconComponent={
                                    payment.status === "paid" ||
                                    payment.status === "paid_late"
                                      ? CheckCircleIcon
                                      : payment.status === "overdue"
                                      ? ClearIcon
                                      : payment.status === "vacant"
                                      ? HomeIcon
                                      : payment.status === "due"
                                      ? HourglassBottomIcon
                                      : payment.status === "non_exist"
                                      ? BlockIcon
                                      : TrendingFlatIcon
                                  }
                                >
                                  <LastPayment payment={payment} />
                                </StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        </div>
                      </React.Fragment>
                    )
                  )}
                </>
              ) : (
                <SectionHeader title="No Vacant Apartments" />
              )}
            </>
          )}
        </>
      )}

      {isDataFetched && isClient && (
        <>
          {rentedApartments?.length > 0 ? (
            <>
              {Object.entries(rentedApartmentsLastPayments).map(
                ([apartmentName, lastPayments]) => (
                  <React.Fragment key={apartmentName}>
                    <SectionHeader title={apartmentName} />
                    <Stepper activeStep={1} alternativeLabel className="mt-4">
                      {lastPayments.map((payment) => (
                        <Step key={payment.id}>
                          <StepLabel
                            style={{
                              color: payment.color,
                            }}
                            StepIconComponent={
                              payment.status === "paid" ||
                              payment.status === "paid_late"
                                ? CheckCircleIcon
                                : payment.status === "overdue"
                                ? ClearIcon
                                : payment.status === "due"
                                ? HourglassBottomIcon
                                : payment.status === "non_exist"
                                ? BlockIcon
                                : TrendingFlatIcon
                            }
                          >
                            <LastPayment payment={payment} />
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </React.Fragment>
                )
              )}
            </>
          ) : (
            <SectionHeader title="No Rented Apartments" />
          )}
        </>
      )}
    </Box>
  );
};

export default Payments;
