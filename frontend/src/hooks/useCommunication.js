import { useContext } from "react";
import CommunicationContext from "../components/common/communication/CommunicationProvider";

const useCommunication = () => {
  return useContext(CommunicationContext);
};

export default useCommunication;
