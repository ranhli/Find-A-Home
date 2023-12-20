const OpenAI = require("openai");
const organization = process.env.ORGANIZATION;
const apiKey = process.env.APIKEY;

const openai = new OpenAI({
  organization: organization,
  apiKey: apiKey,
});

module.exports.renderChatForm = (req, res) => {
  res.render("chat");
};

module.exports.submitMessage = async (req, res) => {
  const { message } = req.body;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-3.5-turbo",
  });
  req.flash("success", completion.choices[0].message.content);
  res.redirect("/homes");
};
