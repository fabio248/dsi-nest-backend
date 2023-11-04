export function calcAgePet(birthday: string): number {
  const slippletDate = birthday.split('/');

  const day = parseInt(slippletDate[0]);
  const month = parseInt(slippletDate[1]) - 1;
  const year = parseInt(slippletDate[2]);

  // Crear una fecha de nacimiento a partir de las partes
  const fechaNacimiento = new Date(year, month, day);

  // Obtener la fecha actual
  const hoy = new Date();

  // Calcular la age
  const age = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const currentMonth = hoy.getMonth();
  const bithdayMonth = fechaNacimiento.getMonth();
  if (
    currentMonth < bithdayMonth ||
    (currentMonth === bithdayMonth && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    return age - 1;
  } else {
    return age;
  }
}
