import { Skeleton, Stack } from "@mui/material";

function DashboardSkeleton() {
  return (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rectangle" sx={{ height: "50vw", width: "100%" }} />

      <Skeleton variant="text" sx={{ fontSize: "4rem", width: "100%" }} />
      <Skeleton variant="rectangle" sx={{ height: "50vw", width: "100%" }} />
    </Stack>
  );
}

export default DashboardSkeleton;
