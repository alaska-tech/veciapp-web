import React from 'react';
import { Card, Divider, Typography } from 'antd';
import { Branch, BranchBusiness, weekDay, WEEKDAY_LABEL } from '@/constants/models';
import { BRANCH_TYPE_LABELS } from '@/constants/labels';
import dynamic from 'next/dynamic';

const { Text, Title } = Typography;

const MapDisplay = dynamic(
  () => import("@/components/pure/MapDisplay"),
  { ssr: false }
);

interface DisplayBranchInfoProps {
  branch: Branch;
}

const DisplayBranchInfo: React.FC<DisplayBranchInfoProps> = ({ branch }) => {
  // Función para verificar si un valor está vacío
  const isEmpty = (value: any): boolean => {
    if (value === undefined || value === null || value === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && value !== null && Object.keys(value).length === 0) return true;
    return false;
  };

  // Función para mostrar un campo solo si no está vacío
  const renderField = (label: string, value: any, formatter?: (val: any) => React.ReactNode) => {
    if (isEmpty(value)) return null;
    
    return (
      <div style={{ marginBottom: '16px' }}>
        <Text strong>{label}: </Text>
        <Text>{formatter ? formatter(value) : value}</Text>
      </div>
    );
  };

  // Función para renderizar los horarios de operación
  const renderOperatingHours = () => {
    if (!branch.operatingHours || Object.keys(branch.operatingHours).length === 0) return null;

    return (
      <>
        <Title level={5} style={{ marginTop: '16px', marginBottom: '8px' }}>Horarios de atención</Title>
        {weekDay.map(day => {
          const hours = branch.operatingHours?.[day];
          if (!hours) return null;
          
          return (
            <div key={day} style={{ marginBottom: '8px' }}>
              <Text strong>{WEEKDAY_LABEL[day]}: </Text>
              <Text>{`${hours[0]} - ${hours[1]}`}</Text>
            </div>
          );
        })}
      </>
    );
  };

  // Función para renderizar los métodos de pago
  const renderPaymentMethods = () => {
    if (!branch.availablePaymentMethods || branch.availablePaymentMethods.length === 0) return null;

    return (
      <div style={{ marginBottom: '16px' }}>
        <Text strong>Métodos de pago disponibles: </Text>
        <Text>{branch.availablePaymentMethods.join(', ')}</Text>
      </div>
    );
  };

  // Función para renderizar opciones de recogida y envío
  const renderPickupDeliveryOptions = () => {
    const options = [];
    
    if (branch.isPickupAvailable) {
      options.push('Recogida en tienda disponible');
    }
    
    if (branch.isDeliveryAvailable) {
      options.push('Envío a domicilio disponible');
    }
    
    if (options.length === 0) return null;
    
    return (
      <div style={{ marginBottom: '16px' }}>
        <Text strong>Opciones de entrega: </Text>
        <Text>{options.join(', ')}</Text>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <Card style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {/* INFORMACIÓN GENERAL */}
        <div>
          <Divider>Información general</Divider>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {/* Columna izquierda */}
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderField('Nombre de la tienda', branch.name)}
              {renderField('Dirección completa', branch.address)}
              
              {!isEmpty(branch.location) && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Ubicación: </Text>
                  <div style={{ height: '200px', marginTop: '8px' }}>
                    <MapDisplay 
                      position={{
                        lat: branch.location.coordinates[1],
                        lng: branch.location.coordinates[0]
                      }}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha */}
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderField('Tipo de negocio', branch.businessType, 
                (value) => BRANCH_TYPE_LABELS[value as keyof typeof BRANCH_TYPE_LABELS] || value)}
              {renderField('Descripción', branch.description)}
            </div>
          </div>
        </div>

        {/* INFORMACIÓN OPERACIONAL */}
        <div>
          <Divider>Información operacional</Divider>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderPaymentMethods()}
              {renderPickupDeliveryOptions()}
            </div>
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderOperatingHours()}
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DEL ENCARGADO */}
        {(!isEmpty(branch.managerName) || !isEmpty(branch.managerPhone)) && (
          <div>
            <Divider>Información del encargado</Divider>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 300px', minWidth: '0' }}>
                {renderField('Nombre del encargado', branch.managerName)}
              </div>
              <div style={{ flex: '1 1 300px', minWidth: '0' }}>
                {renderField('Teléfono celular del encargado', branch.managerPhone)}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DisplayBranchInfo;