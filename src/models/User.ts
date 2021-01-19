import {
  typedModel,
  createSchema,
  Type,
  ExtractProps,
  ExtractDoc,
} from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true }),
  username: Type.string({ required: true }),
  email: Type.string({ required: true }),
  phone: Type.string({ required: true }),
  cpf: Type.string({ required: true }),
});

export default typedModel('User', UserSchema);
export type ChatDoc = ExtractDoc<typeof UserSchema>;
export type ChatProps = ExtractProps<typeof UserSchema>;
