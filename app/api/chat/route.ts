import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ASTRBOT_API_KEY;
const BASE_URL = process.env.ASTRBOT_BASE_URL || "http://localhost:6185/api/v1";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || "Failed to connect to AstrBot" };
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    const readableStream = response.body;
    return new NextResponse(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to connect to AstrBot server" },
      { status: 502 }
    );
  }
}
