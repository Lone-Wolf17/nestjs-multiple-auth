export type UserAgentAndIpAddress = {
  ipAddress: string;
  userAgent: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type DecodedAccessToken = {
  userId: number;
};
