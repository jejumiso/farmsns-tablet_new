type PermissionAction = 'read' | 'create' | 'update' | 'delete';

interface CollectionPermissions {
  name: string;
  key: string;
  prefix: string;
  permissions: {
    [key in PermissionAction]: string[];
  };
}

export const COLLECTION_PERMISSIONS: { [key: string]: CollectionPermissions } = {
  counter: {
    name: 'v2_counter',
    key: 'counter',
    prefix: 'cnt',
    permissions: {
      read: ['super'],
      create: ['guest'],
      update: ['super'],
      delete: ['super'],
    },
  },
  companies: {
    name: 'v2_companies',
    key: 'company',
    prefix: 'co',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  administrators: {
    name: 'v2_administrators',
    key: 'administrator',
    prefix: 'adm',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  users: {
    name: 'v2_users',
    key: 'user',
    prefix: 'u',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  options: {
    name: 'v2_options',
    key: 'option',
    prefix: 'opt',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  optionGroups: {
    name: 'v2_optionGroups',
    key: 'optionGroup',
    prefix: 'og',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin', 'super'],
    },
  },
  products: {
    name: 'v2_products',
    key: 'product',
    prefix: 'p',
    permissions: {
      read: ['admin', 'user', 'guest'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  },
  orders: {
    name: 'v2_orders',
    key: 'order',
    prefix: 'ord',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
  },
  stampLogs: {
    name: 'v2_stampLogs',
    key: 'stampLog',
    prefix: 'stl',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  },
  adminLogs: {
    name: 'v2_adminLogs',
    key: 'adminLog',
    prefix: 'adl',
    permissions: {
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    },
  },
  ordersWating: {
    name: 'v2_ordersWating',
    key: 'orderWaiting',
    prefix: 'ow',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
  },
  categories: {
    name: 'v2_categories',
    permissions: {
      read: ['admin', 'user'],
      create: ['admin', 'user'],
      update: ['admin', 'user'],
      delete: ['admin', 'user'],
    },
    key: "category",
    prefix: "ctg"
  },
};
