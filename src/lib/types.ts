export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  user: SessionUser & { title?: string | null; bio?: string | null; avatarUrl?: string | null };
}

export interface TeamMember {
  id: string;
  fullName: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  linkedInUrl?: string | null;
  gitHubUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface NewsListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string | null;
  publishedAtUtc?: string | null;
}

export interface NewsDetail extends NewsListItem {
  contentMarkdown: string;
  authorName: string;
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string | null;
  tags?: string | null;
  authorName: string;
  status: string;
  publishedAtUtc?: string | null;
}

export interface ArticleDetail extends ArticleListItem {
  contentMarkdown: string;
  moderationNote?: string | null;
}

export interface ProjectMember {
  teamMemberId: string;
  fullName: string;
  avatarUrl?: string | null;
  roleInProject: string;
}

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string | null;
  techStack?: string | null;
  status: string;
}

export interface ProjectDetail extends ProjectListItem {
  descriptionMarkdown: string;
  repoUrl?: string | null;
  demoUrl?: string | null;
  members: ProjectMember[];
}

export interface ListingListItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  authorName: string;
  expiresAtUtc?: string | null;
  createdAtUtc: string;
}

export interface ListingDetail extends ListingListItem {
  bodyMarkdown: string;
  moderationNote?: string | null;
}

export interface SupportMessage {
  id: string;
  senderName: string;
  isFromAdmin: boolean;
  body: string;
  createdAtUtc: string;
}

export interface SupportTicketListItem {
  id: string;
  subject: string;
  status: string;
  createdByName: string;
  createdAtUtc: string;
  messageCount: number;
}

export interface SupportTicketDetail extends SupportTicketListItem {
  messages: SupportMessage[];
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAtUtc: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  pendingArticles: number;
  pendingListings: number;
  openSupportTickets: number;
  unreadContactMessages: number;
  totalNewsPosts: number;
  totalProjects: number;
}

export interface AdminUserListItem {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  createdAtUtc: string;
  lockedOut: boolean;
}

export interface AssistantConversationSummary {
  id: string;
  title: string;
  createdAtUtc: string;
}

export interface AssistantMessageDto {
  id: string;
  role: string;
  content: string;
  createdAtUtc: string;
}
