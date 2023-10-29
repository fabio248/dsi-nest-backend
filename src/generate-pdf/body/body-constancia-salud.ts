/* eslint-disable prettier/prettier */
import { PetResponseDto } from '../../pets/dto/response/pet.response';
import { CreateHealthCertificateInput } from '../dto/input/create-health-certificate.input';

//formato para la tabla
import { formatTable } from '../utils/calc/calc-table-format.utils';
import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;

//fonts
import {
  MerriweatherLight,
  MerriweatherBlack,
} from '../utils/fonts/fonts.style';
import { CreateVaccinePetInput } from '../dto/input/create-vaccines.input';

export function addFieldsConstanciaSalud(
  dataPet: PetResponseDto,
  createDocumentInput: CreateHealthCertificateInput,
  doc: any,
  LastWeightPet: number,
  age: number,
) {
  const responsible =
    createDocumentInput?.responsible ??
    `${dataPet.user.firstName} ${dataPet.user.lastName}`;

  doc.fontSize(11); // Tamaño de fuente más pequeño

  const fieldGroups = [
    `Nombre: ${dataPet.name}    |    Especie: ${dataPet.specie.name}    |    Raza: ${dataPet.raza}`,
    `Sexo: ${dataPet.gender}    |    Edad: ${age} Años    |    Peso: ${LastWeightPet} Kg`,
    `Identificación del microchip: ${
      createDocumentInput?.microChip
        ? `${createDocumentInput.microChip}`
        : 'No posee MicroChip'
    }`,
  ];

  fieldGroups.forEach((group) => {
    doc.text(group, {
      align: 'left',
    });
    doc.moveDown(); // Salto de línea entre grupos
  });
  doc.moveDown(1);

  // -- pruebas de estilos

  doc.font(MerriweatherBlack).text(`Propiedad de Sr. (Sra.): `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  // Obtén el texto después de " : "
  const textAfterColon = `${dataPet.user.firstName} ${dataPet.user.lastName}`;

  // Cambia la fuente para el texto después de " : "
  doc.font(MerriweatherLight).text(textAfterColon, {
    align: 'left',
  });

  // DUI
  doc.font(MerriweatherBlack).text(`DUI: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  // Texto después de "DUI:"
  const duiText = `${dataPet.user?.dui || 'No se ha proporcionado ningun DUI'}`;

  // Cambia la fuente para el texto después de "DUI:"
  doc.font(MerriweatherLight).text(duiText, {
    align: 'left',
  });
  // doc.moveDown();

  // Dirección
  doc.font(MerriweatherBlack).text(`Con dirección: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  // Texto después de "Con dirección:"
  const directionText = `${
    dataPet.user?.direction ||
    'No se ha proporcionado direccion del propietario'
  }`;

  // Cambia la fuente para el texto después de "Con dirección:"
  doc.font(MerriweatherLight).text(directionText, {
    align: 'left',
  });
  doc.moveDown(1);

  // Encargado responsable, dirección de destino y código postal
  doc.font(MerriweatherBlack).text(`Viajará con el encargado responsable: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  // Texto después de "Viajará con el encargado responsable:"
  const responsibleText = `${responsible} (Propietario),`;

  // Cambia la fuente para el texto después de "Viajará con el encargado responsable:"
  doc.font(MerriweatherLight).text(responsibleText, {
    continue: true,
    align: 'left',
  });

  doc.font(MerriweatherBlack).text(`Con dirección de destino: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  const direction = `${createDocumentInput.destinationAdress}`;

  doc.font(MerriweatherLight).text(direction + ',', {
    continue: true,
    align: 'left',
  });
  doc.font(MerriweatherBlack).text(`y  Zip código postal: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  const codePostal = ` ${createDocumentInput.codePostal}.`;

  doc.font(MerriweatherLight).text(codePostal, {
    align: 'left',
  });

  // Elimina el espacio vertical innecesario antes de la tabla
  doc.moveDown(2);

  // Alinea "Dicho ejemplar se encuentra en buen estado..."
  doc
    .font(MerriweatherBlack)
    .text(
      `Dicho ejemplar se encuentra en buen estado de salud, libre de enfermedades infectocontagiosas/parasitosis; tiene su esquema de vacunación completo, por lo cual es apto para vivir en comunidad`,
      {
        align: `left`,
      },
    );

  const tableVaccines = {
    title: `VACUNAS:`,
    subtitle: `Registro de Vacunación de la mascota`,
    subtitleFontSize: 50,
    headers: [`Fecha de aplicación`, `Vacuna`, 'Marca y lote'],
    rows: [] as CreateVaccinePetInput[],
    widths: [150, 300],
    layout: 'lightHorizontalLines',
    fontSize: 52, // Aumentamos el tamaño de fuente a 16 aquí
    rowHeight: 40, // Ajusta la altura de la fila si es necesario
    font: MerriweatherLight, // Ruta a la fuente que deseas usar
  };

  //asignacion dinámica
  for (let i = 0; i < createDocumentInput.vaccines.length; i++) {
    const row = [
      createDocumentInput.vaccines[i].dayAplication,
      createDocumentInput.vaccines[i].vaccineName,
      createDocumentInput.vaccines[i].BrandAndLot,
    ];
    console.log(createDocumentInput.vaccines[i + 1]);

    tableVaccines.rows.push(row as unknown as CreateVaccinePetInput);
  }

  const tableConstanciaSaludFormat = formatTable(
    doc,
    tableVaccines as unknown as TableFunction,
  );

  tableConstanciaSaludFormat;

  // Añade espacio vertical entre el texto anterior y la tabla
  doc.moveDown(2);
}
