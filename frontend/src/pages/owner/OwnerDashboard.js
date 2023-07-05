import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import OwnerDashboardApartments from "../../components/owner/OwnerDashboardApartments";
import SectionHeader from "../../components/common/SectionHeader";
import useApartments from "../../hooks/useApartments";

const OwnerDashboard = () => {
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
      <OwnerDashboardApartments apartments={apartments} />
    </section>
  );
};

export default OwnerDashboard;
