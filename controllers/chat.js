const OpenAI = require("openai");

const openai = new OpenAI({
  organization: "org-XFfPhAcdTBCF7iTnaYsGt21p",
  apiKey: "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",
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
