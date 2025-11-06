import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DynamicPaginationProps {
  currentPageNum: number;
  totalPages: number;
  handleClickPageNum: (pageNum: number) => void;
}

const DynamicPagination = ({
  currentPageNum,
  totalPages,
  handleClickPageNum,
}: DynamicPaginationProps) => {
  // 総ページ数が1以下の場合はページネーションを表示しない
  if (totalPages <= 1) {
    return null;
  }

  // ページ番号の配列を生成する関数
  const generatePageNumbers = (current: number, total: number) => {
    const pages = [];

    // 常に表示するページ数 (例: 現在のページとその前後2つ = 最大5つ)
    const maxVisible = 5;
    let startPage = Math.max(2, current - Math.floor(maxVisible / 2) + 1);
    let endPage = Math.min(total - 1, startPage + maxVisible - 2);

    // ページ数が少ない場合の調整
    if (endPage - startPage + 1 < maxVisible - 2) {
      startPage = Math.max(2, endPage - (maxVisible - 3));
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < total) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers(currentPageNum, totalPages);

  return (
    <Pagination>
      <PaginationContent className="space-x-1">
        {/* 1. 【前へ】ボタン */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              currentPageNum !== 1 ? handleClickPageNum(currentPageNum - 1) : {}
            }
            aria-disabled={currentPageNum === 1}
            className={
              currentPageNum === 1 ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </PaginationItem>

        {/* 2. 【1ページ目】のリンク */}
        <PaginationItem>
          <PaginationLink
            isActive={currentPageNum === 1}
            onClick={() => handleClickPageNum(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {pageNumbers.length > 0 && pageNumbers[0] > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPageNum === page}
              onClick={() => handleClickPageNum(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pageNumbers.length > 0 &&
          pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              isActive={currentPageNum === totalPages}
              onClick={() => handleClickPageNum(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPageNum !== totalPages
                ? handleClickPageNum(currentPageNum + 1)
                : {}
            }
            aria-disabled={currentPageNum === totalPages}
            className={
              currentPageNum === totalPages
                ? "opacity-50 cursor-not-allowed"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DynamicPagination;
