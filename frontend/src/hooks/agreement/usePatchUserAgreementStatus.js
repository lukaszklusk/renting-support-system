import usePatchRequest from "../usePatchRequest";

const usePatchUserAgreementStatus = () => {
  const patchData = usePatchRequest();

  const patchUserAgreementStatus = async (username, id, status) => {
    const url = `/user/${username}/agreement/${id}`;
    return patchData(url, status);
  };
  return patchUserAgreementStatus;
};

export default usePatchUserAgreementStatus;
