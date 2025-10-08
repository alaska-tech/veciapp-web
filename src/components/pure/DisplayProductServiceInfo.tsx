import React from 'react';
import { Card, Divider, Typography, Tag } from 'antd';
import { ProductService, weekDay, WEEKDAY_LABEL } from '@/constants/models';

const { Text, Title } = Typography;

interface DisplayProductServiceInfoProps {
  productService: ProductService;
}

const DisplayProductServiceInfo: React.FC<DisplayProductServiceInfoProps> = ({ productService }) => {
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
  const renderAvailableHours = () => {
    if (!productService.serviceScheduling?.availableHours || 
        Object.keys(productService.serviceScheduling.availableHours).length === 0) return null;

    return (
      <>
        <Title level={5} style={{ marginTop: '16px', marginBottom: '8px' }}>Horarios disponibles</Title>
        {weekDay.map(day => {
          const hours = productService.serviceScheduling?.availableHours?.[day];
          if (!hours || !hours.isOpen) return null;
          
          return (
            <div key={day} style={{ marginBottom: '8px' }}>
              <Text strong>{WEEKDAY_LABEL[day]}: </Text>
              <Text>{`${hours.open} - ${hours.close}`}</Text>
            </div>
          );
        })}
      </>
    );
  };

  // Función para renderizar el estado del producto/servicio
  const renderState = () => {
    if (isEmpty(productService.state)) return null;
    
    let color = 'green';
    if (productService.state === 'unavailable') color = 'orange';
    if (productService.state === 'out_of_stock') color = 'red';
    
    return (
      <div style={{ marginBottom: '16px' }}>
        <Text strong>Estado: </Text>
        <Tag color={color}>
          {productService.state === 'available' ? 'Disponible' : 
           productService.state === 'unavailable' ? 'No disponible' : 
           'Sin existencias'}
        </Tag>
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
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderField('Nombre', productService.name)}
              {renderField('Categoría', productService.categoryId)}
              {renderField('Tipo', productService.type === 'product' ? 'Producto' : 'Servicio')}
              {renderState()}
            </div>
            
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderField('Descripción', productService.description)}
              {renderField('Descripción corta', productService.shortDescription)}
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DE PRECIO E INVENTARIO */}
        <div>
          <Divider>Precio e inventario</Divider>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderField('Precio', productService.price, 
                (value) => `${value} ${productService.currency || ''}`)}
              {renderField('Moneda', productService.currency)}
            </div>
            
            <div style={{ flex: '1 1 300px', minWidth: '0' }}>
              {renderField('Inventario disponible', productService.inventory)}
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DE SERVICIO (solo si es un servicio) */}
        {productService.type === 'service' && !isEmpty(productService.serviceScheduling) && (
          <div>
            <Divider>Información del servicio</Divider>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 300px', minWidth: '0' }}>
                {renderField('Requiere profesional', 
                  productService.serviceScheduling?.professionalRequired ? 'Sí' : 'No')}
                {renderField('Límite de atención por turno', 
                  productService.serviceScheduling?.attentionLimitPerSlot)}
              </div>
              
              <div style={{ flex: '1 1 300px', minWidth: '0' }}>
                {renderAvailableHours()}
              </div>
            </div>
          </div>
        )}

        {/* INFORMACIÓN DE IMÁGENES */}
        {(!isEmpty(productService.mainImage) || !isEmpty(productService.images)) && (
          <div>
            <Divider>Imágenes</Divider>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 300px', minWidth: '0' }}>
                {renderField('Imagen principal', productService.mainImage)}
              </div>
              
              <div style={{ flex: '1 1 300px', minWidth: '0' }}>
                {!isEmpty(productService.images) && (
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Imágenes adicionales: </Text>
                    <Text>{productService.images.length}</Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DisplayProductServiceInfo;