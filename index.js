'use strict';

const APP_ID = process.env.ALEXA_APPLICATION_ID;

const Alexa = require('alexa-sdk');

const states = {
  ASKSEQUEL: '_ASKSEQUEL'
};

const titleFile = {
  "桃太郎": "momotaro",
  "舌切り雀": "shitakiri",
  "猿かに合戦": "sarukani",
  "ねずみの嫁入り": "nezumiyome",
  "かちかちやま": "kachikachi",
  "浦島太郎": "urashima",
  "うばすてやま": "ubaste",
  "金太郎": "kintaro",
  "はなさかじじい": "hanasaka",
  "こぶとりじいさん": "kobutori",
};
const titileList = [
  "桃太郎","舌切り雀","猿かに合戦","ねずみの嫁入り","かちかちやま","浦島太郎","うばすてやま","金太郎","はなさかじじい","こぶとりじいさん"
];

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  console.log(JSON.stringify(event));
  alexa.registerHandlers(storyHandlers,askSequelHandlers);
  alexa.execute();
};
function getTitle(){
  var max = titileList.length;
  var no = Math.floor( Math.random() * max );
  return titileList[no];
}

const storyHandlers = {
  'NewSession': function() {
    this.handler.state = "";
    if(this.event.request.type == "LaunchRequest"){
      this.attributes['title'] = getTitle();
      this.attributes['chapter'] = 0;
      this.emit("TellStoryIntent");
    }
    const intentName = this.event.request.intent.name;

    this.emit(intentName);
  },
  "TellStoryIntent": function() {
    var title = "タイトル名";

    if(this.event.request.type == "IntentRequest" &&
        this.event.request.intent.name == "TellStoryIntent"){
      this.attributes['title'] = this.event.request.intent.slots.title.value;
      this.attributes['chapter'] = 0;
    }
    if(this.attributes['title']){
      title = this.attributes['title'];
    }
    if(!titleFile[title]){
      console.log(title + " not found");
      this.emit(':tell', title+"が見つかりません");
    }
    title = titleFile[title];
    console.log("title:" + title);

    const story = require("./stories/"+title+".js");
    var chapnum = 0;
    if(this.attributes['chapter']){
      chapnum = this.attributes['chapter'];
    }
    const chapter = story[chapnum].valueOf().replace(/\n/g, "")
                    .replace(/\-2「(.*?)」/g, "<prosody pitch=\"x-low\"><p>$1</p></prosody>")
                    .replace(/\-1「(.*?)」/g, "<prosody pitch=\"low\"><p>$1</p></prosody>")
                    .replace(/\+1「(.*?)」/g, "<prosody pitch=\"high\"><p>$1</p></prosody>")
                    .replace(/\+2「(.*?)」/g, "<prosody pitch=\"x-high\"><p>$1</p></prosody>")
                    .replace(/\-2f「(.*?)」/g, "<prosody rate=\"130%\" pitch=\"x-low\"><p>$1</p></prosody>")
                    .replace(/\-1f「(.*?)」/g, "<prosody rate=\"130%\" pitch=\"low\"><p>$1</p></prosody>")
                    .replace(/\+1f「(.*?)」/g, "<prosody rate=\"130%\" pitch=\"high\"><p>$1</p></prosody>")
                    .replace(/\+2f「(.*?)」/g, "<prosody rate=\"130%\" pitch=\"x-high\"><p>$1</p></prosody>")
                    .replace(/\-2s「(.*?)」/g, "<prosody rate=\"70%\" pitch=\"x-low\"><p>$1</p></prosody>")
                    .replace(/\-1s「(.*?)」/g, "<prosody rate=\"70%\" pitch=\"low\"><p>$1</p></prosody>")
                    .replace(/\+1s「(.*?)」/g, "<prosody rate=\"70%\" pitch=\"high\"><p>$1</p></prosody>")
                    .replace(/\+2s「(.*?)」/g, "<prosody rate=\"70%\" pitch=\"x-high\"><p>$1</p></prosody>")
                    .replace(/\+0f「(.*?)」/g, "<prosody rate=\"130%\"><p>$1</p></prosody>")
                    .replace(/\+0s「(.*?)」/g, "<prosody rate=\"70%\"><p>$1</p></prosody>")
                    .replace(/「/g, "<p>").replace(/」/g, "</p>");
    if(chapnum >= story.length - 1){
      this.attributes["STATE"] = "";
      this.emit(':tell', chapter);
    }else{
      this.handler.state = states.ASKSEQUEL;
      this.emit(':ask', chapter);
    }
  },
  "AMAZON.StopIntent": function() {
    this.response.speak("ストップ!");
    this.emit(':responseReady');
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak("キャンセル!");
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    this.response.speak("ヘルプ!");
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function () {
    this.attributes["STATE"] = "";
  },
  'Unhandled': function() {
    this.emit(':ask', 'よくわかりません、もう一度言ってください。');
  }
};

const askSequelHandlers = Alexa.CreateStateHandler(states.ASKSEQUEL, {
  'NewSession': function () {
    this.emit('NewSession');
  },
  "TellStoryIntent": function() {
    this.attributes["STATE"] = "";
    this.emit('TellStoryIntent');
  },
  'AMAZON.YesIntent': function() {
    this.attributes["STATE"] = "";
    this.attributes['chapter'] += 1;
    this.emit('TellStoryIntent');
  },
  'AMAZON.NoIntent': function() {
    this.attributes["STATE"] = "";
    this.emit(':tell', '');
  },
  "AMAZON.CancelIntent": function() {
    this.response.speak("キャンセル!");
    this.emit('AMAZON.NoIntent');
  },
  "AMAZON.StopIntent": function() {
    this.emit('AMAZON.NoIntent');
  },
  'SessionEndedRequest': function () {
    this.attributes["STATE"] = "";
  },
  'Unhandled': function() {
      this.emit(':ask', 'よくわかりません、もう一度言ってください。');
  }
});
