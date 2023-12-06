import helmet from "helmet";

export default helmet.contentSecurityPolicy({
    directives: {
        connectSrc: ["'self'", `ws://election.madum.cc`, "election.madum.cc"],
        imgSrc: ["'self'", "election.madum.cc"],
        scriptSrc: ["'self'"],
        frameAncestors: ["*"]
    }
});