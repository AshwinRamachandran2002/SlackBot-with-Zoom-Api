const { App, ExpressReceiver } = require('@slack/bolt');

// Bring in environment secrets through dotenv
require('dotenv/config')
var emailid='ashwinramachandrang@gmail.com'
// Use the request module to make HTTP requests from Node
const request = require('request')
const fetch=require('node-fetch')
//var indexrouter=require('./routes/index')

/*const express= require('express')
var path=require('path')
var cookieParser=require('cookie-parser')
var logger=require('morgan')
var indexrouter=require('./routes/index')

const server= express()
server.use(logger('dev'))
server.use(express.json())
server.use(express.urlencoded({extended:false}))
server.use(cookieParser())
//server.listen(3000)


server.get('/',function(req,res,next){
  console.log('hi')
})*/



var slack_secret = 'b8c4c3f05e9a64070b8eb3da255d2c2e'
var bot_oauth_token='xoxb-1931689096065-1942879663456-utN5h4gcPLc5IK4Pp6z4R1Lo'

list =[]
const receiver = new ExpressReceiver({ signingSecret: slack_secret });
const app = new App({
  //signingSecret: slack_secret,
  token: bot_oauth_token,
  receiver
});

receiver.router.get('/', (req, res) => {
  console.log('nice')
  if (req.query.code) {
      let url = 'https://zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + process.env.redirectURL;

      request.post(url, (error, response, body) => {

          // Parse response to JSON
          body = JSON.parse(body);

          // Logs your access and refresh tokens in the browser
          console.log(`access_token: ${body.access_token}`);
          console.log(`refresh_token: ${body.refresh_token}`);
          console.log('kk',body)
          if (body.access_token) {

            var options = {
              method: 'POST',
              url: 'https://api.zoom.us/v2/users/ashwinramachandrang@gmail.com/meetings',
              headers: {'content-type': 'application/json', authorization: `Bearer ${body.access_token}  `},
              body: {
                "topic": "Greet",
                "type": "1",
                
                "schedule_for": `${emailid}`,
                
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
              console.log('ok',body.start_url);
            });
          } else {
              // Handle errors, something's gone wrong!
          }

      }).auth(process.env.clientID, process.env.clientSecret);

      return;

  }
  res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
})



// Listens to incoming messages that contain "hello"
app.message('knock knock', async ({ message, say }) => {
    console.log('opened')
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Who is there <@${message.user}>!`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "button_click"
          }
        }
      ],
      //text: `Hey there <@${message.user}>!`
    });
  });

  app.command('/todo', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();
    console.log(command)
    list.push(command.text)
    await say(`I have added it to your list <@${command.user_name}>\n The pending tasks for you are`)
    for(i=0;i<list.length;i++) await say(`${list[i]}`)
    await say(`Have a good day <@${command.user_name}>`)
    
  });

  app.command('/videocall', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();
    emailid=command.text
    await say(`calling ${command.text}`)
    
  });

  
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('Baolt app is running!');
})();


//app.listen(3000)