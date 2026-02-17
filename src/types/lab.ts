/** Lab / project showcase types. */

export interface Project {
  id: string;
  title: string;
  description: string;
  href?: string;
  tags?: string[];
  icon?: string;
}

/** Server resource gauges. */
export interface ServerStats {
  cpu: number;
  memory: number;
  disk: number;
}
