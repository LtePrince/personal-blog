/** Column (专栏) types — a multi-chapter series. */

/** Column summary returned by the listing API. */
export interface ColumnItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  author?: string;
  tags: string[];
  chapterCount: number;
  /** Last publish/update, unix seconds. */
  updatedAt: number;
}

/** A chapter entry in a column's table of contents. */
export interface ChapterItem {
  slug: string;
  title: string;
}

/** Full column detail including its ordered chapter list. */
export interface ColumnDetail extends ColumnItem {
  chapters: ChapterItem[];
}

/** A single chapter's body. */
export interface ChapterContent {
  slug: string;
  title: string;
  text: string;
}

/** Everything the chapter reading page needs in one payload. */
export interface ChapterView {
  column: ColumnItem;
  chapters: ChapterItem[];
  current: ChapterContent;
  prevSlug?: string;
  nextSlug?: string;
}

/** A column tag with its usage count. */
export interface ColumnTag {
  id: number;
  name: string;
  columnCount: number;
}
