import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

export default function PaginationComp({
    router,
    totalPages,
    currentPage,
    setCurrentPage,
    queryString,
}: {
    router: AppRouterInstance;
    totalPages: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    queryString: string;
}) {
    function handleOnClick(i: number) {
        setCurrentPage(i + 1);
        router.push(`/books?${queryString}&page=${i + 1}`);
    }
    return (
        <div className="flex gap-4">
            {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                    key={i}
                    type="button"
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size={"icon"}
                    onClick={() => handleOnClick(i)}
                    className="cursor-pointer"
                >
                    {i + 1}
                </Button>
            ))}
        </div>
    );
}