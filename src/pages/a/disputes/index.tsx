import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Branch,
  Chat,
  Conciliation,
  Customer,
  Vendor,
} from "@/constants/models";
import { AppstoreOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Input,
  message,
  Radio,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd";
import React, { ReactElement, useState } from "react";

const clients: any = [
  {
    id: "0078d549-3483-40be-baa1-b4b4b2e0c252",
    fullName: "Brayan",
    identification: null,
    email: "brayan@gmail.com",
    isEmailVerified: false,
    cellphone: null,
    country: "Colombia",
    city: "Santa Marta",
    address: null,
    age: null,
    birthdate: null,
    gender: null,
    isHabeasDataConfirm: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Cliente creado por primera vez",
        changedAt: "2025-05-09T03:38:11.814Z",
      },
    ],
    isActive: true,
    score: 0,
    interests: [],
    locations: null,
    avatar: null,
    totalSpent: "0.00",
    preferredPaymentMethod: null,
    dietaryRestrictions: [],
    lastOrderDate: null,
    createdAt: "2025-05-09T03:38:11.846Z",
    updatedAt: "2025-05-09T03:38:11.846Z",
  },
  {
    id: "39ae8215-aa40-46aa-9371-c43acb00e37b",
    fullName: "Julian Angulo",
    identification: "111123342323",
    email: "julianangulop@gmail.com",
    isEmailVerified: false,
    cellphone: "57 3012229800",
    country: "Colombia",
    city: "Santa Marta",
    address: null,
    age: null,
    birthdate: null,
    gender: "male",
    isHabeasDataConfirm: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Cliente creado por primera vez",
        changedAt: "2025-05-13T15:18:25.264Z",
      },
    ],
    isActive: true,
    score: 0,
    interests: [],
    locations: null,
    avatar: null,
    totalSpent: "0.00",
    preferredPaymentMethod: null,
    dietaryRestrictions: [],
    lastOrderDate: null,
    createdAt: "2025-05-13T15:18:25.298Z",
    updatedAt: "2025-05-13T15:18:25.298Z",
  },
  {
    id: "e0a287a6-72f4-460c-a254-a8fc80e2b61f",
    fullName: "Johana",
    identification: null,
    email: "johana@gmail.com",
    isEmailVerified: false,
    cellphone: null,
    country: "Colombia",
    city: "Santa Marta",
    address: null,
    age: null,
    birthdate: null,
    gender: null,
    isHabeasDataConfirm: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Cliente creado por primera vez",
        changedAt: "2025-05-15T00:29:31.431Z",
      },
    ],
    isActive: true,
    score: 0,
    interests: [],
    locations: null,
    avatar: null,
    totalSpent: "0.00",
    preferredPaymentMethod: null,
    dietaryRestrictions: [],
    lastOrderDate: null,
    createdAt: "2025-05-15T00:29:31.497Z",
    updatedAt: "2025-05-15T00:29:31.497Z",
  },
  {
    id: "3c9c426e-095a-4d13-b0a0-3c98ae7ad4d3",
    fullName: "Elder",
    identification: null,
    email: "eldersarmiento1@gmail.com",
    isEmailVerified: false,
    cellphone: null,
    country: "Colombia",
    city: "Santa Marta",
    address: null,
    age: null,
    birthdate: null,
    gender: null,
    isHabeasDataConfirm: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Cliente creado por primera vez",
        changedAt: "2025-06-07T21:25:19.844Z",
      },
    ],
    isActive: true,
    score: 0,
    interests: [],
    locations: null,
    avatar: null,
    totalSpent: "0.00",
    preferredPaymentMethod: null,
    dietaryRestrictions: [],
    lastOrderDate: null,
    createdAt: "2025-06-07T21:25:19.961Z",
    updatedAt: "2025-06-07T21:25:19.961Z",
  },
  {
    id: "4586145e-e7a3-45e5-95f2-7a0c49f974fa",
    fullName: "alaskatech",
    identification: null,
    email: "contact.alaskatech@gmail.com",
    isEmailVerified: true,
    cellphone: null,
    country: "Colombia",
    city: "Santa Marta",
    address: null,
    age: null,
    birthdate: null,
    gender: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Cliente creado por primera vez",
        changedAt: "2025-06-08T18:15:00.443Z",
      },
      {
        state: "verified",
        reason:
          "El cliente ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-06-09T22:15:01.771Z",
      },
    ],
    isActive: true,
    score: 0,
    interests: [],
    locations: null,
    avatar: null,
    totalSpent: "0.00",
    preferredPaymentMethod: null,
    dietaryRestrictions: [],
    lastOrderDate: null,
    createdAt: "2025-06-08T18:15:00.482Z",
    updatedAt: "2025-06-09T22:15:01.771Z",
  },
  {
    id: "08072f5b-dd0b-4687-862e-ed5ce95af20d",
    fullName: "John Doe",
    identification: null,
    email: "jutololla@hotmai.com",
    isEmailVerified: false,
    cellphone: null,
    country: "Colombia",
    city: "Santa Marta",
    address: null,
    age: null,
    birthdate: null,
    gender: null,
    isHabeasDataConfirm: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Cliente creado por primera vez",
        changedAt: "2025-07-08T21:51:12.182Z",
      },
    ],
    isActive: true,
    score: 0,
    interests: [],
    locations: null,
    avatar: null,
    totalSpent: "0.00",
    preferredPaymentMethod: null,
    dietaryRestrictions: [],
    lastOrderDate: null,
    createdAt: "2025-07-08T21:51:12.216Z",
    updatedAt: "2025-07-08T21:51:12.216Z",
  },
];
const vendors: any = [
  {
    id: "99f646c1-f73e-4695-b9f3-ce020b2ed536",
    internalCode: "313131",
    fullName: "JULIAN",
    identification: "111222333",
    email: "jutololla@hotmail.com",
    isEmailVerified: true,
    cellphone: "57 3012229800",
    country: "Colombia",
    city: "Santa Marta",
    address: "Direccion 1",
    age: null,
    gender: null,
    avatar: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Veci-proveedor creado por primera vez",
        changedAt: "2025-05-19T15:16:38.290Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-05-19T15:18:08.189Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-05-19T15:23:39.821Z",
      },
    ],
    isActive: true,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {},
    commercialRegistry: null,
    rut: null,
    bio: null,
    createdAt: "2025-05-19T15:16:38.325Z",
    updatedAt: "2025-05-19T15:23:39.822Z",
    deletedAt: null,
  },
  {
    id: "516a7cff-3ee5-4bca-a98e-b02adc3e6e31",
    internalCode: "777890",
    fullName: "Brayan Mercado",
    identification: "434343",
    email: "brayan.msanmartin@gmail.com",
    isEmailVerified: false,
    cellphone: "57 8976765647",
    country: "Colombia",
    city: "Santa Marta",
    address: "Calle falsa 123",
    age: 33,
    gender: "M",
    avatar: null,
    isHabeasDataConfirm: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        changedAt: "2025-04-25T23:18:56.433Z",
      },
    ],
    isActive: false,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {
      type: "Ahorros",
      entity: "Bancolombia",
      number: "23456543234565",
    },
    commercialRegistry: "234321-3",
    rut: "44344434343",
    bio: "Soy un emprendedor ...",
    createdAt: "2025-04-25T23:18:58.601Z",
    updatedAt: "2025-07-11T18:13:47.098Z",
    deletedAt: null,
  },
  {
    id: "67cdd91a-9bb4-4a7f-84a9-0fe669a9d4bc",
    internalCode: "777892",
    fullName: "Otro",
    identification: "32323",
    email: "julianchos.rivera@gmail.com",
    isEmailVerified: true,
    cellphone: "57 7896467345",
    country: "Colombia",
    city: "Santa Marta",
    address: "Calle falsa 123",
    age: 33,
    gender: "M",
    avatar: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Veci-proveedor creado por primera vez",
        changedAt: "2025-04-26T21:58:33.682Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-04-26T22:02:51.419Z",
      },
    ],
    isActive: true,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {
      type: "Ahorros",
      entity: "Bancolombia",
      number: "23456543234565",
    },
    commercialRegistry: "234321-3",
    rut: "44344434343",
    bio: "Soy un emprendedor ...",
    createdAt: "2025-04-26T21:58:35.630Z",
    updatedAt: "2025-07-11T18:33:09.250Z",
    deletedAt: null,
  },
  {
    id: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
    internalCode: "0001",
    fullName: "Adriana Angulo",
    identification: "111123342323",
    email: "adrianaanguloa@gmail.com",
    isEmailVerified: true,
    cellphone: "57 1112223344",
    country: "Colombia",
    city: "Santa Marta",
    address: "Calle 1 Carrera 1 #1",
    age: null,
    gender: "F",
    avatar: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Veci-proveedor creado por primera vez",
        changedAt: "2025-07-17T13:57:33.864Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-07-17T15:37:51.788Z",
      },
    ],
    isActive: true,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {},
    commercialRegistry: null,
    rut: null,
    bio: null,
    createdAt: "2025-07-17T13:57:33.899Z",
    updatedAt: "2025-07-17T15:37:51.788Z",
    deletedAt: null,
  },
  {
    id: "8c3e1763-56ac-49e7-983f-20026c5a8dee",
    internalCode: "321321321",
    fullName: "Farit Majul",
    identification: "1143357242",
    email: "faritmajul@gmail.com",
    isEmailVerified: true,
    cellphone: "57 3008992753",
    country: "Colombia",
    city: "Santa Marta",
    address: "Consolata Mz C Lt 9",
    age: 33,
    gender: "M",
    avatar: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Veci-proveedor creado por primera vez",
        changedAt: "2025-07-17T23:01:27.754Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-07-17T23:03:02.128Z",
      },
    ],
    isActive: true,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {
      type: "Ahorros",
      entity: "Bancolombia",
      number: "21213654",
    },
    commercialRegistry: "321321321",
    rut: "114335654",
    bio: null,
    createdAt: "2025-07-17T23:01:27.790Z",
    updatedAt: "2025-07-17T23:03:02.128Z",
    deletedAt: null,
  },
  {
    id: "845097c4-f298-4d58-ad52-a6ddf355c488",
    internalCode: "123456",
    fullName: "Elder Sarmiento",
    identification: "1143367351",
    email: "eldersarmiento1@gmail.com",
    isEmailVerified: true,
    cellphone: "57 3217805287",
    country: "Colombia",
    city: "Santa Marta",
    address: "av siempre viva 123",
    age: 32,
    gender: "M",
    avatar: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Veci-proveedor creado por primera vez",
        changedAt: "2025-07-18T23:21:51.159Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-07-18T23:22:50.693Z",
      },
    ],
    isActive: true,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {
      type: "Ahorros",
      entity: "daviplata",
      number: "000000",
    },
    commercialRegistry: "12",
    rut: "128930",
    bio: "soy loca pindoca",
    createdAt: "2025-07-18T23:21:51.194Z",
    updatedAt: "2025-07-18T23:22:50.693Z",
    deletedAt: null,
  },
  {
    id: "56c0f0ba-35aa-4103-84f8-61079a4b4b24",
    internalCode: "123123",
    fullName: "Daniel Palmieri",
    identification: "321321321",
    email: "faritmajul3112@hotmail.com",
    isEmailVerified: true,
    cellphone: "57 3008992753",
    country: "Colombia",
    city: "Santa Marta",
    address: "Consolata Mz C Lt 9",
    age: 33,
    gender: "M",
    avatar: null,
    isHabeasDataConfirm: false,
    state: "verified",
    stateHistory: [
      {
        state: "created",
        reason: "Veci-proveedor creado por primera vez",
        changedAt: "2025-07-21T14:53:42.174Z",
      },
      {
        state: "verified",
        reason:
          "Veci-proveedor ha verificado su correo y ha autorizado crear una cuenta.",
        changedAt: "2025-07-21T14:54:50.133Z",
      },
    ],
    isActive: true,
    isReadyToSell: false,
    rank: 0,
    incomes: "0.00",
    bankAccount: {
      type: "Ahorros",
      entity: "23154698434",
      number: "21213654",
    },
    commercialRegistry: "123333333",
    rut: "1231231123",
    bio: "ok",
    createdAt: "2025-07-21T14:53:42.210Z",
    updatedAt: "2025-07-21T14:54:50.133Z",
    deletedAt: null,
  },
];
const branches: any = [
  {
    id: "3f4786bb-7a42-494c-8a36-c09baa1caf62",
    vendorId: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
    name: "EL SOTANO",
    location: {
      type: "Point",
      coordinates: [-74.190294, 11.225966],
    },
    distance: 0,
    address: "Barrio juan 23 calle 25 No.44c-80",
    country: "Colombia",
    city: "Santa Marta",
    rank: 0,
    isActive: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Tienda del Veci-proveedor creada por primera vez",
        changedAt: "2025-07-17T23:04:23.605Z",
      },
    ],
    businessType: "individual",
    operatingHours: {
      friday: null,
      monday: ["08:00", "20:00"],
      sunday: null,
      tuesday: ["08:00", "20:00"],
      saturday: null,
      thursday: ["08:00", "20:00"],
      wednesday: ["08:00", "20:00"],
    },
    logo: "https://res.cloudinary.com/gijumi/image/upload/v1752793558/branches/logos/x7cbrocfsqotqo8eckjf.png",
    managerName: "Javier F.",
    managerPhone: "57 3102535025",
    images: [],
    isPickupAvailable: true,
    isDeliveryAvailable: false,
    availablePaymentMethods: [
      "Efectivo",
      "Nequi",
      "Daviplata",
      "Transfiya",
      "Llaves",
    ],
    description: "Servicio de peluqueria",
    createdAt: "2025-07-17T23:04:23.640Z",
    updatedAt: "2025-07-17T23:05:59.412Z",
  },
  {
    id: "5abea25a-ddaa-4a7d-abcc-61b3f43b4a7a",
    vendorId: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
    name: "Creinna",
    location: {
      type: "Point",
      coordinates: [-74.190294, 11.225966],
    },
    distance: 0,
    address: "Carrera 91a #39i- 82 La carolina",
    country: "Colombia",
    city: "Santa Marta",
    rank: 0,
    isActive: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Tienda del Veci-proveedor creada por primera vez",
        changedAt: "2025-07-17T15:45:15.755Z",
      },
    ],
    businessType: "individual",
    operatingHours: {
      friday: ["07:00", "13:00"],
      monday: ["08:00", "16:30"],
      sunday: null,
      tuesday: ["09:00", "15:00"],
      saturday: null,
      thursday: ["09:00", "16:00"],
      wednesday: ["08:00", "16:00"],
    },
    logo: "https://res.cloudinary.com/gijumi/image/upload/v1752767329/branches/logos/izjdwhsh52ju0wo91s4r.png",
    managerName: "Adriana A.",
    managerPhone: "57 3218237939",
    images: [],
    isPickupAvailable: true,
    isDeliveryAvailable: true,
    availablePaymentMethods: [
      "Nequi",
      "Daviplata",
      "Efectivo",
      "Transfiya",
      "Llaves",
    ],
    description: "Servicio diseño grafico",
    createdAt: "2025-07-17T15:45:15.791Z",
    updatedAt: "2025-07-17T23:07:33.655Z",
  },
  {
    id: "a67b3876-0691-43e8-962c-48b080ab4bf4",
    vendorId: "08f6ec09-0db8-4e7a-a0f3-209f16f4ee20",
    name: "CONFECCIONES MARIA",
    location: {
      type: "Point",
      coordinates: [-74.190294, 11.225966],
    },
    distance: 0,
    address: "Conjunto brisas del jardín apto 541 torre 6",
    country: "Colombia",
    city: "Santa Marta",
    rank: 0,
    isActive: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Tienda del Veci-proveedor creada por primera vez",
        changedAt: "2025-07-17T23:10:46.897Z",
      },
    ],
    businessType: "individual",
    operatingHours: {
      friday: null,
      monday: ["07:00", "14:00"],
      sunday: null,
      tuesday: ["07:00", "14:00"],
      saturday: null,
      thursday: null,
      wednesday: null,
    },
    logo: "https://res.cloudinary.com/gijumi/image/upload/v1752793882/branches/logos/azvtsy8tuqitbfzqhudi.png",
    managerName: "Maria V.",
    managerPhone: "57 3202125012",
    images: [],
    isPickupAvailable: true,
    isDeliveryAvailable: true,
    availablePaymentMethods: ["Efectivo"],
    description: "SERVICIO DE CONFECCIONES",
    createdAt: "2025-07-17T23:10:46.931Z",
    updatedAt: "2025-07-17T23:11:23.161Z",
  },
  {
    id: "b426594b-3103-4135-960f-4514738f67a5",
    vendorId: "99f646c1-f73e-4695-b9f3-ce020b2ed536",
    name: "Mc Chuzz",
    location: {
      type: "Point",
      coordinates: [-74.194906354, 11.241015323],
    },
    distance: 0,
    address: "Restaurante de comida rapida",
    country: "Colombia",
    city: "Santa Marta",
    rank: 0,
    isActive: false,
    state: "created",
    stateHistory: [
      {
        state: "created",
        reason: "Tienda del Veci-proveedor creada por primera vez",
        changedAt: "2025-07-22T18:21:23.704Z",
      },
    ],
    businessType: "individual",
    operatingHours: {
      friday: null,
      monday: ["12:00", "19:00"],
      sunday: null,
      tuesday: ["12:00", "19:00"],
      saturday: null,
      thursday: null,
      wednesday: ["12:00", "19:00"],
    },
    logo: "https://res.cloudinary.com/gijumi/image/upload/v1753208662/branches/logos/hdlg3foggvufwseavfnc.png",
    managerName: "Jose Doe",
    managerPhone: "57 3423335674",
    images: [
      "https://res.cloudinary.com/gijumi/image/upload/v1753208680/branches/images/cqbfsfuc65hvs3w50bxt.jpg",
      "https://res.cloudinary.com/gijumi/image/upload/v1753208702/branches/images/lv50jjsw2shbd3eu9wmp.png",
    ],
    isPickupAvailable: true,
    isDeliveryAvailable: false,
    availablePaymentMethods: ["Efectivo", "Nequi"],
    description: "Hamburguesas y pizza",
    createdAt: "2025-07-22T18:21:23.737Z",
    updatedAt: "2025-07-22T18:25:03.737Z",
  },
];
type DataType = Conciliation & OtherProps;
interface OtherProps {
  customer: Customer;
  vendor: Vendor;
  customerName: string;
  vendorName: string;
  branchName: string;
  chat: Chat;
}
const mockedData: DataType[] = [
  {
    id: "0001",
    createdAt: new Date(),
    status: "created",
    origin: "autogenerated_by_customer_cancel",
    buyingOrderId: "",
    chatId: "",
    createdBy: "jangulop@gmail.com",
    customerName: "Juan Perez",
    vendorName: "Kentucky Manuel",
    branchName: "KFC",
    chat: {
      id: "0001",
      createdAt: new Date(),
      createdBy: "jangulop@gmail.com",
      messages: [
        {
          id: "0001",
          createdAt: new Date(),
          content:
            "Disputa autogenerada por el sistema debido a que el cliente cancelo el pedido.",
          sender: "vendor",
          createdBy: "jangulop@gmail.com",
        },
      ],
    },
    customer: clients[0],
    vendor: vendors[0],
  },
  {
    id: "0002",
    createdAt: new Date(Date.now() - 86400000),
    status: "read",
    origin: "issued_by_vendor",
    buyingOrderId: "BO-002",
    chatId: "chat-002",
    createdBy: "brayan.msanmartin@gmail.com",
    customerName: clients[1].fullName,
    vendorName: vendors[1].fullName,
    branchName: branches[1].name,
    chat: {
      id: "chat-002",
      createdAt: new Date(Date.now() - 86400000),
      createdBy: "brayan.msanmartin@gmail.com",
      messages: [
        {
          id: "msg-002-1",
          createdAt: new Date(Date.now() - 86400000),
          content: "El cliente no recogió el pedido a tiempo.",
          sender: "vendor",
          createdBy: "brayan.msanmartin@gmail.com",
        },
        {
          id: "msg-002-2",
          createdAt: new Date(Date.now() - 86300000),
          content: "Tuve un inconveniente, ¿puedo recogerlo mañana?",
          sender: "customer",
          createdBy: "julianangulop@gmail.com",
        },
      ],
    },
    customer: clients[1],
    vendor: vendors[1],
  },
  {
    id: "0003",
    createdAt: new Date(Date.now() - 2 * 86400000),
    status: "resolved",
    origin: "issued_by_customer",
    buyingOrderId: "BO-003",
    chatId: "chat-003",
    createdBy: "johana@gmail.com",
    customerName: clients[2].fullName,
    vendorName: vendors[2].fullName,
    branchName: branches[2].name,
    chat: {
      id: "chat-003",
      createdAt: new Date(Date.now() - 2 * 86400000),
      createdBy: "johana@gmail.com",
      messages: [
        {
          id: "msg-003-1",
          createdAt: new Date(Date.now() - 2 * 86400000),
          content: "El producto llegó en mal estado.",
          sender: "customer",
          createdBy: "johana@gmail.com",
        },
        {
          id: "msg-003-2",
          createdAt: new Date(Date.now() - 2 * 86400000 + 3600000),
          content:
            "Lamentamos el inconveniente, ¿desea un reembolso o reposición?",
          sender: "vendor",
          createdBy: "julianchos.rivera@gmail.com",
        },
        {
          id: "msg-003-3",
          createdAt: new Date(Date.now() - 2 * 86400000 + 7200000),
          content: "Prefiero reposición, gracias.",
          sender: "customer",
          createdBy: "johana@gmail.com",
        },
      ],
    },
    customer: clients[2],
    vendor: vendors[2],
  },
  {
    id: "0004",
    createdAt: new Date(Date.now() - 3 * 86400000),
    status: "discarded",
    origin: "issued_by_vendor",
    buyingOrderId: "BO-004",
    chatId: "chat-004",
    createdBy: "adrianaanguloa@gmail.com",
    customerName: clients[3].fullName,
    vendorName: vendors[3].fullName,
    branchName: branches[3].name,
    chat: {
      id: "chat-004",
      createdAt: new Date(Date.now() - 3 * 86400000),
      createdBy: "adrianaanguloa@gmail.com",
      messages: [
        {
          id: "msg-004-1",
          createdAt: new Date(Date.now() - 3 * 86400000),
          content: "El pago no fue recibido.",
          sender: "vendor",
          createdBy: "adrianaanguloa@gmail.com",
        },
        {
          id: "msg-004-2",
          createdAt: new Date(Date.now() - 3 * 86400000 + 1800000),
          content: "Ya realicé el pago por Nequi.",
          sender: "customer",
          createdBy: "eldersarmiento1@gmail.com",
        },
        {
          id: "msg-004-3",
          createdAt: new Date(Date.now() - 3 * 86400000 + 3600000),
          content: "No se reflejó el pago, se descarta la disputa.",
          sender: "vendor",
          createdBy: "adrianaanguloa@gmail.com",
        },
      ],
    },
    customer: clients[3],
    vendor: vendors[3],
  },
  {
    id: "0005",
    createdAt: new Date(Date.now() - 4 * 86400000),
    status: "created",
    origin: "autogenerated_by_vendor_cancel",
    buyingOrderId: "BO-005",
    chatId: "chat-005",
    createdBy: "eldersarmiento1@gmail.com",
    customerName: clients[4].fullName,
    vendorName: vendors[4].fullName,
    branchName: branches[0].name,
    chat: {
      id: "chat-005",
      createdAt: new Date(Date.now() - 4 * 86400000),
      createdBy: "eldersarmiento1@gmail.com",
      messages: [
        {
          id: "msg-005-1",
          createdAt: new Date(Date.now() - 4 * 86400000),
          content: "Disputa autogenerada por cancelación del proveedor.",
          sender: "vendor",
          createdBy: "eldersarmiento1@gmail.com",
        },
      ],
    },
    customer: clients[4],
    vendor: vendors[4],
  },
  {
    id: "0006",
    createdAt: new Date(Date.now() - 5 * 86400000),
    status: "read",
    origin: "issued_by_customer",
    buyingOrderId: "BO-006",
    chatId: "chat-006",
    createdBy: clients[5].email,
    customerName: clients[5].fullName,
    vendorName: vendors[5].fullName,
    branchName: branches[1].name,
    chat: {
      id: "chat-006",
      createdAt: new Date(Date.now() - 5 * 86400000),
      createdBy: clients[5].email,
      messages: [
        {
          id: "msg-006-1",
          createdAt: new Date(Date.now() - 5 * 86400000),
          content: "No recibí el producto completo.",
          sender: "customer",
          createdBy: clients[5].email,
        },
        {
          id: "msg-006-2",
          createdAt: new Date(Date.now() - 5 * 86400000 + 1800000),
          content: "¿Podría especificar qué faltó?",
          sender: "vendor",
          createdBy: vendors[5].email,
        },
        {
          id: "msg-006-3",
          createdAt: new Date(Date.now() - 5 * 86400000 + 3600000),
          content: "Faltó una bebida.",
          sender: "customer",
          createdBy: clients[5].email,
        },
      ],
    },
    customer: clients[5],
    vendor: vendors[5],
  },
  {
    id: "0007",
    createdAt: new Date(Date.now() - 6 * 86400000),
    status: "resolved",
    origin: "issued_by_vendor",
    buyingOrderId: "BO-007",
    chatId: "chat-007",
    createdBy: vendors[0].email,
    customerName: clients[0].fullName,
    vendorName: vendors[0].fullName,
    branchName: branches[0].name,
    chat: {
      id: "chat-007",
      createdAt: new Date(Date.now() - 6 * 86400000),
      createdBy: vendors[0].email,
      messages: [
        {
          id: "msg-007-1",
          createdAt: new Date(Date.now() - 6 * 86400000),
          content: "El cliente solicitó devolución y se realizó el reembolso.",
          sender: "vendor",
          createdBy: vendors[0].email,
        },
        {
          id: "msg-007-2",
          createdAt: new Date(Date.now() - 6 * 86400000 + 1800000),
          content: "Gracias por la gestión.",
          sender: "customer",
          createdBy: clients[0].email,
        },
      ],
    },
    customer: clients[0],
    vendor: vendors[0],
  },
  {
    id: "0008",
    createdAt: new Date(Date.now() - 7 * 86400000),
    status: "discarded",
    origin: "autogenerated_by_customer_cancel",
    buyingOrderId: "BO-008",
    chatId: "chat-008",
    createdBy: clients[2].email,
    customerName: clients[2].fullName,
    vendorName: vendors[1].fullName,
    branchName: branches[2].name,
    chat: {
      id: "chat-008",
      createdAt: new Date(Date.now() - 7 * 86400000),
      createdBy: clients[2].email,
      messages: [
        {
          id: "msg-008-1",
          createdAt: new Date(Date.now() - 7 * 86400000),
          content: "Disputa autogenerada por cancelación del cliente.",
          sender: "customer",
          createdBy: clients[2].email,
        },
      ],
    },
    customer: clients[2],
    vendor: vendors[1],
  },
  {
    id: "0009",
    createdAt: new Date(Date.now() - 8 * 86400000),
    status: "created",
    origin: "issued_by_customer",
    buyingOrderId: "BO-009",
    chatId: "chat-009",
    createdBy: clients[4].email,
    customerName: clients[4].fullName,
    vendorName: vendors[2].fullName,
    branchName: branches[3].name,
    chat: {
      id: "chat-009",
      createdAt: new Date(Date.now() - 8 * 86400000),
      createdBy: clients[4].email,
      messages: [
        {
          id: "msg-009-1",
          createdAt: new Date(Date.now() - 8 * 86400000),
          content: "El pedido llegó tarde y frío.",
          sender: "customer",
          createdBy: clients[4].email,
        },
        {
          id: "msg-009-2",
          createdAt: new Date(Date.now() - 8 * 86400000 + 1800000),
          content: "Ofrecemos disculpas, le damos un cupón de descuento.",
          sender: "vendor",
          createdBy: vendors[2].email,
        },
      ],
    },
    customer: clients[4],
    vendor: vendors[2],
  },
  {
    id: "0010",
    createdAt: new Date(Date.now() - 9 * 86400000),
    status: "resolved",
    origin: "autogenerated_by_vendor_cancel",
    buyingOrderId: "BO-010",
    chatId: "chat-010",
    createdBy: vendors[3].email,
    customerName: clients[1].fullName,
    vendorName: vendors[3].fullName,
    branchName: branches[1].name,
    chat: {
      id: "chat-010",
      createdAt: new Date(Date.now() - 9 * 86400000),
      createdBy: vendors[3].email,
      messages: [
        {
          id: "msg-010-1",
          createdAt: new Date(Date.now() - 9 * 86400000),
          content: "Disputa autogenerada por cancelación del proveedor.",
          sender: "vendor",
          createdBy: vendors[3].email,
        },
        {
          id: "msg-010-2",
          createdAt: new Date(Date.now() - 9 * 86400000 + 1800000),
          content: "Entiendo, gracias por avisar.",
          sender: "customer",
          createdBy: clients[1].email,
        },
      ],
    },
    customer: clients[1],
    vendor: vendors[3],
  },
];
const Index = () => {
  const ClientCard = ({ customer }: { customer: Customer }) => {
    return <Card>{customer.fullName}</Card>;
  };
  const VendorCard = ({ vendor }: { vendor: Vendor }) => {
    return <Card>{vendor.fullName}</Card>;
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        const autogeneratedTag = record.origin.includes("autogenerated") ? (
          <Tag> Autogenerado</Tag>
        ) : null;
        const statusMap: Record<string, any> = {
          created: <Tag color="blue">Creado</Tag>,
          read: <Tag>Leído</Tag>,
          discarded: <Tag color="red">Descartado</Tag>,
          resolved: <Tag color="green">Resuelto</Tag>,
        };
        const statusText = statusMap[record.status] || record.status;
        return (
          <Space direction="vertical" wrap>
            <Tag> {new Date(record.createdAt).toLocaleDateString()}</Tag>
            {id}
            {autogeneratedTag}
            {statusText}
          </Space>
        );
      },
    },
    {
      title: "Disputa",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        const isByCustomer = record.origin.includes("by_customer");
        const senderName = isByCustomer
          ? record.vendor.fullName
          : record.customer.fullName;
        const recipientName = isByCustomer
          ? record.customer.fullName
          : record.vendor.fullName;
        const SenderIcon = isByCustomer ? TeamOutlined : AppstoreOutlined;
        const RecipientIcon = isByCustomer ? AppstoreOutlined : TeamOutlined;
        return (
          <>
            <SenderIcon /> Remitente: {senderName}
            <br />
            <RecipientIcon /> Destinatario: {recipientName}
            <br />
            Motivo: {record.chat.messages[0].content}
          </>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <Space wrap split={<Divider type="vertical" />}>
            <ChatDrawer chat={record.chat} />
            <DisputeStateDrawer conciliation={record} />
            <PenalizeDrawer customer={record.customer} vendor={record.vendor} />
          </Space>
        );
      },
    },
  ];
  return (
    <Table<DataType>
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={mockedData}
    />
  );
};

