var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 url

function templateHTML(title, list, description){

  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <h2>${title}</h2>
    <p>${description}</p>
  </body>
  </html>

  `;
}

function templateList(filelist){

  var list = '<ul>';
  var i = 0;
  while(i<filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i++;
  }
  list = list + '</ul>' ;
  return list ;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    var title = queryData.id;

    if(pathname === '/'){
      if(queryData.id === undefined){
          fs.readdir('./data',function(error,filelist){
            var list = templateList(filelist);
            var title = 'Welcome';
            var description = 'Hello, Node.js' ;
            var template = templateHTML(title, list, description);
            
            response.writeHead(200);
            response.end(template);

          }); // fs.readdir

      }else {
        fs.readdir('./data',function(error,filelist){

          fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description){
            var list = templateList(filelist);
            var template = templateHTML(title, list, description);
            response.writeHead(200);
            response.end(template);
          });

        }); // fs.readdir

      } // querydata.id
    }else{
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);
