import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type GithubRepository = Omit<
  RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0],
  "name"
> & {
  name: string | null;
};

// NOTE: doesn't match with the actual response
// export type GithubUser = RestEndpointMethodTypes["users"]["getByUsername"]["response"]["data"];

export interface GithubUser {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string | null;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
  user_view_type?: string | undefined;
}
