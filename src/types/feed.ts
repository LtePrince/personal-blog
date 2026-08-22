/** Home page "latest" feed: blog posts and column chapters in one list. */

export interface FeedItem {
  /** Stable React key. */
  key: string;
  kind: "post" | "chapter";
  href: string;
  title: string;
  summary: string;
  /** Display date, YYYY-MM-DD. */
  date: string;
  /** Unix seconds — what the feed is ordered by. */
  sortAt: number;
  tags: string[];
  /** Chapters only: the column this chapter belongs to. */
  columnTitle?: string;
}
