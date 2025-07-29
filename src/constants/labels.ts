import { BranchStateType } from "./models";

export const BRANCH_TYPE_LABELS = {
  individual: "Individual",
  company: "Empresa",
};
export const BRANCH_STATE_LABELS: Record<BranchStateType[number], string> = {
  active: "Activo",
  inactive: "Inactivo",
  temporarily_closed: "Cerrado temporalmente",
  maintenance: "En mantenimiento",
  created: "Creado",
  verified: "Verificado",
  suspended: "Suspendido",
};
