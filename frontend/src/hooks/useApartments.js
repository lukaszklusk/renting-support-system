import { useNavigate, useLocation } from "react-router-dom";
import useAxiosUser from "./useAxiosUser";

export function getImageData(encodedBase64) {
  return `data:image/png;base64,${encodedBase64}`;
}

export function getApartmentSize(apartment) {
  const sizeProps = apartment.properties.filter((prop) => prop.name == "Size");
  if (sizeProps.length != 1) {
    return null;
  }
  return sizeProps[0].value;
}

export function getApartmentPrice(apartment) {
  const sizeProps = apartment.properties.filter((prop) => prop.name == "Price");
  if (sizeProps.length != 1) {
    return null;
  }
  return sizeProps[0].value + " " + sizeProps[0].valueType.toUpperCase();
}

const useApartments = () => {
  const axiosUser = useAxiosUser();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchApartments = async (username) => {
    try {
      const response = await axiosUser.get(`/user/${username}/apartment`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      // TODO
      console.log(err);
      navigate("/sign-in", {
        state: { from: location },
        replace: true,
      });
    }
  };
  return fetchApartments;
};

export default useApartments;
