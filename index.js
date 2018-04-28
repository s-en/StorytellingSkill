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
    let intentName = "TellStoryIntent";
    if(this.event.request.intent){
      intentName = this.event.request.intent.name;
    }

    this.emit(intentName);
  },
  "TellStoryIntent": function() {
    var title = "タイトル名";
    var rand = Math.floor( Math.random() * 8 );

    if(this.event.request.type == "IntentRequest" &&
        this.event.request.intent.name == "TellStoryIntent"){
      this.attributes['title'] = this.event.request.intent.slots.title.value;
      this.attributes['name'] = this.event.request.intent.slots.name.value;
      this.attributes['rand'] = rand;
      this.attributes['chapter'] = 0;
    }
    if(this.attributes['rand']){
      rand = this.attributes['rand'];
    }
    if(!this.attributes['title']){
      this.attributes['title'] = getTitle();
    }else if(this.attributes['title']=='日本昔ばなし'|| this.attributes['title']=='日本むかし話'|| this.attributes['title']=='日本昔話'){
      this.attributes['title'] = getTitle();
    }
    title = this.attributes['title'];
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
    let chapter = story[chapnum].valueOf().replace(/\n/g, "")
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
    const myname = this.attributes['name'];
    if(myname){
      if(title == "hanasaka"){
        chapter = chapter.replace(/おじいさん/g, myname);
      }
      if(title == "kachikachi"){
        chapter = chapter.replace(/おじいさん/g, myname);
      }
      if(title == "kintaro"){
        chapter = chapter.replace(/金太郎/g, myname);
      }
      if(title == "kobutori"){
        chapter = chapter.replace(/おじいさん/g, myname)
                        .replace(/じいさん/g, myname);
      }
      if(title == "momotaro"){
        if(rand <= 2){
          chapter = chapter.replace(/桃太郎/g, myname);
        }else if(rand == 3){
          chapter = chapter.replace(/犬/g, myname)
        }else if(rand == 4){
          chapter = chapter.replace(/猿/g, myname)
        }else if(rand == 5){
          chapter = chapter.replace(/キジ/g, myname)
        }else{
          chapter = chapter.replace(/鬼/g, myname)
        }
      }
      if(title == "nezumiyome"){
        chapter = chapter.replace(/娘/g, myname);
      }
      if(title == "sarukani"){
        if(rand < 4){
          chapter = chapter.replace(/猿/g, myname);
        }else{
          chapter = chapter.replace(/蟹/g, myname);
        }
      }
      if(title == "shitakiri"){
        if(rand < 4){
          chapter = chapter.replace(/おじいさん/g, myname);
        }else{
          chapter = chapter.replace(/おばあさん/g, myname);
        }
      }
      if(title == "ubaste"){
        chapter = chapter.replace(/お百姓/g, myname);
      }
      if(title == "urashima"){
        if(rand < 6){
          chapter = chapter.replace(/浦島太郎/g, myname)
                      .replace(/浦島/g, myname);
        }else if(rand < 7){
          chapter = chapter.replace(/乙姫/g, myname)
        }else{
          chapter = chapter.replace(/亀/g, myname)
        }
      }
      console.log(chapter);
    }
    if(chapnum >= story.length - 1){
      this.attributes["STATE"] = "";
      this.emit(':tell', chapter);
    }else{
      this.handler.state = states.ASKSEQUEL;
      this.emit(':ask', chapter);
    }
  },
  "AMAZON.StopIntent": function() {
    this.emit(':tell', "");
  },
  "AMAZON.CancelIntent": function() {
    this.emit(':tell', "");
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', 'このスキルでは、有名な日本昔ばなしを読むことができます。日本昔ばなしを開いて、と言ってみてください。','日本昔ばなしを開いて、と言ってみてください。');
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
    this.emit(':ask', 'お話の続きを聴きますか？');
  },
  'AMAZON.YesIntent': function() {
    this.attributes["STATE"] = "";
    this.attributes['chapter'] += 1;
    this.emit('TellStoryIntent');
  },
  'AMAZON.NoIntent': function() {
    this.attributes["STATE"] = "";
    this.emit(':tell', "");
  },
  "AMAZON.CancelIntent": function() {
    this.attributes["STATE"] = "";
    this.emit(':tell', "");
  },
  "AMAZON.StopIntent": function() {
    this.attributes["STATE"] = "";
    this.emit(':tell', "");
  },
  'SessionEndedRequest': function () {
    this.attributes["STATE"] = "";
  },
  'Unhandled': function() {
      this.emit(':ask', 'よくわかりません、もう一度言ってください。');
  }
});
