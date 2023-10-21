export function CalcAgePet(birthday: string): number {
  const partesFecha = birthday.split('/');

  const dia = parseInt(partesFecha[0]);
  const mes = parseInt(partesFecha[1]) - 1;
  const año = parseInt(partesFecha[2]);

  // Crear una fecha de nacimiento a partir de las partes
  const fechaNacimiento = new Date(año, mes, dia);

  // Obtener la fecha actual
  const hoy = new Date();

  // Calcular la edad
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNac = fechaNacimiento.getMonth();
  if (
    mesActual < mesNac ||
    (mesActual === mesNac && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    return edad - 1;
  } else {
    return edad;
  }
}
