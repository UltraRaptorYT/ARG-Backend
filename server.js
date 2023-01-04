const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const supabase = require("./config/supabase");
const superbase = require("./config/superbase");

const app = express();
var options = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const passcodeDict = {
  1: "8607a8ddaae25c657fb4e340594e9906329956efc1f102ab59dc9c8f4db2fa42",
  2: "96c32e6230333f3d32a3482cd4a8eb85c88c2f6c4de80788184e9cd5adc4fa43",
  3: "hi",
  4: "hi",
  5: "hi",
  6: "hi",
  7: "hi",
  8: "hi",
  9: "hi",
  10: "hi",
};

app.get("/test", (req, res) => {
  res.status(200).json({ response: "Am testing" });
});

const answers = "BOB OPEN DOORS";

app.post("/api/chat", async (req, res) => {
  let { prompt } = req.body;
  let answer_output = answers[prompt];
  try {
    if (prompt.length == 0) {
      throw new Error();
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `The following is a conversation with an AI protector where the human is trying to guess a code from the protector. The protector is tired, very restless and protective. It is also tight-lipped and replies with sarcastic responses. The protector's name is Constantine Dimitris Papageorgiou the third or more commonly known as Bob. The protector is protecting the ancient civilisation called Apeiropolis where they have uploaded themselves into cyberspace. The reason why they are in cyberspace is because of this event called The Great Rupture. This event started when multiple civilisations targeted Apeiropolis for their technology. Because of this technology and wars broke out and there was no turning back. The ancients sealed off and hid in Apeiropolis and swore to protect it. To gain access to the AI's trust, the Human needs to give the passcode \"Bob open doors\". After getting the AI's trust, the AI will explain what happened to Apeiropolis.\nHuman: ${prompt}\nAI:`,
      temperature: 0.7,
      max_tokens: 100,
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
  res.status(200).json({
    message: answer_output,
    openDoor: prompt.toUpperCase().includes(answers) ? passcodeDict[1] : false,
  });
});

app.post("/newProgress", async (req, res) => {
  var { currentStage, userid, passcode } = req.body;
  currentStage = parseInt(currentStage);
  if (passcode == passcodeDict[currentStage]) {
    superbase
      .from("progress")
      .update({ completed_at: new Date() })
      .eq("uid", userid)
      .eq("stage", currentStage)
      .then(({ data, error }) => {
        console.log(error);
        if (error) {
          return res.status(500).send(error);
        }
        supabase
          .from("progress")
          .insert({
            stage: currentStage + 1,
            uid: userid,
          })
          .then(({ data, error }) => {
            console.log(error);
            if (error) {
              return res.status(500).send(error);
            }
            return res.status(201).send({
              stage: currentStage + 1,
              uid: userid,
            });
          });
      });
  } else {
    return res.status(500).send("Stop hacking!");
  }
});

app.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  if (email == "" || password == "") {
    res.status(500).send("An input is empty");
    return;
  } else {
    supabase.auth
      .signInWithPassword({
        email: email,
        password: password,
      })
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        } else {
          console.log("successful");
        }
        var userid = data["user"]["id"];
        superbase
          .from("progress")
          .select()
          .eq("uid", userid)
          .then(({ data, error }) => {
            if (error) {
              console.log(error);
              return res.status(500).send(data);
            }
            console.log(data);
            return res.status(200).send(data[0]);
          });
      });
  }
});

app.post("/signup", (req, res) => {
  var email = req.body.email;
  var full_name = req.body.full_name;
  var password = req.body.password;
  var admin_number = req.body.admin_number;
  var student_class = req.body.student_class;
  supabase.auth
    .signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: full_name,
          admin_number: admin_number,
          student_class: student_class,
        },
      },
    })
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        return;
      } else {
        let stage = 1;
        let uid = data["user"]["id"];
        supabase
          .from("progress")
          .insert({
            stage: stage,
            uid: uid,
          })
          .then(({ data, error }) => {
            if (error) {
              console.log(error);
              return;
            }
            res.status(202).send(data);
          });
      }
    });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});
