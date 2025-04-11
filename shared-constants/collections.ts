type PermissionAction = 'read' | 'create' | 'update' | 'delete'; // 허용된 액션 정의

interface CollectionPermissions {
  name: string;
  key: string;
  permissions: {
    [key in PermissionAction]: string[]; // 'read', 'create', 'update', 'delete' 키에 대해 string 배열
  };
}

  
  export const COLLECTION_PERMISSIONS: { [key: string]: CollectionPermissions } = {
    counter: {
      name: 'v2_counter',
      permissions: {
        read: ['super'],
        create: ['guest'],
        update: ['super'],
        delete: ['super'],
      },
      key: 'counter',
    },
    companies: {
      name: 'v2_companies',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin', 'super'],
      },
      key: "company"
    },
    administrators: {
      name: 'v2_administrators',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin', 'super'],
      },
      key: "administrator"
    },
    users: {
      name: 'v2_users',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin','super'],
      },
      key: "user"
    },
    options: {
      name: 'v2_options',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin', 'super'],
      },
      key: "option"
    },
    optionGroups: {
      name: 'v2_optionGroups',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin', 'super'],
      },
      key: "optionGroup"
    },
    products: {
      name: 'v2_products',
      permissions: {
        read: ['admin', 'user', 'guest'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin'],
      },
      key: "product"
    },
    orders: {
      name: 'v2_orders',
      permissions: {
        read: ['admin', 'user'],
        create: ['admin', 'user'],
        update: ['admin', 'user'],
        delete: ['admin', 'user'],
      },
      key: "order"
    },
    stampLogs: {
      name: 'v2_stampLogs',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin'],
      },
      key: "stampLog"
    },
    adminLogs: {
      name: 'v2_adminLogs',
      permissions: {
        read: ['admin'],
        create: ['admin'],
        update: ['admin'],
        delete: ['admin'],
      },
      key: "adminLog"
    },
    ordersWating: {
      name: 'v2_ordersWating',
      permissions: {
        read: ['admin', 'user'],
        create: ['admin', 'user'],
        update: ['admin', 'user'],
        delete: ['admin', 'user'],
      },
      key: "orderWaiting"
    },
  };