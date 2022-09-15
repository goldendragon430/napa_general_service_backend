import { ArticleStatus } from "types/types";

export interface TrendingFeed {
  articleId: string;
  articleTitle: string;
  articleBody: string;
  articleHeadline: string;
  nftProject: string;
  socialMediaCompaign: string;
  articleTags: any[];
  articleType: string;
  partnerUUID: string;
  author: string;
  articleStartDate: string;
  totalRunDays: string;
  articleEndDate: string;
  articleStatus: ArticleStatus;
  postAdInNapaApp: boolean;
  paid: boolean;
  amount: string;
  txid: string;
}