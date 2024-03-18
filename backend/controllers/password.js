const User = require("../models/user");
const SibApiV3Sdk = require("sib-api-v3-sdk");

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "This Email is not registered",
      });
    }

    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    var apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.EMAIL_API_KEY;

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    const sender = {
      email: "heerjnv@gmail.com",
    };

    sendSmtpEmail = {
      sender,
      to: [
        {
          email: "sumitpandeyjnv@gmail.com",
          name: "Sumit Pandey",
        },
      ],
      subject: "OTP Verification",
      textContent: "1234 is your OTP",
    };

    apiInstance
      .sendTransacEmail(sendSmtpEmail)
      .then(console.log)
      .catch(console.log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};