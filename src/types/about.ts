/** About page types. */

export interface Education {
  school: string;
  degree: string;
  major: string;
  period: string;
}

export interface TechCategory {
  name: string;
  items: string[];
}

export interface FriendLink {
  id: string;
  name: string;
  url: string;
  avatar?: string;
  description?: string;
}

export interface SponsorQR {
  label: string;
  src: string;
}
