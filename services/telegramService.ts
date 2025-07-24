import { FeedbackData } from "../types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const areTelegramCredentialsSet = TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID;

if (!areTelegramCredentialsSet) {
    console.warn("Telegram environment variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) are not set. Feedback features will be simulated.");
}

export const sendFeedback = async (feedback: FeedbackData): Promise<boolean> => {
    if (!areTelegramCredentialsSet) {
        console.log("--- SIMULATING TELEGRAM FEEDBACK ---");
        console.log("Type:", feedback.type);
        console.log("Message:", feedback.message);
        console.log("------------------------------------");
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true; // Simulate success
    }

    const message = `
*${feedback.type}*

*Message:*
${feedback.message}

*Timestamp:* ${new Date().toUTCString()}
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();
        if (!result.ok) {
            console.error("Telegram API error:", result);
            throw new Error(result.description || "Failed to send message to Telegram.");
        }

        return true;
    } catch (error) {
        console.error("Error sending feedback to Telegram:", error);
        throw error;
    }
};