import curlToFetch from "curl-to-fetch";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiRequest = curlToFetch(req.body.data);
    const [fetchRequest] = apiRequest.split(".then");
    const response = await eval(fetchRequest);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(503).json({ message: error.message });
  }
}
