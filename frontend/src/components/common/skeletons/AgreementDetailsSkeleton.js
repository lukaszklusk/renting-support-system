import { Skeleton } from "@mui/material";

function AgreementDetailsSkeleton() {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
    </>
  );
}

export default AgreementDetailsSkeleton;
