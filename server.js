let PDF2pic = require("pdf2pic").default;
let http = require('http');
let urlib = require('url');
let querystring = require('querystring');
let fs = require('fs');

let pageConvert = (index) => {
    return new Promise((resolve, reject) => {
        let converter = new PDF2pic({
            density: 50,
            size: 600,
            format: "png"
          });
        converter.convertToBase64("./doc/pdf1.pdf", index)
        .then(res => {
            if (res.base64) {
                resolve(res.base64);
            }
        }, err => {
            reject(err);
            return null
        });
    })
}

http.createServer((req, res) => {
    let args = urlib.parse(req.url).query;
    let params = querystring.parse(args);
    console.log(req.url);
    if (req.url == '/') {
        res.writeHead(200, {'Content-Type':'text/html'});
        fs.readFile('./index.html', 'utf-8', (err, data) => {
            if (err) {
                throw err
            }
            res.end(data);
        })
    }
    else if (req.url.indexOf('/bundle.js') >= 0) {
        res.writeHead(200, {'Content-Type': "text/javascript"});
        fs.readFile("./bundle.js", (err, data) => {
            if(err) {
                throw err
            }
            res.end(data);
        })
    }
    else if (req.url.indexOf('/page') >= 0) {
        console.log("I am here");
        let index = parseInt(params.index),
            size = parseInt(params.size);
        if (index <= size) {
            pageConvert(index).then(resolve => {
                if (resolve.length < 200) {
                    let error = {
                        error: "Might be the end of the PDF"
                    }
                    res.end(JSON.stringify(error));
                } else {
                    let data = {
                        result: resolve
                    };
                    res.end(JSON.stringify(data));
                }
            }).catch(err => {
                let error = {
                    error: err
                }
                res.end(JSON.stringify(error));
            });
        } 
        else {
            let error = {
                error: "index larger than size"
            }
            res.end(JSON.stringify(error))
        }
    }
}).listen(1221, () => {
    console.log('server is listening on port 1221');
})

