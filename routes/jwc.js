var logger = require('../tools/logger');
var request = require('request');
var cheerio = require("cheerio");

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');
    var host = 'http://jwc.shmtu.edu.cn/Information/'
    var type = req.params.type

    var info = '教务新闻'
    if(type==2){
        info = '教务公告'
    }else{
        type = 1
    }

    request.get({
        url: host + `/MoreInfo.aspx?type=${type}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3355.0 Safari/537.36 GitHub/SHMTU2RSS',
        }
    }, function (err, httpResponse, body) {
        const $ = cheerio.load(body)
        const text = $('a', $('.gvItemNormal', '.tdMCViewList'))
        var rss =
            `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
            <channel>
            <title>上海海事大学 ${info}</title>
            <link>http://jwc.shmtu.edu.cn/Information/MoreInfo.aspx?type=${type}</link>
            <description>上海海事大学 ${info}</description>
            <language>zh-cn</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <ttl>300</ttl>`
        for (var i = 0; i < text.length; i++) {
            var infos = text.slice(i).eq(0)
            var extra = text.parents('.gvItemNormal')
            var title = infos.attr('title')
            var link = host + infos.attr('href')
            var date = extra.next().next().next().next().slice(text.length - i - 1).eq(0).text()
            var catogory = extra.prev().prev().slice(text.length - i - 1).eq(0).text()
            rss += `
            <item>
                <title><![CDATA[${title}]]></title>
                <description><![CDATA[信息类别 - ${catogory}]]></description>
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
