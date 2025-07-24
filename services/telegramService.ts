import { FeedbackData } from "../types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram environment variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) are not set. Feedback features will be disabled.");
}

export const sendFeedback = async (feedback: FeedbackData): Promise<boolean> => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        throw new Error("Telegram credentials are not configured.");
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
