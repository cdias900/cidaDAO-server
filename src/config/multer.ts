import multer from 'multer';

export default {
  storage: multer.memoryStorage(),
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];
    if(allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
}
