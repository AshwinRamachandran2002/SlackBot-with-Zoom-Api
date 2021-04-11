var express = require('express');
var bolt= require
const axios =require('axios')
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const alckresult=await axios.post('https://hooks.slack.com/services/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',
  {
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "New request",
          "emoji": true
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Type:*\nPaid Time Off"
          },
          {
            "type": "mrkdwn",
            "text": "*Created by:*\n<example.com|Fred Enriquez>"
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*When:*\nAug 10 - Aug 13"
          }
        ]
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Approve"
            },
            "style": "primary",
            "value": "click_me_123"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Reject"
            },
            "style": "danger",
            "value": "click_me_123"
          }
        ]
      }
    ]
  })
  
  res.json({
    date:new Date().toISOString()
  });
});

module.exports = router;
