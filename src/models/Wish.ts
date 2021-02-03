import {
  typedModel,
  createSchema,
  Type,
  ExtractProps,
  ExtractDoc,
} from 'ts-mongoose';

const WishSchema = createSchema({
  user: Type.string({ required: true }),
  title: Type.string({ required: true }),
  type: Type.string({ required: true }),
  latitude: Type.number({ required: true }),
  longitude: Type.number({ required: true }),
  images: Type.array().of(Type.string()),
  description: Type.string(),
  likes: Type.array({ required: true }).of(Type.string()),
});

export default typedModel('Wish', WishSchema);
export type WishDoc = ExtractDoc<typeof WishSchema>;
export type WishProps = ExtractProps<typeof WishSchema>;
