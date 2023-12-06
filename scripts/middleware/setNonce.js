import crypto from "crypto";

export default function(req, res, next){
    var nonce = crypto.randomBytes(20).toString("hex");
    res.setHeader("Content-Security-Policy", res.get("Content-Security-Policy").replace("script-src", `script-src 'nonce-${nonce}'`).replace("style-src", `style-src 'nonce-${nonce}'`));
    res.locals.nonce = nonce;
    next();
}