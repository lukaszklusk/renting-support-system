import React, { useState, useEffect } from "react";

import { Box } from "@mui/material";
import Link from "@mui/material/Link";

import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

import { DataGrid } from "@mui/x-data-grid";

import useData from "../../hooks/useData";
import { usePatchPayPayment, epochDaysToDate } from "../../hooks/usePayments";

import DashboardApartments from "../../components/owner/DashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";
import Agreement from "../../components/common/Agreement";
import ItemsList from "../../components/common/ItemsList";

import DashboardSkeleton from "../../components/common/skeletons/DashboardSkeleton";

const Dashboard = () => {
  const {
    username,
    isOwner,
    isClient,
    isDataFetched,
    apartments,
    agreements,
    payments,
    setPayments,
  } = useData();

  const patchUserPayment = usePatchPayPayment();

  const [rentedApartments, setRentedApartments] = useState([]);
  const [vacantApartments, setVacantApartments] = useState([]);

  const [acceptedAgreements, setAcceptedAgreements] = useState();
  const [proposedAgreements, setProposedAgreements] = useState([]);

  const [paymentsGroupedByMonth, setPaymentsGroupedByMonth] = useState(null);

  const [months, setMonths] = useState([]);

  const [monthsPaidSum, setMonthsPaidSum] = useState([]);
  const [monthsPaidLateSum, setMonthsPaidLateSum] = useState([]);
  const [monthsUnpaidSum, setMonthsUnpaidSum] = useState([]);
  const [futurePaySum, setFuturePaySum] = useState([]);

  const [apartmentsPaymentsByMonth, setApartmentsPaymentsByMonth] = useState(
    []
  );
  const [apartmentNamesSeries, setApartmentNamesSeries] = useState([]);

  const [paymentsAmount, setPaymentsAmount] = useState([]);
  const [apartmentNames, setApartmentNames] = useState([]);

  const [recentPayments, setRecentPayments] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);

  const [apartmentIdToName, setApartmentIdToName] = useState(null);
  const [agreementsIdToTenant, setAgreementsIdToTenant] = useState(null);
  const [agreementsIdToOwner, setAgreementsIdToOwner] = useState(null);

  const parseDateString = (dateString) => {
    const parts = dateString.split("/");

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const parsedDate = new Date(year, month, day);
    return parsedDate;
  };

  const compStringDates = (a, b) => {
    return parseDateString(a) - parseDateString(b);
  };

  const epochDaysToStringDate = (params) =>
    `${epochDaysToDate(params.value).getDate()}/${
      epochDaysToDate(params.value).getMonth() + 1
    }/${epochDaysToDate(params.value).getFullYear()}`;

  const periodToStringDate = (params) =>
    `${epochDaysToDate(params.value[0]).getDate()}/${
      epochDaysToDate(params.value[0]).getMonth() + 1
    }/${epochDaysToDate(params.value[0]).getFullYear()} : ${epochDaysToDate(
      params.value[1]
    ).getDate()}/${
      epochDaysToDate(params.value[1]).getMonth() + 1
    }/${epochDaysToDate(params.value[1]).getFullYear()}`;

  const recentPaymentsColumns = [
    {
      field: "paidDate",
      headerName: "Paid Date",
      type: "number",
      width: 120,
      valueGetter: epochDaysToStringDate,
      sortComparator: compStringDates,
      align: "left",
      headerAlign: "left",
    },
    {
      field: isOwner ? "tenant" : "owner",
      headerName: isOwner ? "Tenant" : "Owner",
      headerName: "Tenant",
      width: 130,
      align: "left",
      headerAlign: "left",
    },

    {
      field: "apartmentName",
      headerName: "Apartment Name",
      width: 140,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "method",
      headerName: "Method",
      width: 110,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "period",
      headerName: "Period",
      type: "array",
      width: 200,
      valueGetter: periodToStringDate,
      sortComparator: (a, b) => {
        const aDateStr = a.split(":")[0];
        const bDateStr = b.split(":")[0];
        return compStringDates(aDateStr, bDateStr);
      },
      align: "left",
      headerAlign: "left",
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      type: "number",
      width: 110,
      valueGetter: epochDaysToStringDate,
      sortComparator: compStringDates,
      align: "left",
      headerAlign: "left",
    },
  ];

  const overduePaymentsColumns = [
    {
      field: isOwner ? "tenant" : "owner",
      headerName: isOwner ? "Tenant" : "Owner",
      headerName: "Tenant",
      width: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "apartmentName",
      headerName: "Apartment Name",
      width: 140,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "period",
      headerName: "Period",
      type: "array",
      width: 200,
      valueGetter: periodToStringDate,
      sortComparator: (a, b) => {
        const aDateStr = a.split(":")[0];
        const bDateStr = b.split(":")[0];
        return compStringDates(aDateStr, bDateStr);
      },
      align: "left",
      headerAlign: "left",
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      type: "number",
      width: 120,
      valueGetter: epochDaysToStringDate,
      sortComparator: compStringDates,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "payment",
      headerName: "Payment",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            handlePayPayment(params.id);
          }}
        >
          {isOwner ? "CONFIRM PAYMENT" : "PAY"}
        </Link>
      ),
      align: "left",
      headerAlign: "left",
    },
  ];

  const valueFormatter = (date) => {
    return date.toLocaleString("en-US", { year: "numeric", month: "short" });
  };

  const stringToDate = (dateString) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const [monthName, year] = dateString.split(" ");
    const monthIndex = monthNames.indexOf(monthName);
    return new Date(year, monthIndex);
  };

  const xAxisCommon = {
    scaleType: "time",
    valueFormatter,
  };

  const handlePayPayment = async (id) => {
    const data = await patchUserPayment(username, id, {
      byOwner: isOwner,
    });
    setPayments((prevPayments) =>
      prevPayments?.map((p) => (p.id === id ? data : p))
    );
  };

  const calculateRecentPaidPayments = (
    payments,
    agreementsIdToTenant,
    agreementsIdToOwner
  ) => {
    const paidPayments = payments
      .filter(
        (payment) => payment.status === "paid" || payment.status === "paid_late"
      )
      .sort((a, b) => a.paidDate - b.paidDate);

    const newRecentPayments = paidPayments.map((payment) => ({
      id: payment.id,
      paidDate: payment.paidDate,
      dueDate: payment.dueDate,
      period: [payment.startDate, payment.endDate],
      tenant: agreementsIdToTenant[payment.agreementId],
      owner: agreementsIdToOwner[payment.agreementId],
      apartmentName: payment.apartmentName,
      amount: payment.amount,
      method: payment.paymentMethod,
    }));

    setRecentPayments(newRecentPayments);
  };

  const calculateOverduePayments = (
    payments,

    agreementsIdToTenant,
    agreementsIdToOwner
  ) => {
    const overduePayments = payments
      .filter((payment) => payment.status === "overdue")
      .sort((a, b) => a.paidDate - b.paidDate);

    const newOverduePayments = overduePayments.map((payment) => ({
      id: payment.id,
      dueDate: payment.dueDate,
      period: [payment.startDate, payment.endDate],
      tenant: agreementsIdToTenant[payment.agreementId],
      owner: agreementsIdToOwner[payment.agreementId],
      apartmentName: payment.apartmentName,
      amount: payment.amount,
    }));

    setOverduePayments(newOverduePayments);
  };

  const groupPaymentsByMonth = (payments) => {
    const sortedPayments = payments
      .slice()
      .sort((a, b) => a.startDate - b.startDate);

    setPaymentsGroupedByMonth(
      sortedPayments.reduce((acc, payments) => {
        const monthKey = epochDaysToDate(payments.startDate).toLocaleString(
          "en-US",
          { year: "numeric", month: "short" }
        );
        acc[monthKey] = acc[monthKey] || [];
        acc[monthKey].push(payments);
        return acc;
      }, {})
    );
  };

  const calculateTotalPaymentsByMonth = (paymentsGroupedByMonth) => {
    let newMonths = [];
    let newMonthsPaidSum = [];
    let newMonthsPaidLateSum = [];
    let newMonthsUnpaidSum = [];
    let newMonthsFuturePaySum = [];

    for (const [month, payments] of Object.entries(paymentsGroupedByMonth)) {
      newMonths.push(stringToDate(month));
      newMonthsPaidSum.push(
        payments
          .filter((payment) => payment.status === "paid")
          .reduce((sum, payment) => {
            return sum + payment.amount;
          }, 0)
      );
      newMonthsPaidLateSum.push(
        payments
          .filter((payment) => payment.status === "paid_late")
          .reduce((sum, payment) => {
            return sum + payment.amount;
          }, 0)
      );
      newMonthsUnpaidSum.push(
        payments
          .filter((payment) => payment.status === "overdue")
          .reduce((sum, payment) => {
            return sum + payment.amount;
          }, 0)
      );
      newMonthsFuturePaySum.push(
        payments
          .filter((payment) => payment.status === "future")
          .reduce((sum, payment) => {
            return sum + payment.amount;
          }, 0)
      );
    }

    setMonths(newMonths);
    setMonthsPaidSum(newMonthsPaidSum);
    setMonthsPaidLateSum(newMonthsPaidLateSum);
    setMonthsUnpaidSum(newMonthsUnpaidSum);
    setFuturePaySum(newMonthsFuturePaySum);
  };

  const calculateApartmentPaymentsByMonth = (
    paymentsGroupedByMonth,
    apartmentIdToName
  ) => {
    // TODO
    setApartmentNamesSeries(
      Object.values(apartmentIdToName).map((apartmentName) => ({
        dataKey: apartmentName,
        label: apartmentName,
      }))
    );

    let newApartmentsPaymentsByMonth = [];

    for (const [month, payments] of Object.entries(paymentsGroupedByMonth)) {
      const paidPayments = payments.filter(
        (payment) => payment.status === "paid" || payment.status === "paid_late"
      );

      let apartmentsPaymentsInMonth = { month: month };
      for (const [id, name] of Object.entries(apartmentIdToName)) {
        const amount = paidPayments
          .filter((payment) => payment.apartmentId === parseInt(id))
          .reduce((sum, payment) => {
            return sum + payment.amount;
          }, 0);
        apartmentsPaymentsInMonth[name] = amount;
      }

      newApartmentsPaymentsByMonth.push(apartmentsPaymentsInMonth);
    }

    setApartmentsPaymentsByMonth(newApartmentsPaymentsByMonth);
  };

  const calculateTotalPaymentsByApartment = (payments, apartmentIdToName) => {
    let newApartmentNames = [];
    let newPaymentsAmount = [];

    for (const [id, name] of Object.entries(apartmentIdToName)) {
      const amount = payments
        .filter(
          (payment) =>
            payment.apartmentId === parseInt(id) &&
            (payment.status === "paid" || payment.status === "paid_late")
        )
        .reduce((sum, payment) => {
          return sum + payment.amount;
        }, 0);
      newPaymentsAmount.push(amount);
      newApartmentNames.push(name);
    }

    setPaymentsAmount(newPaymentsAmount);
    setApartmentNames(newApartmentNames);
  };

  useEffect(() => {
    setAgreementsIdToTenant(
      agreements.reduce((map, agreement) => {
        map[agreement.id] = agreement.tenant.username;
        return map;
      }, {})
    );

    setAgreementsIdToOwner(
      agreements.reduce((map, agreement) => {
        map[agreement.id] = agreement.owner.username;
        return map;
      }, {})
    );
  }, [agreements]);

  useEffect(() => {
    let newApartmentIdToName = payments.reduce((map, payment) => {
      map[payment.apartmentId] = payment.apartmentName;
      return map;
    }, {});

    setApartmentIdToName(
      apartments.reduce((map, apartment) => {
        map[apartment.id] = apartment.name;
        return map;
      }, newApartmentIdToName)
    );
  }, [payments, apartments]);

  useEffect(() => {
    agreementsIdToTenant &&
      agreementsIdToOwner &&
      calculateRecentPaidPayments(
        payments,

        agreementsIdToTenant,
        agreementsIdToOwner
      );
  }, [payments, agreementsIdToTenant, agreementsIdToOwner]);

  useEffect(() => {
    agreementsIdToTenant &&
      agreementsIdToOwner &&
      calculateOverduePayments(
        payments,

        agreementsIdToTenant,
        agreementsIdToOwner
      );
  }, [payments, agreementsIdToTenant, agreementsIdToOwner]);

  useEffect(() => {
    apartmentIdToName &&
      calculateTotalPaymentsByApartment(payments, apartmentIdToName);
  }, [payments, apartmentIdToName]);

  useEffect(() => {
    paymentsGroupedByMonth &&
      apartmentIdToName &&
      calculateApartmentPaymentsByMonth(
        paymentsGroupedByMonth,
        apartmentIdToName
      );
  }, [paymentsGroupedByMonth, apartmentIdToName]);

  useEffect(() => {
    paymentsGroupedByMonth &&
      calculateTotalPaymentsByMonth(paymentsGroupedByMonth);
  }, [paymentsGroupedByMonth]);

  useEffect(() => {
    payments.length > 0 && groupPaymentsByMonth(payments);
  }, [payments]);

  useEffect(() => {
    setRentedApartments(
      apartments?.filter((apartment) => apartment.tenant != null)
    );
    setVacantApartments(
      apartments?.filter((apartment) => apartment.tenant == null)
    );
  }, [apartments]);

  useEffect(() => {
    setAcceptedAgreements(
      agreements.filter((agreement) => agreement.agreementStatus === "accepted")
    );

    setProposedAgreements(
      agreements.filter((agreement) => agreement.agreementStatus === "proposed")
    );
  }, [agreements]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isDataFetched ? (
        <>
          {rentedApartments.length > 0 && (
            <>
              <SectionHeader title="Rented Apartments" />
              <DashboardApartments apartments={rentedApartments} />
            </>
          )}
          {isOwner && vacantApartments.length > 0 && (
            <>
              <SectionHeader title="Vacant Apartments" />
              <DashboardApartments apartments={vacantApartments} />
            </>
          )}
          {isOwner && acceptedAgreements?.length > 0 && (
            <>
              <SectionHeader title="Agreements To Respond" />
              <ItemsList
                items={acceptedAgreements}
                ItemUI={Agreement}
                itemProps={{ isPresent: true, toResponse: true }}
              />
            </>
          )}

          {isClient && proposedAgreements?.length > 0 && (
            <>
              <SectionHeader title="Agreements To Respond" />
              <ItemsList
                items={proposedAgreements}
                ItemUI={Agreement}
                itemProps={{ isPresent: true, toResponse: true }}
              />
            </>
          )}

          {months?.length > 0 && (
            <>
              <SectionHeader title="Total Payments By Month Timeline" />
              <LineChart
                xAxis={[{ ...xAxisCommon, data: months }]}
                series={[
                  {
                    label: "Paid",
                    data: monthsPaidSum,
                    color: "#15fe19",
                  },
                  {
                    label: "Paid Late",
                    data: monthsPaidLateSum,
                    color: "#9c755f",
                  },
                  {
                    label: "Overdue",
                    data: monthsUnpaidSum,
                    color: "#fe1719",
                  },
                  {
                    label: "Future",
                    data: futurePaySum,
                    color: "#4e79c7",
                  },
                ]}
                height={450}
              />
              <div className="mb-2"></div>
              {apartments?.length > 0 && (
                <>
                  <SectionHeader title="Apartments Payments By Month Timeline" />
                  <BarChart
                    dataset={apartmentsPaymentsByMonth}
                    xAxis={[{ scaleType: "band", dataKey: "month" }]}
                    series={apartmentNamesSeries}
                    height={400}
                  />
                  <div className="mb-2"></div>
                  {apartmentNames?.length > 0 && (
                    <>
                      <SectionHeader title="Apartments Total Payments" />
                      <BarChart
                        xAxis={[{ scaleType: "band", data: apartmentNames }]}
                        series={[{ data: paymentsAmount }]}
                        height={400}
                      />
                      <div className="mb-2"></div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {recentPayments?.length > 0 && (
            <>
              <SectionHeader title="Recent Payments" />
              <div className="mb-3" style={{ height: 370, width: "100%" }}>
                <DataGrid
                  rows={recentPayments}
                  columns={recentPaymentsColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5]}
                />
              </div>
            </>
          )}

          {overduePayments?.length > 0 && (
            <>
              <SectionHeader title="Overdue Payments" />
              <div className="mb-3" style={{ height: 370, width: "100%" }}>
                <DataGrid
                  rows={overduePayments}
                  columns={overduePaymentsColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5]}
                />
              </div>
            </>
          )}

          {apartments?.length == 0 && months?.length == 0 && (
            <>
              <SectionHeader title="Welcome To RentSys" />
            </>
          )}
        </>
      ) : (
        <DashboardSkeleton />
      )}
    </Box>
  );
};

export default Dashboard;
