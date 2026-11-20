const USUARIO_PERSONAL = 'bibliotecario';
const CLAVE_PERSONAL = 'ipf2026';

export function credencialesValidas(usuario: string, clave: string): boolean {
  return usuario === USUARIO_PERSONAL && clave === CLAVE_PERSONAL;
}
