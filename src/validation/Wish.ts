import { celebrate, Joi, Segments } from 'celebrate';

class WishValidation {
  public readonly create = celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      description: Joi.string().optional(),
    }),
  });
}


export default new WishValidation();
