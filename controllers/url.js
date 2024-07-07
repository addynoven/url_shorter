const urlModel = require("../models/urls");

let nanoid = null;

async function initializeNanoid() {
    let nanoidInstance = await import("nanoid");
    nanoid = nanoidInstance.nanoid;
}

async function HandleGenerateNewShortURL(req, res, next) {
    console.log(req.body);
    await initializeNanoid();
    console.log(nanoid, "line 13");
    const body = req.body;
    if (!body.url) {
        return res.status(400).json("url is required");
    }

    try {
        let shortID = nanoid(8);
        console.log(shortID);
        const Url_Entry = new urlModel();
        Url_Entry.shortId = shortID;
        Url_Entry.redirectURL = body.url;
        Url_Entry.visitHistory = [];
        console.log(Url_Entry);
        Url_Entry.save();
        res.render("generate", {
            short_link: `http://localhost:3000/${shortID}`,
            shortID,
        });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

async function HandleGetURL(req, res, next) {
    const id = req.params.id;
    // console.log(id);
    urlModel
        .findOneAndUpdate(
            { shortId: id },
            {
                $push: {
                    visitHistory: {
                        timestamp: new Date().toString(),
                    },
                },
            }
        )
        .then((value) => {
            console.log(value);
            res.redirect(value.redirectURL);
        })
        .catch((err) => {
            res.json(err);
        });
}

async function HandlePostAnalytics(req, res, next) {
    let shortId = req.body.id;
    let send_url = null;
    const urlMatch = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/;
    if (urlMatch.test(shortId)) {
        send_url = shortId;
        shortId = shortId.split("/").pop();
        console.log(shortId, "line 64");
    } else {
        send_url = `http://localhost:3000/${shortId}`;
    }
    if (shortId) {
        try {
            await urlModel.findOne({ shortId }).then((data) => {
                let sends = {
                    url: send_url,
                    "number of click": data.visitHistory.length,
                    visitHistory: data.visitHistory.map((ele) => {
                        return ele.timestamp;
                    }),
                };
                console.log(sends);
                res.render("show_analytics", { sends });
            });
        } catch (error) {
            res.json(error);
        }
    } else {
        return res.status(400).json("url is required");
    }
}

// async function HandleGetAnalytics

module.exports = {
    HandleGenerateNewShortURL,
    HandleGetURL,
    HandlePostAnalytics,
};
