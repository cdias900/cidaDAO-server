import { celebrate, Joi, Segments } from 'celebrate';

class UserValidation {
  public readonly create = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      cpf: Joi.string().required(),
      phone: Joi.string().required(),
    })
  })

  public readonly update = celebrate({
    [Segments.BODY]: Joi.object().keys({
      bio: Joi.string().required(),
    })
  });
}

export default new UserValidation();
