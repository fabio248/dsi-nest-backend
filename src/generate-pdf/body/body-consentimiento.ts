/* eslint-disable prettier/prettier */
import { PetResponseDto } from '../../pets/dto/response/pet.response';
import { CreateConsentimientoInput } from '../dto/input/create-consentimiento.input';

//fonts
import {
  //   MerriweatherLight,
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export function addFieldsConsentimiento(
  dataPet: PetResponseDto,
  createConsentimientoInput: CreateConsentimientoInput,
  doc: any,
  age: number,
) {
  doc.fontSize(11); // Tamaño de fuente más pequeño
  doc.moveDown();
  doc
    .font(MerriweatherBlack)
    .text('CONSENTIMIENTO INFORMADO DE ANESTESIA Y CIRUGIA  ', {
      align: 'center',
    });
  // Añade espacio vertical entre el texto anterior y la tabla
  doc.moveDown(2);

  doc.text('                 ', {
    continued: true,
    aling: 'left',
  });
  //DOCUMENTO DUI
  doc.font(MerriweatherBlack).text('N° DUI:', {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(`${dataPet.user.dui}`, {
    continued: true,
    align: 'left',
  });
  doc.text('                           |                      ', {
    continued: true,
    aling: 'left',
  });
  //Telefono
  doc.font(MerriweatherBlack).text('TEL: ', {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(`${dataPet.user.phone}`);

  doc.moveDown(1);

  //Propietario
  doc.font(MerriweatherBlack).text('Propietario: ', {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(`${dataPet.user.firstName} ${dataPet.user.lastName}`);

  //Representante legal
  doc.moveDown(1);
  doc.font(MerriweatherBlack).text('Representante legal: ', {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(`${createConsentimientoInput.responsibleLegal}`);
  doc.moveDown(2);

  doc
    .font(MerriweatherBlack)
    .text('Doy mi consentimiento para que mi mascota: ');
  doc.moveDown(1);
  // Nombre de la mascota
  doc.font(MerriweatherBlack).text(`Nombre: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  doc.font(MerriweatherLight).text(dataPet.name, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Especie
  doc.font(MerriweatherBlack).text(`Especie: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.specie.name, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Raza
  doc.font(MerriweatherBlack).text(`Raza: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.raza, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Sexo
  doc.font(MerriweatherBlack).text(`Sexo: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.gender, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Edad
  doc.font(MerriweatherBlack).text(`Edad: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(`${age}  Años`, {
    align: 'left',
  });

  doc.moveDown(1);

  doc.font(MerriweatherBlack).text(`Sea intervenido: `, {
    continued: true,
    align: 'left',
  });

  doc.font(MerriweatherLight).text(`${createConsentimientoInput.intervention}`);
  doc
    .font(MerriweatherBlack)
    .moveDown(0.2)
    .text(
      'bajo anestesia en las condiciones, que me han sido propuestas, ' +
        'sobre riegos y beneficios de esta intervención. También he realizado las preguntas' +
        'oportunas en su debido momento por lo que, entendido, Liberando de cualquier responsabilidad' +
        'a los médicos de esta veterinaria en caso de muerte del paciente, por causas orgánicas, propias ' +
        'de este, además de lesiones o infecciones, producto de un inadecuado postoperatorio que se convierte' +
        'en mi responsabilidad desde el momento en que se devuelve el paciente.',
    );
  doc.moveDown(2);
  doc
    .font(MerriweatherBlack)
    .moveDown(0.2)
    .text(
      'Acepto las modificaciones de los métodos que se puedan producir en el transcurso ' +
        'de dichos procedimientos y que se justifiquen por una mejora de la calidad del mismo' +
        'y en beneficio del paciente y me comprometo a cancelar los honorarios profesionales' +
        'generados por el procedimiento a realizar ',
    );
}
