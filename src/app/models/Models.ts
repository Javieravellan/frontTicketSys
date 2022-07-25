import { formatearFecha } from "../shared/formatDate";

export class Ticket {
    ticketId?: number
    personaSolicitante?: string = ''
    fechaIngreso?: Date = new Date(Date.now())
    asunto?: string = ''
    descripcion?: string = ''
    fechaFormateada: String = formatearFecha(new Date())
    historialIncidencia: HistorialIncidencia[] = []
}

export class HistorialIncidencia {
    historialAtencionId?: number;
    ticketId?: number
    usuarioSoporte?: string = '';
    fechaAtencion?: Date = new Date(Date.now());
    comentario?: string;
    fechaFormateada?: string = formatearFecha(new Date()) as string;
    ticket?: Ticket = null!;
}