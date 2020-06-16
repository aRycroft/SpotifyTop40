let exp = require('express');
let fs = require("fs");
let path = require("path");
let request = require('request');
let app = exp();

const port = 8080;
const client_id = 'YOUR_ID';
const client_secret = 'YOUR_SECRET';
const redirect_uri = 'http://localhost:8080/callback';
const scope = 'user-read-private user-top-read';

app.use(exp.static(path.join(__dirname, 'public'), {
  index: false,
  etag: false
}))

app.get('/', function(req, res){
	if(req.query.access_token == null){
	res.redirect('/login');
	}
  else{
    res.sendFile(__dirname + '/public/index.html');
  }
  
});

app.get('/login', function(req, res){
	res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + client_id +
  '&scope=' + scope +
  '&redirect_uri=' + redirect_uri +
  '&show_dialog=' + true
  );
});

app.get('/callback', function(req, res){
	let code = req.query.code;
	let state = req.query.state;
	let authOptions = {
	url: 'https://accounts.spotify.com/api/token',
   form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
   },
   headers: {
     'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
   },
   json: true
};
	request.post(authOptions, function(error, response, body){
	   let access_token = body.access_token, refresh_token = body.refresh_token;
      let options = {
         url: 'https://api.spotify.com/v1/me',
         headers: { 'Authorization': 'Bearer ' + access_token },
         json: true
      };
      request.get(options, function(error, response, body) {
         res.redirect('/' + '?access_token=' + access_token + '&refresh_token=' + refresh_token);
      });
	});
});	

app.listen(port, function() {
	console.log(`Example app listening on port ${port}!`)
});
