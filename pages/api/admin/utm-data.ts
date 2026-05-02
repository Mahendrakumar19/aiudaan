import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const utmData = await db.utmTracking.findMany({
        orderBy: {
          timestamp: 'desc',
        },
      });

      res.status(200).json(utmData);
    } catch (error) {
      console.error('Error fetching UTM data:', error);
      res.status(500).json({ error: 'Failed to fetch UTM data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}