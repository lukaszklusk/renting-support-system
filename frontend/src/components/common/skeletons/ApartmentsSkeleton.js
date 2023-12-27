import { Skeleton, Stack } from "@mui/material";

function ApartmentsSkeleton() {
  return (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rounded" sx={{ width: "32vw", height: "32vh" }} />
      <div></div>
      <div></div>
      <div></div>
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rounded" sx={{ width: "32vw", height: "32vh" }} />
    </Stack>
  );
}

export default ApartmentsSkeleton;
