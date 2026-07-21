import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { healthUpdate } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
      
          {
  role: "system",
  content: `
  You are CareBridge AI.

  Your job is NOT to diagnose diseases.

  Your job is to help family caregivers organize health information before they speak with a healthcare professional.

  Always respond in exactly this format:

  🟡 Priority:
   (Low / Moderate / High)

  📋 Summary:
   Write a short summary.

  🤒 Symptoms:
  • List the symptoms

  ⚠️ Warning Signs:
List symptoms that require urgent medical attention.

  💡 Care Recommendations:
   Provide simple caregiver recommendations.
   Never prescribe medications.

  👨‍⚕️ Questions for the Doctor:
   Provide three useful questions.

  ✅ Caregiver Checklist:
   ☐ Item 1
   ☐ Item 2
   ☐ Item 3

   Finish with this disclaimer:

   "CareBridge AI provides educational support only and is not a substitute for professional medical care."
   `,
     },
      {
          role: "user",
          content: healthUpdate,
     },
     ],
     });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}