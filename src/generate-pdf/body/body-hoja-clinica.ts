/* eslint-disable prettier/prettier */
import { PetResponseDto } from '../../pets/dto/response/pet.response';
import { CreateClinicalSheetInput } from '../dto/input/create-clinical-sheet.input';
import { formatTable } from '../utils/calc/calc-table-format.utils';
import { MedicalHistoryResponseDto } from 'src/pets/dto/response';

import { CreateVaccineHojaClinicaPetInput } from '../dto/input/create-vaccine-clinical-sheet.input';
import { CreateDewormingClinicalSheetInput } from '../dto/input/create-deworming.input';
import { CreateHeatClinicalSheetInput } from '../dto/input/create-heat.input';
//format to table
import { PDFDocument } from 'pdf-lib';
type TableFunction = (doc: PDFDocument) => void;

//fonts
import {
  MerriweatherBlack,
  MerriweatherLight,
} from '../utils/fonts/fonts.style';

export function addFieldsHojaClinica(
  dataPet: PetResponseDto,
  createHojaClinicaInput: CreateClinicalSheetInput,
  doc: any,
  lastWeightPet: number,
  age: number,
  medicalHistoryResponseDto: MedicalHistoryResponseDto,
) {
  const minHeightNeededForNextContent = 100;
  doc.fontSize(12); // Tamaño de fuente más pequeño
  doc.moveDown(2);
  doc.font(MerriweatherBlack).text('DATOS DEL PACIENTE ', {
    align: 'center',
  });
  function addPageIfNecessary() {
    if (doc.y + minHeightNeededForNextContent > doc.page.height) {
      doc.addPage({ size: [612, 841.89], margin: 50 });
    }
  }
  // Añade espacio vertical entre el texto anterior y la tabla
  doc.moveDown(2);

  // Paciente
  doc.font(MerriweatherBlack).text(`Nombre del paciente: `, {
    continued: true, // Continúa en la misma línea
    align: 'left',
  });

  doc.font(MerriweatherLight).text(dataPet.name, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Especie
  doc.font(MerriweatherBlack).text(`Especie: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.specie.name, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Raza
  doc.font(MerriweatherBlack).text(`Raza: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.raza, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Sexo
  doc.font(MerriweatherBlack).text(`Sexo: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.gender, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Fecha de nacimiento
  doc.font(MerriweatherBlack).text(`Fecha de nacimiento: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.birthday, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Edad
  doc.font(MerriweatherBlack).text(`Edad: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(`${age} Años`, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Peso
  doc.font(MerriweatherBlack).text(`Peso:`, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(` ${lastWeightPet} Kg`, {
    align: 'left',
  });
  doc.moveDown(0.7);

  // Color
  doc.font(MerriweatherBlack).text(`Color: `, {
    continued: true,
    align: 'left',
  });
  doc.font(MerriweatherLight).text(dataPet.color, {
    align: 'left',
  });
  doc.moveDown(0.7);
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
  doc.moveDown(0.7);

  // Añade espacio vertical entre los campos anteriores y el siguiente bloque
  doc.moveDown(2);

  doc.font(MerriweatherBlack).text('DATOS DEL PROPIETARIO ', {
    align: 'center',
  });

  doc.moveDown(2);
  // Propiedad de Sr. (Sra.)
  doc.font(MerriweatherBlack).text(`Nombre del propietario: `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(`${dataPet.user.firstName} ${dataPet.user.lastName}`, {
      align: 'left',
    });
  doc.moveDown(0.7);

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
  doc.moveDown(0.7);

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
  doc.moveDown(0.7);
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

  doc.moveDown(0.7);
  doc
    .font(MerriweatherBlack)
    .text(`Dirección del propietario: `, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(dataPet.user.direction, { align: 'left' });

  doc.moveDown(2);

  doc.addPage({ size: [612, 841.89], margin: 50 });
  doc.font(MerriweatherBlack).text('CONTROL PROFILÁCTICO', {
    align: 'center',
  });

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
    rows: [] as CreateDewormingClinicalSheetInput[],
  };
  //asignacion dinámica
  if (
    createHojaClinicaInput.deworming &&
    createHojaClinicaInput.deworming.length > 0
  ) {
    for (let i = 0; i < createHojaClinicaInput.deworming.length; i++) {
      const row = [
        createHojaClinicaInput.deworming[i].dayAplicationInitDeworming || '--',
        createHojaClinicaInput.deworming[i].dewormingName || '--',
        createHojaClinicaInput.deworming[i].dose || '--',
        createHojaClinicaInput.deworming[i].dayAplicationFinalDeworming || '--',
      ];
      tableDeworming.rows.push(
        row as unknown as CreateDewormingClinicalSheetInput,
      );
    }
  } else {
    const emptyRow = ['--', '--', '--', '--'];
    tableDeworming.rows.push(
      emptyRow as unknown as CreateDewormingClinicalSheetInput,
    );
  }

  //enviamos la carga de codigo junto a la funcion a los formatos de tabla
  //en utils dentro de utils/calc/utils-calc-tableFormat
  const formatDeworming = formatTable(
    doc,
    tableDeworming as unknown as TableFunction,
  );
  formatDeworming;

  doc.moveDown(2);

  //segunda tabla de vacunacion
  const tableVaccines = {
    title: `VACUNACIONES :`,
    subtitle: `Registro de vacunación de la mascota`,

    headers: [`Fecha`, `Vacuna Utilizada`, `Fecha de refuerzo`],
    rows: [] as CreateVaccineHojaClinicaPetInput[],
  };
  //asignacion dinámica
  for (let i = 0; i < createHojaClinicaInput.vaccines.length; i++) {
    const dayAplicationInit =
      createHojaClinicaInput.vaccines[i].dayAplicationInit;
    const vaccineName = createHojaClinicaInput.vaccines[i].vaccineName;
    const dayAplicationfinal =
      createHojaClinicaInput.vaccines[i].dayAplicationfinal;

    const row2 = [
      dayAplicationInit !== null && dayAplicationInit !== undefined
        ? `${dayAplicationInit}`
        : '--',
      vaccineName !== null && vaccineName !== undefined
        ? `${vaccineName}`
        : '--',
      dayAplicationfinal !== null && dayAplicationfinal !== undefined
        ? `${dayAplicationfinal}`
        : '--',
    ];

    tableVaccines.rows.push(
      row2 as unknown as CreateVaccineHojaClinicaPetInput,
    );
  }
  if (createHojaClinicaInput.vaccines.length === 0) {
    const emptyRow = ['--', '--', '--'];
    tableVaccines.rows.push(
      emptyRow as unknown as CreateVaccineHojaClinicaPetInput,
    );
  }

  //mismo proceso mandamos la carga de codigo del formato de la tabla a Utils/Calc/utils-calc-tableFormat
  const tableVaccinesFormat = formatTable(
    doc,
    tableVaccines as unknown as TableFunction,
  );
  //renderizamos el contenido de la funcion
  tableVaccinesFormat;

  doc.moveDown(1);
  const tableCelos = {
    title: `CONTROL DE CELOS :`,
    subtitle: `Registro del control de celos de la mascota`,
    headers: [`Fecha de Inicio `, `Fecha Finalización`],
    rows: [] as CreateHeatClinicalSheetInput[],
  };
  if (createHojaClinicaInput.celos) {
    for (let i = 0; i < createHojaClinicaInput.celos.length; i++) {
      const dayAplicationInitCelos =
        createHojaClinicaInput.celos[i].dayAplicationInitCelos;
      const dayAplicationFinalCelos =
        createHojaClinicaInput.celos[i].dayAplicationFinalCelos;

      const row2 = [
        dayAplicationInitCelos !== null && dayAplicationInitCelos !== undefined
          ? `${dayAplicationInitCelos}`
          : '--',
        dayAplicationFinalCelos !== null &&
        dayAplicationFinalCelos !== undefined
          ? `${dayAplicationFinalCelos}`
          : '--',
      ];

      tableCelos.rows.push(row2 as unknown as CreateHeatClinicalSheetInput);
    }
  }

  if (
    !createHojaClinicaInput.celos ||
    createHojaClinicaInput.celos.length === 0
  ) {
    const emptyRow = ['--', '--'];
    tableCelos.rows.push(emptyRow as unknown as CreateHeatClinicalSheetInput);
  }

  //mismo proceso mandamos la carga de codigo del formato de la tabla a Utils/Calc/utils-calc-tableFormat
  const tableCelosFormat = formatTable(
    doc,
    tableCelos as unknown as TableFunction,
  );
  //renderizamos el contenido de la funcion
  tableCelosFormat;

  addPageIfNecessary();
  doc.moveDown(2);
  doc.addPage({ size: [612, 841.89], margin: 50 });
  doc.fontSize(12);
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
      'La mascota, dentro del contexto de la evaluación respecto a su salud se denota que, ',
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
      'Además, se investigó acerca de la reproducción de la mascota, dando como resultado que, ',
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
      'Y verificando sobre la descendencia de la mascota, lo cual se concluye que: ',
      {
        continued: true,
        align: 'left',
      },
    );
  doc
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
      'Durante esta evaluación, se prestó especial atención a las condiciones donde reside el ejemplar, con la información brindada por el propietario se concluye que: ',
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
    .text('Evaluando  la cantidad de alimento de: ', {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherLight)
    .text(`${medicalHistoryResponseDto.food.quantity}`, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text(
      ' que consume la mascota diariamente, así como el tipo de alimento el cual prefiere la mascota es: ',
      {
        continued: true,
        align: 'left',
      },
    )
    .font(MerriweatherLight)
    .text(medicalHistoryResponseDto.food.type, {
      continued: true,
      align: 'left',
    })
    .font(MerriweatherBlack)
    .text(
      ', para garantizar que todas sus necesidades básicas estén satisfechas y promover su salud y bienestar óptimos.',
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
    .text(
      medicalHistoryResponseDto.physicalExam.temperature +
        '  Grados Celsius ( C° )',
      {
        align: 'left',
      },
    );

  doc.moveDown(0.5);

  // frecuencia cardiaca
  doc.font(MerriweatherBlack).text(`Frecuencia Cardiaca:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      medicalHistoryResponseDto.physicalExam.cardiacRate +
        '  Latidos por minuto ( LPM ).',
      {
        align: 'left',
      },
    );
  doc.moveDown(0.5);

  // frecuencia respiratoria
  doc.font(MerriweatherBlack).text(`Frecuencia Respiratoria:  `, {
    continued: true,
    align: 'left',
  });
  doc
    .font(MerriweatherLight)
    .text(
      medicalHistoryResponseDto.physicalExam.respiratoryRate +
        '  Respiraciones por minuto ( RPM ).',
      {
        align: 'left',
      },
    );

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

  doc.addPage({
    size: [612, 841.89],
    margin: 50,
    separation: true,
  });

  doc.font(MerriweatherBlack).text('TRATAMIENTOS BRINDADOS', {
    align: 'center',
  });
  const treatmentsTable = {
    title: 'Tratamientos:',
    headers: ['Medicamento', 'Cantidad', 'Frecuencia', 'Duración (días)'],
    rows: [] as string[],
  };
  if (medicalHistoryResponseDto.diagnostic.treatments) {
    for (
      let i = 0;
      i < medicalHistoryResponseDto.diagnostic.treatments.length;
      i++
    ) {
      const treatment = medicalHistoryResponseDto.diagnostic.treatments[i];
      const name = treatment.name ? treatment.name : '--';
      const quantity = treatment.quantity
        ? treatment.quantity.toString()
        : '--';
      const frequency = treatment.frequency
        ? treatment.frequency.toString()
        : '--';
      const days = treatment.days
        ? treatment.days.toString() + ' Día(s)'
        : '--';

      const row = [name, quantity, frequency, days];
      treatmentsTable.rows.push(row as unknown as string);
    }
  }
  if (
    !medicalHistoryResponseDto.diagnostic.treatments ||
    medicalHistoryResponseDto.diagnostic.treatments.length === 0
  ) {
    const emptyRow = ['--', '--', '--', '--'];
    treatmentsTable.rows.push(emptyRow as unknown as string);
  }

  const treatmentsTableFormat = formatTable(
    doc,
    treatmentsTable as unknown as TableFunction,
  );
  treatmentsTableFormat;

  doc.moveDown(1);

  doc.font(MerriweatherBlack).text('INTERVENCIONES QUIRÚRGICAS', {
    align: 'center',
  });

  const surgicalInterventionsTable = {
    title: 'Intervenciones:',
    headers: ['Tipo de Intervención', 'Fecha', 'Descripción'],
    rows: [] as string[],
  };

  if (medicalHistoryResponseDto.diagnostic.surgicalIntervations) {
    for (
      let i = 0;
      i < medicalHistoryResponseDto.diagnostic.surgicalIntervations.length;
      i++
    ) {
      const surgicalIntervation =
        medicalHistoryResponseDto.diagnostic.surgicalIntervations[i];
      const name = surgicalIntervation.name ? surgicalIntervation.name : '--';
      const intervationDate = surgicalIntervation.intervationDate
        ? surgicalIntervation.intervationDate.toString()
        : '--';
      const description = surgicalIntervation.description
        ? surgicalIntervation.description
        : '--';

      const row = [name, intervationDate, description];
      surgicalInterventionsTable.rows.push(row as unknown as string);
    }
  }

  if (
    !medicalHistoryResponseDto.diagnostic.surgicalIntervations ||
    medicalHistoryResponseDto.diagnostic.surgicalIntervations.length === 0
  ) {
    const emptyRow = ['--', '--', '--'];
    surgicalInterventionsTable.rows.push(emptyRow as unknown as string);
  }

  const surgicalInterventionsTableFormat = formatTable(
    doc,
    surgicalInterventionsTable as unknown as TableFunction,
  );
  surgicalInterventionsTableFormat;

  doc.moveDown(2);
  doc.font(MerriweatherBlack).text('OTROS DATOS IMPORTANTES', {
    align: 'center',
  });

  doc.moveDown(1);

  doc.font(MerriweatherLight).text(createHojaClinicaInput.moreImportsData, {
    align: 'left',
  });
}
