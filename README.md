# AI Job Category Classifier

**Platform Development — Assignment 6: AI-Native Capability**

## Project Overview

An AI-powered job classification REST API built with Cloudflare Workers and Workers AI. The system analyzes job descriptions and automatically assigns them to one of four categories.

## Technologies

- JavaScript
- Cloudflare Workers
- Cloudflare Workers AI
- Llama 3.3 70B Instruct
- Postman

## AI Decision Categories

1. Software Development
2. Design
3. Marketing
4. Other

## API Endpoint

**POST /api/classify**

Request:

```json
{
  "description": "We are looking for a React developer to build websites."
}
```

Example response:

```json
{
  "category": "Software Development",
  "reason": "The job involves frontend development.",
  "source": "ai"
}
```

## Validation

- Job description must be a string.
- Description length must be between 10 and 2000 characters.
- AI output must contain a valid category and a non-empty reason.
- Invalid input returns HTTP 400.

## Fallback

If the AI model fails or returns an invalid response, the system returns:

```json
{
  "category": "Other",
  "reason": "AI unavailable or invalid response",
  "source": "fallback"
}
```

## Testing

Five classification test cases were executed successfully.

| Test | Expected Category | Result |
|---|---|---|
| React Developer | Software Development | PASS |
| Graphic Designer | Design | PASS |
| Digital Marketing Specialist | Marketing | PASS |
| Restaurant Cashier | Other | PASS |
| Python Backend Developer | Software Development | PASS |

Input validation and simulated AI failure were also tested.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Test endpoint:

`http://127.0.0.1:8787/api/classify`

Workers AI requires a Cloudflare connection and may incur usage charges.

## Author

Wichayapon Seepin

Student ID: 6731503036

Mae Fah Luang University
