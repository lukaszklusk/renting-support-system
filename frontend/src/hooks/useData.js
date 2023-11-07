import { useContext } from "react";
import DataContext from "../components/common/communication/DataProvider";

const useData = () => {
  return useContext(DataContext);
};

export default useData;
