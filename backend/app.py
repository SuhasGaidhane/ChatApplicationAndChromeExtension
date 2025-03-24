import requests
import os

# Constants
PHONE_NUMBER_ID = "571611579368647"  # Replace with your actual WhatsApp business phone number ID
ACCESS_TOKEN = "EAAJMSuYQBhQBO3ZCZBkzm6VxJwZCblI0Xqn4wENng0IUYRS71b1ZAG4rS7Ef47EAubYRezlG3BWGlTI0FHst7V8KMii5uXa47YN8lZBNKHL2cwwtzW280wlFECZCviZBqBJYZCptKNEZBty27lrRlmL3uSebXp8wWZByP6SdQwZB0DHdbnpxOReFQ6iO3AuyrHpr54e8FLn5VH3W1g21gyQ2DjWKF3L4PMZD"  # Replace with your actual access token
IMAGE_URL = "https://play-lh.googleusercontent.com/PWCUETIUzcy4YOedtPZMmZf7_fvGdjBsoCgWa7kd2Mvh_F3JOdNyIQQPBWrKCMgAk2c"


def send_whatsapp_message(body, template_name, phone_number):
    url = f'https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages'

    data = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": "en_US"},  # Choose the appropriate language code
            "components": [
                {
                    "type": "body",
                    "parameters": body
                },

            ]
        }
    }

    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        print("Message sent successfully!")
    else:
        print(f"Failed to send message: {response.status_code} - {response.text}")


if __name__ == "__main__":
    phone_number = "919209650695"  # Repla92ce with actual recipient number
    template_name = "_simple_text_message"  # Replace with your WhatsApp message template name

    body = [
        {'type': 'text',
         'text': "Praphul"},
        {'type': 'text',
         'text': "Suhas Gaidhane"},
        {'type': 'text',
         'text': 8530412675},
        {'type': 'text',
         'text': "Manish Nagar, Nagpur"},
        {'type': 'text', 'text': "I want to sell XYZ..."},
        {'type': 'text', 'text': "28-02-2025 || 03:50 PM"},
    ]

    send_whatsapp_message(body, template_name, phone_number)
