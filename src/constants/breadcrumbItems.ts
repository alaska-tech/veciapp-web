import { TreeStruct } from "@/components/pure/AutoBreadcrumb";

export const breadcrumItemTree: TreeStruct[] = [
  {
    key: "a",
    value: null,
    children: [
      {
        key: "home",
        value: "Inicio",
      },
      {
        key: "profile",
        value: "Perfil de usuario",
      },
      {
        key: "users",
        value: "Clientes",
        children: [
          {
            key: "newUser",
            value: "Nuevo cliente",
          },
          {
            key: "[id]",
            value: "[{id}]",
          },
        ],
      },
      {
        key: "vendors",
        value: "Proveedores",
        children: [
          {
            key: "[id]",
            value: "[{id}]",
          },
          {
            key: "newVendor",
            value: "Nuevo proveedor",
          },
        ],
      },
      {
        key: "branches",
        value: "Tiendas",
        children: [
          {
            key: "[id]",
            value: "[{id}]",
          },
          {
            key: "newBranch",
            value: "Nueva tienda",
          },
        ],
      },
      {
        key: "payments",
        value: "Pagos",
      },
      {
        key: "conciliations",
        value: "Conciliaciones",
      },
      {
        key: "configuration",
        value: "Parámetros",
      },
    ],
  },
  {
    key: "v",
    value: null,
    children: [
      {
        key: "home",
        value: "Inicio",
      },
      {
        key: "profile",
        value: "Perfil de usuario",
      },
      {
        key: "branches",
        value: "Tiendas",
        children: [
          {
            key: "[id]",
            value: "[{id}]",
          },
          {
            key: "newBranch",
            value: "Nueva tienda",
          },
        ],
      },
    ],
  },
];
