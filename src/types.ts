import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type GithubRepository = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

export type GithubUser = RestEndpointMethodTypes["users"]["getByUsername"]["response"]["data"];
