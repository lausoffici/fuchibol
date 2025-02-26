export interface PageProps<T = object> {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
}
