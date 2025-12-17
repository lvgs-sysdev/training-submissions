// ページネーションコンポーネント
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  siblingCount?: number;
}

const STYLES = {
  ACTIVE_COLOR: "bg-primary text-white border-primary",
  INACTIVE_COLOR: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
  DISABLED_COLOR: "text-gray-300 cursor-not-allowed bg-gray-50 border-gray-200",
} as const;

export default function Pagination({ 
  totalCount, 
  pageSize, 
  currentPage,
  siblingCount = 1 
}: PaginationProps) {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/search?${params.toString()}`;
  };

  const getPaginationItems = () => {
    const totalPageNumbersToShow = 5 + siblingCount * 2;

    // ページ数が閾値以下の場合はすべて表示
    if (totalPages <= totalPageNumbersToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // ドットを表示するかどうかの判定
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2; // Last - 2

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // ケース1: 右側のみ省略 (...)
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', lastPageIndex];
    }

    // ケース2: 左側のみ省略 (...)
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, '...', ...rightRange];
    }

    // ケース3: 両側を省略 (...)
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  };

  const paginationItems = getPaginationItems();

  // ベーススタイル
  const baseButtonClass = "px-3 py-2 rounded text-sm border transition flex items-center justify-center min-w-[36px]";

  return (
    <div className="flex justify-center items-center gap-2 mt-8 py-4 select-none">
      {/* 前へボタン */}
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)} className={`${baseButtonClass} ${STYLES.INACTIVE_COLOR}`}>
          &lt; 前へ
        </Link>
      ) : (
        <span className={`${baseButtonClass} ${STYLES.DISABLED_COLOR}`}>&lt; 前へ</span>
      )}

      {/* ページリスト */}
      <div className="flex gap-1 items-center">
        {paginationItems.map((item, index) => {
          if (item === '...') {
            return <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>;
          }

          const page = item as number;
          const isCurrent = page === currentPage;

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`${baseButtonClass} ${isCurrent ? `${STYLES.ACTIVE_COLOR} font-bold pointer-events-none` : STYLES.INACTIVE_COLOR}`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* 次へボタン */}
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)} className={`${baseButtonClass} ${STYLES.INACTIVE_COLOR}`}>
          次へ &gt;
        </Link>
      ) : (
        <span className={`${baseButtonClass} ${STYLES.DISABLED_COLOR}`}>次へ &gt;</span>
      )}
    </div>
  );
}