export const FieldType = ["text", "image", "schedule"] as const;
export type FieldTypeType = typeof FieldType;

const TypeOfRender: Record<string, string> = {
    name: 'text',
}

function renderField(field: any, type: FieldTypeType[number]) {
    switch (type) {
        case 'text':
            // Aquí va tu lógica para renderizar texto
            return field;
        case 'image':
            // Aquí va tu lógica para renderizar imagen
            return field;
        case 'schedule':
            // Aquí va tu lógica para renderizar horario
            return field;
        default:
            return field;
    }
}