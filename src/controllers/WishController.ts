import { Request, Response } from 'express';
import { Storage, Bucket } from '@google-cloud/storage';
import crypto from 'crypto';

import applicationCredentials from '../config/applicationCredentials';

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

  public create = async (req: Request, res: Response): Promise<Response | void> => {
    if(!req.file) return res.status(400).json({ error: 'Missing file!' });
    // const { user, title, latitude, longitude, image, description } = req.body;
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
    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
      return res.status(200).json({
        fileName: originalname,
        fileLocation: publicUrl
      })
    })
    blobStream.end(buffer);
  }
}

export default new WishController();
