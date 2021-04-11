const { App, ExpressReceiver } = require('@slack/bolt');

// Bring in environment secrets through dotenv
require('dotenv/config')

// Use the request module to make HTTP requests from Node
const request = require('request')



var slack_secret = 'b8c4c3f05e9a64070b8eb3da255d2c2e'
var bot_oauth_token='xoxb-1931689096065-1942879663456-utN5h4gcPLc5IK4Pp6z4R1Lo'

const receiver = new ExpressReceiver({ signingSecret: slack_secret });
const app = new App({
  //signingSecret: slack_secret,
  token: bot_oauth_token,
  receiver
});
exports.video= (req,res)=>{

    // Step 1: 
    // Check if the code parameter is in the url 
    // if an authorization code is available, the user has most likely been redirected from Zoom OAuth
    // if not, the user needs to be redirected to Zoom OAuth to authorize
  
    if (req.query.code) {
  
        // Step 3: 
        // Request an access token using the auth code
  
        let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.redirectURL;
  
        request.post(url, (error, response, body) => {
  
            // Parse response to JSON
            body = JSON.parse(body);
  
            // Logs your access and refresh tokens in the browser
            //console.log(`access_token: ${body.access_token}`);
            //console.log(`refresh_token: ${body.refresh_token}`);
            //console.log('kk',body)
            if (body.access_token) {
  
              var options = {
                method: 'POST',
                url: 'https://api.zoom.us/v2/users/xg6BlBqbRya1NYqe8ohruA/meetings',
                headers: {'content-type': 'application/json', authorization: `Bearer ${body.access_token}  `},
                body: {
                  "topic": "Greet",
                  "type": "1",
                  
                  "schedule_for": "ashwinramachandrang@gmail.com",
                  
                  "password": "1234",
                  "agenda": "Lets meet",
                  
                  "settings": {
                    "host_video": "true",
                    "participant_video": "true",
                    "cn_meeting": "false",
                    "in_meeting": "true",
                    "join_before_host": "true",
                    "mute_upon_entry": "true",
                    "watermark": "false",
                    "use_pmi": "true",
                    "approval_type": "0",
                    
                    "audio": "both",
                    "auto_recording": "none",
                    "enforce_login": "false",
                    "enforce_login_domains": "none",
                    
                    
                    "registrants_email_notification": "true"
                }},
                json: true
              };
              request.post(options, function (error, response, body) {
                if (error) throw new Error(error);
                res.redirect(body.start_url)
                //console.log('ok',body.start_url);
              });
            } else {
                // Handle errors, something's gone wrong!
            }
  
        }).auth(process.env.clientID, process.env.clientSecret);
  
        return;
  
    }
    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
  }