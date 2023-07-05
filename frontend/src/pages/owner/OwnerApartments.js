import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useApartments from "../../hooks/useApartments";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerApartmentsList from "../../components/owner/OwnerApartmentsList";

const OwnerApartments = () => {
  const [apartments, setApartments] = useState(null);
  const { auth } = useAuth();
  const fetchApartments = useApartments();

  useEffect(() => {
    const username = auth.username;
    if (username) {
      const fetchData = async () => {
        const data = await fetchApartments(username);
        setApartments(data);
      };

      fetchData();
    }
  }, []);

  return (
    <section>
      <SectionHeader title="Rented Apartments" />
      <OwnerApartmentsList apartments={apartments} />
    </section>
  );
};

export default OwnerApartments;
