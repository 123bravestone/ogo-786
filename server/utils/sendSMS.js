
import twilio from "twilio";
import dotenv from "dotenv";
// const ACaccountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);



export const sendSMS = async (mobileNum, msg) => {
    console.log(mobileNum);
    try {
        const message = await client.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobileNum,
            body: msg,
        });
        // console.log(message);
        if (message) {
            return true;
        }
    } catch (error) {
        // console.log("error SMS", error);
        return false;
    }
};
