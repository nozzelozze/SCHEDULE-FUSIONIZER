import axios from "axios";


function sendWebhook(message: string)
{
    const webhook = process.env.DISCORD_WEBHOOK_URL ?? ""
    const request =
    {
        "username": "Error",
        "content": null,
        "embeds": [
            {
                "title": "Whoops! An error ocurred:",
                "description": message,
                "color": 16734296
            }
        ],
        "attachments": []
    }
    return axios.post(webhook, request)

}

const handleError = async (message: string) =>
{
    await sendWebhook(message)
}

export default handleError