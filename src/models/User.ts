import {
  typedModel,
  createSchema,
  Type,
  ExtractProps,
  ExtractDoc,
} from 'ts-mongoose';

export const UserSchema = createSchema({
  name: Type.string({ required: true }),
  username: Type.string({ required: true }),
  email: Type.string({ required: true }),
  phone: Type.string({ required: true }),
  cpf: Type.string({ required: true }),
  password: Type.object({ required: true }).of({
    hash: Type.string({ required: true }),
    salt: Type.string({ required: true }),
  }),
  bio: Type.string(),
  picture: Type.string(),

});

export default typedModel('User', UserSchema);
export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>;
