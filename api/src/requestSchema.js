const registrationSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    contactPerson: {
      type: 'string',
    },
  },
  required: [
    'username',
    'password',
    'contactPerson',
  ],
  additionalProperties: true,
};

export {
  authSchema
};

