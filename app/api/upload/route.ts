import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.ASTRBOT_API_KEY;
const BASE_URL = process.env.ASTRBOT_BASE_URL || "http://localhost:6185/api/v1";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  try {
    const response = await axios.post(`${BASE_URL}/file`, uploadFormData, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
