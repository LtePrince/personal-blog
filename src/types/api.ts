/** Types matching the blog-backend response envelope. */

/** Standard backend response envelope. */
export interface DownstreamResponse<T> {
  code: string;
  message: string;
  data?: T;
}

/** Paginated list returned by GET /api/v1/blogs */
export interface ListBlogsData {
  total: number;
  item_list: BackendBlogItem[];
}

/** Recent list returned by GET /api/v1/blogs/recent */
export interface RecentBlogsData {
  item_list: BackendBlogItem[];
}

/** Single blog returned by GET /api/v1/blogs/:id */
export interface GetBlogData {
  item: BackendBlogDetail;
}

/** Blog summary as returned by backend. */
export interface BackendBlogItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  tags?: string;
  cover?: string;
  author?: string;
}

/** Full blog detail as returned by backend. */
export interface BackendBlogDetail extends BackendBlogItem {
  text: string;
}
