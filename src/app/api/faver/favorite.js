import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { MongoClient } from 'mongodb';

const uri = 'YOUR_MONGODB_CONNECTION_STRING';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await client.connect();
    const database = client.db('your-database-name');
    const collection = database.collection('favorites');
    const favorites = await collection.find({ userId: session.user.id }).toArray();
    res.status(200).json({ favorites });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  } finally {
    await client.close();
  }
}
