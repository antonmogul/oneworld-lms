class Client {
    private _clientKey: string;
    private _clientSecret: string;
    private _callbackUrl: string;
    constructor(clientKey, clientSecret, callbackUrl = null) {
        this._clientKey = clientKey;
        this._clientSecret = clientSecret;
        this._callbackUrl = callbackUrl;
    }

    getClientKey() {
        return this._clientKey;
    }

    getClientSecret() {
        return this._clientSecret;
    }

    getCallbackUrl() {
        return this._callbackUrl;
    }
}