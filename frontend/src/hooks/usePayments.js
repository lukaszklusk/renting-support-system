import useGetRequest from "./useGetRequest";
import usePatchRequest from "./usePatchRequest";

const getBaseUrl = (username) => {
  return `/user/${username}/payments`;
};

export const useUserPayments = () => {
  const getData = useGetRequest();

  const fetchUserPayments = async (username) => {
    const url = getBaseUrl(username);
    console.log("url:", url);
    return getData(url);
  };
  return fetchUserPayments;
};

export const usePatchPayPayment = () => {
  const patchData = usePatchRequest();

  const patchUserPayment = async (username, id, status) => {
    const BASE_URL = getBaseUrl(username);
    const url = `${BASE_URL}/${id}`;
    return patchData(url, status);
  };
  return patchUserPayment;
};

export const paymentToTimelinePayment = (payment, agreements) => {
  const startDate = epochDaysToDate(payment.startDate);
  const month = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  if (payment.status === "non_exist") {
    return { status: payment.status, month, color: "black" };
  }

  if (payment.status === "vacant") {
    return { status: payment.status, month, color: "purple" };
  }

  const endDate = epochDaysToDate(payment.endDate);
  const dueDate = epochDaysToDate(payment.dueDate);

  const period = `${startDate.getDate()}/${
    startDate.getMonth() + 1
  }/${startDate.getFullYear()} - ${endDate.getDate()}/${
    endDate.getMonth() + 1
  }/${endDate.getFullYear()}`;

  const dueDateStr = `${dueDate.getDate()}/${
    dueDate.getMonth() + 1
  }/${dueDate.getFullYear()}`;

  const client = agreements.find(
    (agreement) => agreement.id === payment.agreementId
  )?.tenant;

  const owner = agreements.find(
    (agreement) => agreement.id === payment.agreementId
  )?.owner;

  const rent = payment.amount;

  let color, paidDateStr;
  if (payment.status === "paid" || payment.status === "paid_late") {
    const paidDate = epochDaysToDate(payment.paidDate);
    paidDateStr = `${paidDate.getDate()}/${
      paidDate.getMonth() + 1
    }/${paidDate.getFullYear()}`;

    color = payment.status === "paid" ? "green" : "orange";
  } else if (payment.status === "overdue") {
    color = "red";
  } else if (payment.status === "future") {
    color = "blue";
  } else {
    color = "brown";
  }

  return {
    color,
    month,
    period,
    rent,
    client,
    owner,
    dueDate: dueDateStr,
    paidDate: paidDateStr,
    id: payment.id,
    status: payment.status,
  };
};

export const epochDaysToDate = (epochDays) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return new Date(epochDays * millisecondsPerDay);
};

export const dateToEpochDays = (date) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(date.getTime() / millisecondsPerDay);
};
