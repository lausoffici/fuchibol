import { ReactNode } from "react";

export type SearchParams = { [key: string]: string | string[] | undefined };

export type LayoutProps<TParams = Record<string, unknown>> = {
  children: ReactNode;
  params: Promise<TParams>;
  searchParams: Promise<SearchParams>;
};

export type PageProps<TParams = Record<string, unknown>> = {
  params: Promise<TParams>;
  searchParams: Promise<SearchParams>;
};
