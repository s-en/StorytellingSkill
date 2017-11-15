'use strict';

const APP_ID = undefined;

const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
      this.response.speak("呼び出されました");
      this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("キャンセルテスト");
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        //this.response.speak("ストップテスト");
        //this.emit(':responseReady');
        //var story = require("./stories/momotaro.js");
        //this.emit(':tell', story);
        const requestId = this.event.request.requestId;
        const token = this.event.context.System.apiAccessToken;
        const endpoint = this.event.context.System.apiEndpoint;
        const ds = new Alexa.services.DirectiveService();

        var teststr1 = 'むかしむかし、あるところに、お爺さんとお婆さんがいました。';
        var teststr2 = 'まいにち、お爺さんは山へ芝刈りに、お婆さんは川へ洗濯に行きました。ある日、お婆さんが、川のそばで、せっせと洗濯をしていますと、川上から、大きな桃が一つ、<prosody rate="x-slow">ドンブラコ、ドンブラコ。</prosody>と流れて来ました。<prosody pitch="high">おや、おや、これはみごとな桃だこと。お爺さんへのおみやげに、どれ、どれ、うちへ持って帰りましょう。」</prosody>と言って、桃をひろい上げて、洗濯物といっしょにたらいの中に入れて、えっちら、おっちら、かかえておうちへ帰りました。';
        const directive2 = new Alexa.directives.VoicePlayerSpeakDirective(requestId, teststr2);
        ds.enqueue(directive2, endpoint, token)
            .catch((err) => {
                // catch API errors so skill processing an continue
                console.log(err);
            });
        const directive1 = new Alexa.directives.VoicePlayerSpeakDirective(requestId, teststr1);
        ds.enqueue(directive1, endpoint, token)
            .catch((err) => {
                // catch API errors so skill processing an continue
                console.log(err);
            });


         // Simulate a 3 second API call to avoid the case that the skill service response is received before directive service responses
         setTimeout(() => {
             this.response.speak('I found the following results');
             this.emit(':responseReady');
         }, 3000);
    },
  };
