import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.status(200).json({ data: "hello" });
  } catch (error: any) {
    res.status(503).json({ message: error.message });
  }
}
