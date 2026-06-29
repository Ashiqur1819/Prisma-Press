import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface IPostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured: boolean;
  status: PostStatus;
  tags: [];
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: [];
}

export interface IPostQuery extends PostWhereInput {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
}
