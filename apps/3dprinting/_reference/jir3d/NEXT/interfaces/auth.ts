export interface Tokens {
    accessToken?: string
    refreshToken?: string
    status: boolean
}

export interface AuthError {
    [prop: string]: string
}


export interface AuthState {
    isAuthenticated: boolean
    authError?: AuthError
    tokens: Tokens,
    error?: any
    lastAction:
    "firstRun" |
    "tokenAuthentication/pending" |
    "tokenAuthentication/fullfilled" |
    "tokenAuthentication/rejected" |
    "formAuthentication/pending" |
    "formAuthentication/fullfilled" |
    "formAuthentication/rejected" |
    "logOut" |
    "firstRunStopped" |
    "authError" |
    "auth/userAuthenticated" |
    "auth/userDeAuthenticated"
    ,
}