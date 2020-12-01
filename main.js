var http = require('http');
var fs = require('fs');
var url = require('url'); // 모듈 _url
var qs = require('querystring');

function templateHTML(title, list, description, control){

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
    ${control}
    ${description}
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
            var template = templateHTML(title, list,
              `<h2>${title}</h2>
              <p>${description}</p>`,
              `<a href="/create">create</a>`
            );

            response.writeHead(200);
            response.end(template);

          }); // fs.readdir

      }else {
        fs.readdir('./data',function(error,filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description){
            var list = templateList(filelist);
            var template = templateHTML(title, list,
              `<h2>${title}</h2>
              <p>${description}</p>`,
              ` <a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
                </form>
              `);
            response.writeHead(200);
            response.end(template);
          }); // fs.readFile

        }); // fs.readdir

      }
    }else if (pathname==='/create'){
      fs.readdir('./data',function(error,filelist){
        var list = templateList(filelist);
        var title = 'Web - create';
        var template = templateHTML(title, list, `
          <form class="" action="/create_process" method="post">
            <p><input type='text' name="title" placeholder="title"></p>
            <p>
              <textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit" name="" value="Submit">
            </p>
          </form>
          `,
        '');

        response.writeHead(200);
        response.end(template);

      }); // fs.readdir
    } else if (pathname==='/create_process'){
      var body='';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description, 'utf8',function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
        });

      });

    }else if (pathname==='/update'){
      fs.readdir('./data',function(error,filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description){
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `
            <form class="" action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" value="${title}" placeholder="title"></p>
              <p>
                <textarea name="description" rows="8" cols="80" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit" name="" value="Submit">
              </p>
            </form>
            `,
            ''
          );
          response.writeHead(200);
          response.end(template);
        }); // fs.readFile

      }); // fs.readdir


    }else if (pathname==="/update_process"){

      var body='';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${post.id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`,description, 'utf8',function(err){
                  response.writeHead(302, {Location: `/?id=${title}`});
                  response.end();
          });
        });

      });

    }else {
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);
