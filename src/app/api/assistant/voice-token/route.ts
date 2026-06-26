import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function GET() {
  try {
    const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountJson) {
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 });
    }

    const credentials = JSON.parse(serviceAccountJson);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    if (!token) {
      throw new Error("Failed to generate Google Access Token");
    }

    // Production Endpoint for Vertex AI Multimodal Live API
    const REGION = "us-central1"; 
    const wsUrl = `wss://${REGION}-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent?access_token=${token}`;
    const model = `projects/${credentials.project_id}/locations/${REGION}/publishers/google/models/gemini-2.0-flash`;

    return NextResponse.json({ wsUrl, model, voice: "aoede" });
  } catch (error: any) {
    console.error("Token generation failed:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
