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
});

export default typedModel('Wish', WishSchema);
export type ChatDoc = ExtractDoc<typeof WishSchema>;
export type ChatProps = ExtractProps<typeof WishSchema>;
