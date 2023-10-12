/* eslint-disable prettier/prettier */
import { PetResponseDto } from '../../pets/dto/response/pet.response';
import { CreateHojaClinicaInput } from '../dto/input/create-hoja-clinica.input';
import { formatTable } from '../utils/calc/utils-calc-tableFormat';
import { MedicalHistoryResponseDto } from 'src/pets/dto/response';

//format to table
import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;

//fonts
import {
  //   MerriweatherLight,
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export async function addFieldsHojaClinica(
  dataPet: PetResponseDto,
  createHojaClinicaInput: CreateHojaClinicaInput,
  doc: any,
  lastWeightPet: number,
  age: number,
  medicalHistoryResponseDto: MedicalHistoryResponseDto,
) {
  doc.fontSize(11); // Tamaño de fuente más pequeño
  doc.moveDown();
  doc.font(MerriweatherBlack).text('DATOS DEL PACIENTE. ', {
    align: 'center',
  });
  // Añade espacio vertical entre el texto anterior y la tabla
  doc.moveDown(1);

  // Paciente
  doc.font(MerriweatherBlack).text(`Nombre del paciente: `, {
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

  // Fecha de nacimiento
  doc.font(MerriweatherBlack).text(`Fecha de nacimiento: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.birthday, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // tatuajes
  doc.font(MerriweatherBlack).text(`Tatuajes: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      dataPet.isHaveTatto
        ? 'La mascota si posee tatuajes'
        : 'La mascota no posee tatuajes',
      {
        align: 'left',
      },
    );
  doc.moveDown(0.5);

  // Edad
  doc.font(MerriweatherBlack).text(`Edad: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(`${age} Años`, {
    align: 'left',
  });
  doc.moveDown(0.5);

  // Peso
  doc.font(MerriweatherBlack).text(`Peso:`, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(` ${lastWeightPet} Kg`, {
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

  doc.font(MerriweatherBlack).text('DATOS DEL PROPIETARIO. ', {
    align: 'center',
  });

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

  // Contactos
  doc.font(MerriweatherBlack).text(`TEL. fijo: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(createHojaClinicaInput?.phoneFijo, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherBlack).text(`,  TEL. de oficina: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(createHojaClinicaInput?.phoneOffice, {
    continued: true,
    align: 'left',
  });
  // Con dirección
  doc.font(MerriweatherBlack).text(`,  TEL. celular: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.user?.phone || ' ', {
    align: 'left',
  });
  doc.moveDown(0.5);
  //Email
  doc.font(MerriweatherBlack).text(`Correo electrónico: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(dataPet.user?.email || 'No se ha proporcionado dirección de correo', {
      align: 'left',
    });

  doc.moveDown(2);

  doc.font(MerriweatherBlack).text('CONTROL PROFILÁCTICO.', {
    align: 'center',
  });

  doc.moveDown();

  // tabla inicial sobre desparacitacion
  const tableDeworming = {
    title: `DESPARASITACIONES :`,
    subtitle: `Registro de desparacitación de la mascota`,
    align: 'center',
    width: 500,
    headers: [
      `Fecha`,
      `Desparasitante`,
      'Dosis utilizada',
      'Fecha de refuerzo',
    ],
    rows: [] as Array<Array<string>>,
  };
  //asignacion dinámica
  for (let i = 0; i < createHojaClinicaInput.deworming.length; i += 4) {
    const row = [
      createHojaClinicaInput.deworming[i],
      createHojaClinicaInput.deworming[i + 1],
      createHojaClinicaInput.deworming[i + 2],
      createHojaClinicaInput.deworming[i + 3],
    ];
    tableDeworming.rows.push(row);
  }

  //enviamos la carga de codigo junto a la funcion a los formatos de tabla
  //en utils dentro de utils/calc/utils-calc-tableFormat
  const formatDeworming = formatTable(
    doc,
    tableDeworming as unknown as TableFunction,
  );
  formatDeworming;

  doc.moveDown(1);

  //añadimos otra pagina para poder agregar la tabla de vacunacion
  doc.addPage({
    size: [612, 841.89],
    margin: 50,
  });

  //segunda tabla de vacunacion
  const tableVaccines = {
    title: `VACUNACIONES :`,
    subtitle: `Registro de vacunación de la mascota`,

    headers: [`Fecha`, `Vacuna Utilizada`, `Fecha de refuerzo`],
    rows: [] as Array<Array<string>>,
  };
  //asignacion dinámica
  for (let i = 0; i < createHojaClinicaInput.vaccines.length; i += 3) {
    const row2 = [
      createHojaClinicaInput.vaccines[i],
      createHojaClinicaInput.vaccines[i + 1],
      createHojaClinicaInput.vaccines[i + 2],
    ];
    tableVaccines.rows.push(row2);
  }

  //mismo proceso mandamos la carga de codigo del formato de la tabla a Utils/Calc/utils-calc-tableFormat
  const tableVaccinesFormat = formatTable(
    doc,
    tableVaccines as unknown as TableFunction,
  );
  //renderizamos el contenido de la funcion
  tableVaccinesFormat;

  doc.moveDown(1);
  //tercera tabla de control de celos
  const tableCelos = {
    title: `CONTROL DE CELOS :`,
    subtitle: `Registro del control de celos de la mascota`,
    headers: [
      `Fecha de Inicio `,
      `Fecha Finalización`,
      `Fecha de Inicio`,
      `Fecha Finalización`,
    ],
    rows: [] as Array<Array<string>>,
  };
  //asignacion dinámica
  for (let i = 0; i < createHojaClinicaInput.celos.length; i += 4) {
    const row2 = [
      createHojaClinicaInput.celos[i],
      createHojaClinicaInput.celos[i + 1],
      createHojaClinicaInput.celos[i + 2],
      createHojaClinicaInput.celos[i + 3],
    ];
    tableCelos.rows.push(row2);
  }

  //mismo proceso mandamos la carga de codigo del formato de la tabla a Utils/Calc/utils-calc-tableFormat
  const tableCelosFormat = formatTable(
    doc,
    tableCelos as unknown as TableFunction,
  );
  //renderizamos el contenido de la funcion
  tableCelosFormat;

  doc.moveDown(2);
  doc.font(MerriweatherBlack).text('DATOS CLÍNICOS ', {
    align: 'center',
  });
  doc.moveDown(1);
  doc.font(MerriweatherBlack).text('DATOS DE LA ANAMNESIS ', {
    align: 'center',
  });

  doc.moveDown(2);
  doc
    .font(MerriweatherBlack)
    .text(
      'La mascota, dentro del contexto de la evaluación respecto a su salud denotamos que, ',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherLight)
    .text(
      medicalHistoryResponseDto?.isHaveAllVaccine
        ? 'Si posee todas sus vacunas'
        : 'No posee todas sus vacunas',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherBlack)
    .text(
      medicalHistoryResponseDto?.isHaveAllVaccine
        ? ', lo que nos permite garantizar su inmunización contra enfermedades.'
        : ', lo que nos indica que no ha recibido toda su inmunización contra enfermedades.',
      {
        align: 'left',
      },
    );
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text(
      'Además, se investigó si la mascota se reprodujo, dando como resultado que, ',
      {
        align: 'left',
        continued: true,
      },
    );
  doc
    .font(MerriweatherLight)
    .text(
      medicalHistoryResponseDto?.isReproduced
        ? 'Si se ha reproducido '
        : 'No se ha reproducido ',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherBlack)
    .text(
      'Y ademas verificando la descendendia de la mascota, lo cual se concluye que: ',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.descendants, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text('.', {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text(
      'Durante esta evaluación, prestamos especial atención en las condiciones donde recide el ejemplar, con la información brindada por el propietario se concluye que: ',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.room, {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text(
      'y evaluamos la cantidad de alimento que recibe la mascota y es de: ',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherLight)
    .text(`${medicalHistoryResponseDto.food.quantity}`, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text(' que consume, así como el tipo de alimento el cual es: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.food.type, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text(
      'que es el preferido por la mascota, para garantizar que todas sus necesidades básicas estén satisfechas y promover su salud y bienestar óptimos.',
    );

  doc.moveDown(2);
  doc.font(MerriweatherBlack).text('EXÁMEN FÍSICO  ', {
    align: 'center',
  });
  doc.moveDown(1);

  // Temperatura
  doc.font(MerriweatherBlack).text(`Temperatura Corporal:  `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  doc
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.physicalExam.temperature, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text('  Grados Celcius ( C° ) ');
  doc.moveDown(0.5);

  // frecuencia cardiaca
  doc.font(MerriweatherBlack).text(`Frecuencia Cardiaca:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.physicalExam.cardiacRate, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text('  Latidos por minuto ( lpm ).');
  doc.moveDown(0.5);

  // frecuencia respiratoria
  doc.font(MerriweatherBlack).text(`Frecuencia Respiratoria:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.physicalExam.respiratoryRate, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text('  Respiraciones por minuto ( RPM )');
  doc.moveDown(0.5);

  // pulso
  doc.font(MerriweatherBlack).text(`Pulso:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.physicalExam.pulse, {
      align: 'left',
    });
  doc.moveDown(0.5);
  // mucosa
  doc.font(MerriweatherBlack).text(`Mucosas:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.physicalExam.mucous, {
      align: 'left',
    });
  doc.moveDown(0.5);

  // convivencia
  doc.font(MerriweatherBlack).text(`Convive con otros mascotas:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      medicalHistoryResponseDto.otherPet?.isLiveOtherPets
        ? 'Si convive con otras mascotas'
        : 'No convive con otras mascotas',
      {
        align: 'left',
      },
    );
  doc.moveDown(0.5);

  doc.addPage({
    size: [612, 841.89],
    margin: 50,
  });

  doc.font(MerriweatherBlack).text('TRATAMIENTOS BRINDADOS.', {
    align: 'center',
  });

  //recorremos los tratamientos para poder renderizar su informacion de manera independiente

  const dataTreatments = [] as string[];
  medicalHistoryResponseDto.diagnostic.treatments.forEach((treatment) => {
    dataTreatments.push(treatment.name);
    dataTreatments.push(treatment.quantity.toString());
    dataTreatments.push(treatment.frequency);
    dataTreatments.push(treatment.days.toString());
  });

  doc.moveDown(1);

  doc
    .font(MerriweatherBlack)
    .text('Al paciente se le suministro el medicamento: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataTreatments[0], {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text('Con una cantidad determinada de: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataTreatments[1], {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text('Suministrada a la mascota durante: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataTreatments[2], {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text('Durante el tiempo determinado de: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataTreatments[3], {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text('  Día(s)');

  doc.moveDown(2);
  doc.font(MerriweatherBlack).text('INTERVENCIONES QUIRÚRGICAS.', {
    align: 'center',
  });

  const dataSurgicalIntervations = [] as string[];
  medicalHistoryResponseDto.diagnostic.surgicalIntervations.forEach(
    (treatment) => {
      dataSurgicalIntervations.push(treatment.name);
      dataSurgicalIntervations.push(treatment.intervationDate.toString());
      dataSurgicalIntervations.push(treatment.description);
    },
  );

  doc.moveDown(1);
  doc
    .font(MerriweatherBlack)
    .text('Tipo de intervención quirúrgica realizada: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataSurgicalIntervations[0], {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text('Día de la intervención quirúrgica realizada: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataSurgicalIntervations[1], {
      align: 'left',
    });
  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text('Descripción de la intervención realizada: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataSurgicalIntervations[2], {
      align: 'left',
    });

  doc.moveDown(2);
  doc.font(MerriweatherBlack).text('OTROS DATOS IMPORTANTES.', {
    align: 'center',
  });

  doc.moveDown(2);

  doc.font(MerriweatherLight).text(createHojaClinicaInput.moreImportsData, {
    align: 'left',
  });
}
