import type { NextApiRequest, NextApiResponse } from "next";
import { getStringifiedTypes } from "../../utils/helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(403).json({ message: "Method not allowed." });
    return;
  }
  try {
    const data = getStringifiedTypes(
      req.body.json,
      req.body.spacing,
      req.body.label,
      req.body.format
    );
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(503).json({ message: error.message });
  }
}
