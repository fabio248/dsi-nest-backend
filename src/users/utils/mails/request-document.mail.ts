import Handlebars from 'handlebars';
import { DocumentName } from '../../dto/enum/document-name';

type DocumentNameType = typeof DocumentName[keyof typeof DocumentName];

export function getRequestDocumentMail(
  firstName: string,
  lastName: string,
  emailClient: string,
  documentName: DocumentNameType,
  petName: string,
  dashboardLink = 'https://www.example.com/login',
) {
  const template = `
  <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Solicitud de Documento</title>
            <style>
                /* Reset CSS */
                body, p, h1 {
                margin: 0;
                padding: 0;
                }
                
                /* Estilos del contenedor */
                .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                color: #444444;
                }
                
                /* Estilos del encabezado */
                h1 {
                font-size: 24px;
                margin-bottom: 20px;
                text-align: center;
                }
                
                /* Estilos del texto */
                p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
                }
                
                /* Estilos del botón */
                .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Solicitud de Documento</h1>
                <p>Hola,</p>
                <p>{{username}} ha solicitado el documento: <strong>{{documentName}}</strong>. 
                  <br>Para su mascota <strong>{{petName}}</strong>
              </p>
                <p>Por favor, proporcione el documento solicitado lo antes posible. </p>
                <p> Inicie sesión para crear una cita para la evaluación de la mascota, el email del cliente es: <strong>{{emailClient}}</strong></p>
                <p><a class="button" href="{{dashboardLink}}" style="color: #ffffff;">Inicio sesión</a></p>
                <p>Si tiene alguna pregunta o necesita información adicional, no dude en ponerse en contacto con nosotros.</p>
            </div>
        </body>
    </html>
`;
  const username = `${firstName} ${lastName}`;
  const compiledTemplate = Handlebars.compile(template);
  const renderedEmail = compiledTemplate({
    documentName,
    username,
    petName,
    emailClient,
    dashboardLink,
  });

  return renderedEmail;
}
