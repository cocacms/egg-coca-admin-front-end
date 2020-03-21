export default {
  query: {
    include: [
      {
        association: 'roles',
        attributes: ['id', 'name'],
      },
    ],
  },

  filters: [
    { key: 'account', label: '账号', type: 'text' },
    { key: 'createdAt', label: '创建时间', type: 'date' },
  ],

  initialValues: (v: any) => {
    if (!v) v = {};
    v.roles = (v.roles || []).map((i: any) => i?.id);
    v.password = '';
    return v;
  },
};
