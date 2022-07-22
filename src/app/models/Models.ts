export class Ticket {
    ticketId?: number;
    personaSolicitante?: string;
    fechaIngreso?: Date;
    asunto?: string;
    descripcion?: string;
}

export class HistorialIncidencia {
    historialAtencionId?: number;
    usuarioSoporte?: string;
    fechaAtencion?: Date;
    comentario?: string;
}