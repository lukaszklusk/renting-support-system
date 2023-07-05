import { useState, useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import useAgreements from "../../hooks/useAgreements";
import SectionHeader from "../../components/common/SectionHeader";
import OwnerAgreementsList from "../../components/owner/OwnerAgreementsList";

function OwnerAgreements() {
  const [agreements, setAgreements] = useState(null);
  const { auth } = useAuth();
  const fetchAgreements = useAgreements();

  useEffect(() => {
    const username = auth.username;
    if (username) {
      const fetchData = async () => {
        const data = await fetchAgreements(username);
        setAgreements(data);
      };

      fetchData();
    }
  }, []);

  return (
    <section>
      <SectionHeader title="Active Agreements" />
      <OwnerAgreementsList agreements={agreements} />
    </section>
  );
}

export default OwnerAgreements;
