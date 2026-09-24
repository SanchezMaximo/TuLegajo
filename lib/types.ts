// Tipos basados en "TuLegajo API - Manual de Uso v2.2.0"

export interface ApiSuccess<T = unknown> {
  status: "success";
  statusCode: string;
  result?: T;
}

export interface ApiErrorBody {
  status: "error";
  statusCode: string;
  error: {
    message: string;
    path: string;
    timestamp: string;
  };
}

export type EstadoEmpleado =
  | "Nuevo"
  | "Pendiente"
  | "Generado"
  | "Activo"
  | "Desvinculado";

export interface EmpleadoResumen {
  nombre: string;
  apellido: string;
  cuil: string;
  legajo: string;
  estado: EstadoEmpleado;
  sedeNombre?: string;
  usuario?: string;
  uri?: string;
}

export interface Empleado {
  cuil: string;
  nombre: string;
  apellido: string;
  sedeCodigo?: string;
  sedeNombre?: string;
  legajo: string;
  emailCorporativo?: string;
  fechaDeAlta?: string;
  fechaDeIngreso?: string;
  fechaDeIngresoLegal?: string;
  fechaDeBaja?: string;
  fechaDeDesvinculacion?: string;
  celularLaboralCodigoPais?: number;
  celularLaboral?: number;
  sexo?: "M" | "F" | "O";
  camposPersonalizados?: string;
  informacionExtra?: string;
  ultimaModificacion?: string;
  estado: EstadoEmpleado;
  usuario?: string;
}

export interface Sede {
  codigo: string;
  nombre: string;
}

export interface Etiqueta {
  nombre: string;
}

export type EstadoDocumento =
  | "Nuevo"
  | "Validado"
  | "Firmado"
  | "Enviado"
  | "No Conforme"
  | "Conforme";

export interface Documento {
  id: number;
  cuil: string;
  loteNombre?: string;
  lotePeriodo?: string;
  nombre: string;
  estado: EstadoDocumento;
  firmaEnProgreso?: boolean;
  descargaOriginalURL?: string;
  descargaDuplicadoURL?: string;
  descargaOriginalFirmadoURL?: string;
  descargaDuplicadoFirmadoURL?: string;
}

export interface TipoDocumento {
  id: number;
  nombre: string;
  descripcion?: string;
  tipoPorDefecto?: boolean;
}

export type EstadoLote =
  | "Nuevo"
  | "Cargado"
  | "Validado"
  | "Firmado"
  | "Enviado";

export interface Lote {
  id: number;
  nombre: string;
  periodo: string;
  comentario?: string;
  estado: EstadoLote;
  procesando?: boolean;
}

export type EstadoLicencia = "Pendiente" | "Cancelada" | "Aprobada" | "Rechazada";

export interface Licencia {
  id: number;
  cuil: string;
  nombre: string;
  apellido: string;
  legajo?: string;
  diasSolicitados?: string;
  fechaDeSolicitud?: string;
  fechaDeInicio?: string;
  fechaDeFin?: string;
  estadoLicencia: EstadoLicencia;
  nombreMotivo?: string;
  codigoMotivo?: string;
}

export interface MotivoLicencia {
  id: number;
  nombreMotivo: string;
  codigoMotivo?: string;
  vacaciones?: boolean;
}

export type EstadoComunicacion = "Pendiente" | "Recibida" | "Aprobada" | "Rechazada";

export interface Comunicacion {
  id: number;
  asunto: string;
  fechaDeEnvio?: string;
  empleado?: string;
  cuil?: string;
  estado: EstadoComunicacion;
  firmaEnProgreso?: boolean;
  uri?: string;
}

export interface ArchivoFisico {
  uri: string;
}

export interface ArchivoLegajo {
  nombre: string;
  fechaDeCarga?: string;
  cargadoPor?: string;
  empleado?: string;
  cuil: string;
  comentarios?: string;
  estado?: string;
  archivos?: ArchivoFisico[];
}

export interface Responsable {
  nombre: string;
  apellido: string;
  cuil: string;
  descripcion?: string;
  correoElectronico?: string;
  rol: string;
  sobreEtiquetas?: string;
}
