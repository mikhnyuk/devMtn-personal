const 	express = require('express')
		bodyParser = require('body-parser')
		massive = require('massive')
		port = 9090


//middle ware
const app = module.exports = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))


//db connection
var conn = massive.connectSync({
	connectionString : "postgres://postgres:password@localhost/massive_demo"
});
app.set('db', conn);
var db = app.get('db');


//
//set controllers
//ALWAYS SET CONTROLLERS AFTER CALLING APP.SET
//
homeCtrl = require('./ctrl/home')
// bookmarksCtrl  = require('/ctrl/bookmarks')
// draftsCtrl = require('/ctrl/drafts')
// followInterestsCtrl  = require('/ctrl/followInterests')
// profileCtrl = require('/ctrl/profile')
// readingHistoryCtrl = require('/ctrl/readingHistory')
// settingsCtrl = require('/ctrl/settings')
// storiesCtrl = require('/ctrl/stories')
// textEditorCtrl = require('/ctrl/textEditor')
// viewArticleCtrl = require('/ctrl/viewArticle')

app.get('/api/getnotifications', homeCtrl.GetNotifications)


app.post('/api/createuser', function(req, res) {
	db.test_create_notification([req.body.user_id,
		req.body.action,
		req.body.action_by_userid,
		req.body.action_on,
		req.body.date], function(err, resp) {
			if (err) {
				console.log(err)	
			}  else {
				res.status(200).send("wtf ever happened! yay!")
			}

		})
})


app.listen(port, function() {
	console.log("Alive and kicking on port ", port)
})