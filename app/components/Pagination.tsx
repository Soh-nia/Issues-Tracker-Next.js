'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";


interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({
  itemCount,
  pageSize,
  currentPage,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = Math.ceil(itemCount / pageSize);
  if (pageCount <= 1) return null;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push('?' + params.toString());
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <p className="text-base text-base-content hidden md:block">
        Page {currentPage} of {pageCount}
      </p>
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
        className="btn bg-neutral-content h-8 px-5 transition-colors btn-soft border-neutral-content text-base hover:text-lg shadow-md"
      >
        <HiChevronDoubleLeft />
      </button>
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="btn bg-neutral-content h-8 px-5 transition-colors btn-soft border-neutral-content text-base hover:text-lg shadow-md"
      >
        <HiChevronLeft />
      </button>
      <button
        disabled={currentPage === pageCount}
        onClick={() => changePage(currentPage + 1)}
        className="btn bg-neutral-content h-8 px-5 transition-colors btn-soft border-neutral-content text-base hover:text-lg shadow-md"
      >
        <HiChevronRight />
      </button>
      <button
        disabled={currentPage === pageCount}
        onClick={() => changePage(pageCount)}
        className="btn bg-neutral-content h-8 px-5 transition-colors btn-soft border-neutral-content text-base hover:text-lg shadow-md"
      >
        <HiChevronDoubleRight />
      </button>
  </div>
  );
};

export default Pagination;