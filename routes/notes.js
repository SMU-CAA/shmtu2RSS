var logger = require('../tools/logger');
var request = require('request');
var cheerio = require("cheerio");

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    var host = 'http://www.shmtu.edu.cn'

    request.get({
        url: host + `/notes`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3355.0 Safari/537.36 GitHub/SHMTU2RSS',
        }
    }, function (err, httpResponse, body) {
        const $ = cheerio.load(body)
        const text = $('tr', 'tbody')

        var rss =
            `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
            <channel>
            <title>上海海事大学 通知公告</title>
            <link>http://www.shmtu.edu.cn/notes</link>
            <description>上海海事大学 通知公告</description>
            <language>zh-cn</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <ttl>300</ttl>`
        for (var i = 1; i <= $('.date', text).length; i++) {
            var date = $('span', 'span', text).slice(i).eq(0).attr('content')
            var title = $('.title', text).slice(i).eq(0).text()
            var link = host + $('a', text).slice(i).eq(0).attr('href')
            var department = $('.department', text).slice(i).eq(0).text()
            rss += `
            <item>
                <title><![CDATA[${title}]]></title>
                <description><![CDATA[发布部门 - ${department}]]></description>
                <pubDate>${new Date(date).toUTCString()}</pubDate>
                <link>${link}</link>
            </item>`
        }
        rss += `
        </channel>
        </rss>`

        res.send(rss);

    });

};