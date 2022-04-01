const express = require("express");
const router = express.Router();

const request = require("request");
const fs = require("fs");

const Token = require("../model/token");
const User = require("../model/user");
const Ticket = require("../model/ticket");
const res = require("express/lib/response");

const LOTTERY_URL = "https://www.national-lottery.co.uk/results/euromillions/draw-history/csv";

router.post("/create", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.post("/delete", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.get("/get", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.get("/check", function(req, res, next) {
    res.status(501).json({error: 'Not implemented'});
});

router.get("/latest", async function(req, res, next) {
    let numbers = await getLatestNumbers()
        .then((numbers) => {
            res.status(200).json({numbers: numbers});
        })
        .catch((err) => {
            res.status(400).json({error: "Unable to get latest numbers"});
        });
});

/* Gets the file name for the latest lotto result
 * @returns {string} in the format of "yyyy-month-dd.csv"
 */
function getLottoResultName()
{
    const date = new Date();
    const currentDay = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return currentDay + ".csv";
}


/* Downloads the latest lotto result file from national lottery API  */
async function downloadLottoResults()
{
    let file = fs.createWriteStream("./data/" + getLottoResultName());
    await new Promise((resolve, reject) => {
        let stream = request({
            uri: LOTTERY_URL,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
            },
            gzip: true
        })
        .pipe(file)
        .on('finish', () => {
            resolve();
        })
        .on('error', (err) => {
            reject(err);
        })
    })
    .catch((err) => {
        console.log(err);
    });
}


/* Gets the latest lotto numbers
 * Will first check if we've already downloaded the latest lotto numbers csv
 * from the national lottery website. If not, it will download it.
 * 
 * Will then extract line 2 from the CSV which is always the latest entry and 
 * extract the winning numbers
 * 
 * @returns {array} of winning numbers
 */
async function getLatestNumbers()
{
    let fileExists = fs.existsSync("./data/" + getLottoResultName());
    if(!fileExists)
        await downloadLottoResults();

    let latestResultCsv = await new Promise((resolve, reject) => {
        fs.readFile("./data/" + getLottoResultName(), "utf8", (err, data) => {
            if(err)
            {
                reject(err);
            }
            resolve(data);
        });
    }).catch((err) => {
        console.log(err);
    });

    let lines = latestResultCsv.split("\n");
    let latestResult = lines[1];
    let numbers = latestResult.split(",");
    return numbers.slice(1,8);
}



module.exports = router;