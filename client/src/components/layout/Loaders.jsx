import { Skeleton } from "@mui/material";
import { BouncingSkeleton } from "../styles/StyledComponents";
export const LayoutLoader = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="h-full border-2 col-span-3 min-[640px]:col-span-1">
        <Skeleton
          variant="rectangular"
          height={"100vh"}
          sx={{ bgcolor: "grey.400" }}
        />
      </div>
      <div className="h-full w-full border-2 col-span-2 min-[1024px]:col-span-1 hidden min-[640px]:block">
        {Array.from({ length: 13 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={"4.3rem"}
            sx={{ bgcolor: "grey.400" }}
            className="m-4"
          />
        ))}
      </div>
      <div className="md:w-full hidden min-[1024px]:block">
        <Skeleton
          variant="rectangular"
          height={"100vh"}
          sx={{ bgcolor: "grey.400" }}
        />
      </div>
    </div>
  );
};

export const LayoutLoaderAdmin = () => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="h-full w-full col-span-1 min-[1024px]:col-span-1 hidden min-[640px]:block">
        {Array.from({ length: 13 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={"4.3rem"}
            sx={{ bgcolor: "grey.400" }}
            className="m-4"
          />
        ))}
      </div>
    </div>
  );
};

export const LayoutLoaderDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-2 min-h-screen">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block h-screen overflow-y-auto border-2 border-gray-300">
        {Array.from({ length: 13 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={"4.3rem"}
            sx={{ bgcolor: "grey.400" }}
            className="m-4"
          />
        ))}
      </div>
      
      {/* Right Content - Takes full width on mobile, remaining space on larger screens */}
      <div className="h-screen overflow-hidden border-2 border-gray-300">
        <Skeleton
          variant="rectangular"
          height={"100%"}
          sx={{ bgcolor: "grey.400" }}
        />
      </div>
    </div>
  );
};

export const TypingLoader = () => {
  return (
    <span className="inline-flex flex-row gap-2 p-2 justify-center items-center mx-auto w-30">
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </span>
  );
};
