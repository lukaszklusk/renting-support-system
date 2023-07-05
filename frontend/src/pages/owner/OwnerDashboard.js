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
        console.log("Image");
        console.log(data[2].pictures[0].image);
      };

      fetchData();
    }
  }, []);

  return (
    <section>
      <SectionHeader title="Rented Apartments" />
      <OwnerDashboardApartments apartments={apartments} />
      <SectionHeader title="Test" />
      {apartments && (
        <div className="">
          {/* <img src={apartments[2].pictures[0].image} height="200px" /> */}
          <br></br>
          <p>{apartments[2].pictures[0].image}</p>
        </div>
      )}
      <p>Test 2</p>
    </section>
  );
};

export default OwnerDashboard;
