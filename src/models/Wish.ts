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
  latitude: Type.number({ required: true }),
  longitude: Type.number({ required: true }),
  image: Type.string({ required: true }),
  description: Type.string(),
  likes: Type.array().of(Type.string()),
});

export default typedModel('Wish', WishSchema);
export type WishDoc = ExtractDoc<typeof WishSchema>;
export type WishProps = ExtractProps<typeof WishSchema>;
