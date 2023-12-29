import { Skeleton, Stack } from "@mui/material";

function AgreementsSkeleton() {
  return (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rounded" sx={{ width: "30vw", height: "55vh" }} />
      <div></div>
      <div></div>
      <div></div>
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rounded" sx={{ width: "30vw", height: "55vh" }} />
    </Stack>
  );
}

export default AgreementsSkeleton;
