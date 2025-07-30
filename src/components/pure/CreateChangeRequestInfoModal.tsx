import { App, ModalFuncProps, ModalProps, Typography } from "antd";
import React, { useState, useRef } from "react";

const CreateChangeRequestInfoModal = (props: {
  modalProps?: ModalFuncProps;
}): [() => void, () => void] => {
  const { modal } = App.useApp();
  let ref: any = useRef(null);
  function showModal() {
    ref = modal.confirm({
      title: "Solicitar cambio de información",
      content: (
        <Typography.Paragraph>
          <br />
          Al aceptar, se enviará una solicitud de cambio de información a la
          administración de la plataforma Veciapp, por lo que no se verán
          reflejados aqui inmediatamente.
          <br />
          Podrás hacer seguimiento de la solicitud en la sección de{" "}
          <b>Solicitudes de cambio</b> en el panel lateral izquierdo.
          <br />
          ¿Estás seguro de querer cambiar la información?
        </Typography.Paragraph>
      ),
      ...props.modalProps,
    });
  }
  function closeModal() {
    ref.destroy();
  }
  return [showModal, closeModal];
};

export default CreateChangeRequestInfoModal;
