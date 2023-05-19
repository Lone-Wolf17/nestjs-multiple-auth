export type UserAgentAndIpAddress = {
    ipAddress: string;
    userAgent: string
}

export type Tokens = {
    access_token: string;
    refresh_token: string;
}

export type DecodedAccessToken = {
    userId: number
}