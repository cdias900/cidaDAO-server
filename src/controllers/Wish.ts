import { Request, Response } from 'express';
import { Storage, Bucket } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

import applicationCredentials from '../config/applicationCredentials';
import Wish from '../models/Wish';
import { UserProps } from '../models/User';

interface WishData {
  user: string;
  title: string;
  type: string;
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
    if(!req.session) return res.status(401).send();
    const user = (req.session.user as UserProps)._id;
    const { title, type, latitude, longitude, description }: WishData = req.body;
    const images: string[] = [];
    return Promise.all((req.files as unknown as [{ filename: string }]).map(async (file) => {
      const res = await this.bucket.upload(path.resolve(__dirname, '..', '..', 'tmp', file.filename));
      images.push(`https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodeURI(res[0].metadata.name)}?alt=media`);
    }))
      .then(async () => {
        (req.files as unknown as [{ filename: string }])
          .forEach((file) => fs.unlinkSync(path.resolve(__dirname, '..', '..', 'tmp', file.filename)));
        const wish = await Wish.create({
          user,
          title,
          type,
          latitude,
          longitude,
          images,
          description,
        })
        return res.status(201).json({ wishId: wish._id });
      })
      .catch(err => res.status(400).json({ error: `error: ${err}` }));
  }

  public async find(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const wish = await Wish.findById(id);
    if(!wish) return res.status(404).send();
    return res.status(200).json(wish);
  }

  public async like(req: Request, res: Response): Promise<Response> {
    if(!req.session) return res.status(401).send();
    const { id } = req.params;
    const user = (req.session.user as UserProps)._id;
    const wish = await Wish.findById(id);
    if(!wish) return res.status(404).send();
    wish.likes = wish.likes.includes(user.toHexString())
      ? wish.likes.filter(l => l !== user.toHexString())
      : [...wish.likes, user.toHexString()];
    await wish.save();
    return res.status(200).send();
  }
}

export default new WishController();
