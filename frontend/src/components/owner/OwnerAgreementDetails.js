import { useParams } from "react-router-dom";

const OwnerAgreementDetails = () => {
  const { id } = useParams();

  return <h1>OwnerAgreementDetails/{id}</h1>;
};

export default OwnerAgreementDetails;
