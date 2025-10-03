export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API || 'https://veciapp-backend.onrender.com/api/v1',
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',
        REFRESH_TOKEN: '/auth/refresh-token',
        
        // Orders
        ORDERS: '/orders',
        ORDER_DETAIL: (id: string) => `/orders/${id}`,
        ORDER_STATS: '/orders/stats',
        
        // Vendor Dashboard
        VENDOR_DASHBOARD: (vendorId: string) => `/payments/dashboard/vendor/${vendorId}`,
        
        // Statistics
        CUSTOMERS_STATS: '/customers/stats',
        VENDORS_STATS: '/vendors/stats',
        BRANCHES_STATS: '/branches/stats',
        DELIVERY_STATS: '/delivery/stats',

        // Changes requests
        CHANGE_REQUEST_LIST: '/change-requests?status=PENDING',
        CHANGE_REQUEST_APPROVED: (id: string) => `/change-requests/${id}/approve`,
        CHANGE_REQUEST_REJECTED: (id: string) => `/change-requests/${id}/reject`,
    },
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    }
} as const;

// Tipos de respuesta del API
export interface ApiResponse<T> {
    data: T;
    error: string | null;
    status: 'Success' | 'Error';
}

// Configuración de timeouts y reintentos
export const API_TIMEOUTS = {
    DEFAULT: 30000, // 30 segundos
    LONG: 60000,    // 60 segundos
    SHORT: 10000    // 10 segundos
} as const;

// Mensajes de error
export const API_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    TIMEOUT: 'La solicitud ha tardado demasiado. Por favor, intenta de nuevo.',
    UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión nuevamente.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
    SERVER_ERROR: 'Error en el servidor. Por favor, intenta más tarde.',
    DEFAULT: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
} as const;