import { CardContent, CardHeader } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export function SkeletonCard() {
    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-sm mb-1">
          <CardHeader className="p-4">
            <div className="flex justify-between">
              <div className="flex align-middle gap-2">
                <Skeleton className="rounded-full border-gray-400 h-10 w-10 mt-2 bg-gray-300" />
                <div className="flex flex-col">
                  <Skeleton className="h-4 w-24 mt-2 bg-gray-300 mb-1" />
                  <Skeleton className="h-4 w-32 bg-gray-300" />
                </div>
              </div>
              <div className="flex align-middle justify-center">
                <Skeleton className="h-5 w-5 mt-2 text-center bg-gray-300" />
                <Skeleton className="h-4 w-24 ml-2 mt-1 bg-gray-300 " />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-[1fr_auto] gap-4">
            <div className="grid gap-2">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2 bg-gray-300" />
                  <Skeleton className="h-4 w-32 bg-gray-300" />
                </div>
              </div>
              <div className="flex items-center gap-2 ">
                <Skeleton className="h-5 w-5 bg-gray-300" />
                <Skeleton className="h-4 w-32 bg-gray-300" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-gray-300" />
                <Skeleton className="h-4 w-32 bg-gray-300" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="text-2xl font-bold h-6 w-16 bg-gray-300" />
              <Skeleton className="h-10 w-24 bg-gray-300" />
            </div>
          </CardContent>
        </div>
      );
  }