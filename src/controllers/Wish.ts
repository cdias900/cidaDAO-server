import { Request, Response } from 'express';
import { Storage, Bucket } from '@google-cloud/storage';
import crypto from 'crypto';

import applicationCredentials from '../config/applicationCredentials';
import Wish from '../models/Wish';
import { UserProps } from '../models/User';

interface WishData {
  user: string;
  title: string;
  latitude: number;
  longitude: number;
  description?: string;
}

class WishController {

  private storage: Storage;

  private bucket: Bucket;

  public constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: applicationCredentials.client_email,
        private_key: applicationCredentials.private_key
      }
    });

    this.bucket = this.storage.bucket(process.env.BUCKET_URL || '');
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const wishes = await Wish.find();
    return res.json(wishes);
  }

  public create = async (req: Request, res: Response): Promise<Response | void> => {
    if(!req.file) return res.status(400).send();
    if(!req.session) return res.status(401).send();
    const user = (req.session.user as UserProps)._id;
    const { title, latitude, longitude, description }: WishData = req.body;
    const { originalname, mimetype, buffer } = req.file;
    const blob = this.bucket.file(`${crypto.randomBytes(16).toString('hex')}-${originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: mimetype
      }
    })
    blobStream.on('error', (err) => {
      return res.status(400).json({
        error: `error: ${err}`
      });
    })
    blobStream.on('finish', async () => {
      const image = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
      const wish = await Wish.create({
        user,
        title,
        latitude,
        longitude,
        image,
        description,
      })
      return res.status(201).json({ wishId: wish._id });
    })
    blobStream.end(buffer);
  }
}

export default new WishController();
