var express = require('express');
var app = express();
var moment = require('moment');

var bodyParser = require('body-parser');
// force use of nodes native query parser module querystring
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

app.set('port', (process.env.PORT || 8080));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/html/index.html');
});

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// requests from the URL - dynamic route
app.get('/:time', function(req, res) {
    var unixVal = null;
    var natVal = null;
    if (moment(req.params.time, 'X', true).isValid()) {
        unixVal = parseInt(req.params.time);
        var date = new Date(unixVal * 1000);
        natVal = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    }
    else if(moment(req.params.time, "MMMM D, YYYY", true).isValid() || moment(req.params.time, "MMMM D YYYY", true).isValid() || moment(req.params.time, "YYYY MMMM D", true).isValid() ||
    moment(req.params.time, "MMM D, YYYY", true).isValid() || moment(req.params.time, "MMM D YYYY", true).isValid() || moment(req.params.time, "YYYY MMM D", true).isValid()){
        unixVal = Date.parse(req.params.time)/1000;
        date = new Date(unixVal * 1000);
        natVal = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    }
    res.json({ unix: unixVal, natural: natVal });
});

// requests from the form
app.post('/date_timestamp', parseUrlencoded, function(req, res) {
    var dateStr = req.body.month + " " + req.body.day + ", " + req.body.year;
    var time = Date.parse(dateStr)/1000;
    if (moment(time).isValid()) {
        res.json({ unix: time, natural: dateStr });
    }
    else {
        res.json({ unix: null, natural: null });
    }
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port', app.get('port'));
});