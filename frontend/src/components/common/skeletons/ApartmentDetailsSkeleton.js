import { Skeleton } from "@mui/material";

function ApartmentDetailsSkeleton() {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rectangular" sx={{ height: "35vh", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
      <Skeleton variant="text" sx={{ fontSize: "2rem", width: "100%" }} />
    </>
  );
}

export default ApartmentDetailsSkeleton;