export default Index;
Index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout backButton> {page}</DashboardLayout>;
};

const ChatDrawer = ({ chat }: { chat: Chat }) => {
  const messages = chat.messages;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button type="text" onClick={() => setIsOpen(true)}>
        Ver chat
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        {messages.map((message) => (
          <div key={message.id}>
            <p>
              {message.sender === "customer" ? (
                <TeamOutlined />
              ) : (
                <AppstoreOutlined />
              )}
              <strong> {message.createdBy}: </strong>
              {message.content}
            </p>
          </div>
        ))}
      </Drawer>
    </>
  );
};

const DisputeStateDrawer = ({
  conciliation,
}: {
  conciliation: Conciliation;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(conciliation.status);

  const handleStatusChange = (newStatus: Conciliation["status"]) => {
    setStatus(newStatus);
    // Here would go the API call to update the status
    message.success("Estado actualizado correctamente");
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="text"
        onClick={() => setIsOpen(true)}
        style={{ marginLeft: 8 }}
      >
        Cambiar estado
      </Button>
      <Drawer
        title="Cambiar estado de la disputa"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Text>Estado actual: {status}</Typography.Text>

          <Button
            block
            type={status === "read" ? "primary" : "default"}
            onClick={() => handleStatusChange("read")}
          >
            Marcar como leída
          </Button>

          <Button
            block
            type={status === "resolved" ? "primary" : "default"}
            onClick={() => handleStatusChange("resolved")}
          >
            Marcar como resuelta
          </Button>

          <Button
            block
            danger
            type={status === "discarded" ? "primary" : "default"}
            onClick={() => handleStatusChange("discarded")}
          >
            Descartar
          </Button>
        </Space>
      </Drawer>
    </>
  );
};
const PenalizeDrawer = ({
  customer,
  vendor,
}: {
  customer: any;
  vendor: any;
}) => {
  const [selectedUser, setSelectedUser] = useState<"customer" | "vendor">(
    "customer"
  );
  const [penaltyType, setPenaltyType] = useState<"penalty" | "ban">("penalty");
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handlePenalize = () => {
    // Here would go the API call to penalize/ban the user
    message.success(
      `${penaltyType === "penalty" ? "Penalizado" : "Bloqueado"} ${
        selectedUser === "customer" ? customer.fullName : vendor.fullName
      } exitosamente`
    );
    setIsOpen(false);
  };

  return (
    <>
      <Button type="text" onClick={() => setIsOpen(true)}>
        Penalizar
      </Button>
      <Drawer
        title="Penalizar usuario"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        extra={
          <Button type="primary" onClick={handlePenalize} disabled={!reason}>
            Confirmar
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <Typography.Text strong>Seleccionar usuario</Typography.Text>
            <Radio.Group
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
              }}
            >
              <Radio value="customer">Cliente: {customer.fullName}</Radio>
              <Radio value="vendor">Veci: {vendor.fullName}</Radio>
            </Radio.Group>
          </div>

          <div>
            <Typography.Text strong>Tipo de sanción</Typography.Text>
            <Radio.Group
              value={penaltyType}
              onChange={(e) => setPenaltyType(e.target.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
              }}
            >
              <Radio value="penalty">Penalizar (reducir calificación)</Radio>
              <Radio value="ban">Bloquear cuenta</Radio>
            </Radio.Group>
          </div>

          <div>
            <Typography.Text strong>Razón</Typography.Text>
            <Input.TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ingrese el motivo de la sanción"
              rows={4}
              style={{ marginTop: 8 }}
            />
          </div>
        </Space>
      </Drawer>
    </>
  );
};
