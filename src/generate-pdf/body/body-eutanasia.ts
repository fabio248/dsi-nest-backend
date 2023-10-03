/* eslint-disable prettier/prettier */
import { PetResponseDto } from '../../pets/dto/response/pet.response';
import { CreateEutanasiaInput } from '../dto/input/create-eutanasia.input';

//fonts
import {
  //   MerriweatherLight,
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export function addFieldsEutanasia(
  dataPet: PetResponseDto,
  createEutanasiaInput: CreateEutanasiaInput,
  doc: any,
) {
  doc.fontSize(11); // Tamaño de fuente más pequeño
  doc.moveDown();
  doc.font(MerriweatherBlack).text('AUTORIZACION PARA EUTANASIA ', {
    align: 'center',
  });
  // Añade espacio vertical entre el texto anterior y la tabla
  doc.moveDown(1);

  // Paciente
  doc.font(MerriweatherBlack).text(`Paciente: `, {
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
  doc.font(MerriweatherLight).text(dataPet.birthday, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Peso
  doc.font(MerriweatherBlack).text(`Peso: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(dataPet.medicalHistory.physicalExam.weight + ' Kg', {
      align: 'left',
    });
  doc.moveDown(0.5);

  // Color
  doc.font(MerriweatherBlack).text(`Color: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.color, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Añade espacio vertical entre los campos anteriores y el siguiente bloque
  doc.moveDown(1);

  // Propiedad de Sr. (Sra.)
  doc.font(MerriweatherBlack).text(`Propiedad de Sr. (Sra.): `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(`${dataPet.user.firstName} ${dataPet.user.lastName}`, {
      align: 'left',
    });
  doc.moveDown(0.5);

  // DUI
  doc.font(MerriweatherBlack).text(`DUI: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(dataPet.user?.dui || 'No se ha proporcionado ningún DUI', {
      align: 'left',
    });
  doc.moveDown(0.5);

  // Con dirección
  doc.font(MerriweatherBlack).text(`Con dirección: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      dataPet.user?.direction ||
        'No se ha proporcionado dirección del propietario',
      {
        align: 'left',
      },
    );

  // Añade espacio vertical después del último campo
  doc.moveDown(1);

  // El Propietario o responsable del Animal arriba individualizado
  doc
    .font(MerriweatherBlack)
    .text(`El Propietario o responsable del Animal arriba individualizado: `, {
      continued: true,
      align: 'left',
    });

  doc.font(MerriweatherLight).text(createEutanasiaInput.responsible);
  // Añade espacio vertical entre el último campo y la tabla
  doc.moveDown();
  doc
    .font(MerriweatherBlack)
    .moveDown(0.2)
    .text(
      'Autoriza suficientemente al Cuerpo Médico de la Clínica Veterinaria Mistun a realizar el procedimiento de EUTANASIA (Sacrificio del Animal), por presentar un cuadro patológico de pronóstico desfavorable u otra circunstancia ética que amerite este procedimiento.  ',
    );
  doc.moveDown();
  doc
    .font(MerriweatherBlack)
    .moveDown(0.2)
    .text(
      'Exonera de toda responsabilidad ética, civil, comercial y criminal a la Clínica Veterinaria, así como a su Personal Médico por la realización del procedimiento arriba mencionado',
    );
  doc.moveDown();
  doc
    .font(MerriweatherBlack)
    .moveDown(0.2)
    .text(
      'Se compromete a cancelar los honorarios profesionales generados por el procedimiento de eutanasia. ',
    );
  doc.moveDown();
  doc
    .font(MerriweatherBlack)
    .moveDown(0.2)
    .text(
      'El Médico Responsable se compromete a realizar el procedimiento de eutanasia de manera humana y responsable. ',
    );
  // Aquí puedes continuar con la tabla u otro contenido según sea necesario
}
