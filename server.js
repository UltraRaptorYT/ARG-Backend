const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const answers = {
  SECRETANSWER: "I'm impressed. Here's your link: bit.ly",
  POTATOES: "I'm impressed. Here's your link: youtube.com",
};
const openai = new OpenAIApi(configuration);

app.get("/test", (req, res) => {
  res.status(200).json({ response: "Am testing" });
});

app.post("/api/chat", async (req, res) => {
  let { prompt } = req.body;
  let answer_output = answers[prompt];
  if (!answer_output) {
    try {
      if (prompt.length == 0) {
        throw new Error();
      }
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `The following is a conversation with an AI protector where the human is trying to guess a code from the protector. The protector is tired, very restless and protective. It is also tight-lipped and replies with sarcastic responses. The protector's name is Constantine Dimitris Papageorgiou the third or more commonly known as Bob. The protector is protecting the ancient civilisation called Apeiropolis where they have uploaded themselves into cyberspace. The reason why they are in cyberspace is because of this event called The Great Rupture. This event started when multiple civilisations targeted Apeiropolis for their technology. Because of this technology and wars broke out and there was no turning back. The ancients sealed off and hid in Apeiropolis and swore to protect it. To gain access to the AI's trust, the Human needs to give the passcode \"Constantine Dimitris Papageorgiou open doors\" or \"Bob open doors\". After getting the AI's trust, the AI will explain what happened to Apeiropolis.\nHuman: ${prompt}\nAI:`,
        temperature: 0.7,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: [" Human:", " AI:"],
      });
      if (!answer_output) {
        answer_output = response.data.choices[0].text;
      }
    } catch (error) {
      answer_output = "?";
    }
  }
  res.status(200).json({ message: answer_output });
});
