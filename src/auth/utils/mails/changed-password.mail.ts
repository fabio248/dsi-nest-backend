import Handlebars from 'handlebars';

export function getChangedPasswordMail(firstName: string, lastName: string) {
  const template = `
  <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Cambio de Contraseña Exitoso</title>
            <style>
                /* Reset CSS */
                body, p, h1 {
                margin: 0;
                padding: 0;
                }
                
                /* Container styles */
                .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                font-family: Arial, sans-serif;
                color: #444444;
                }
                
                /* Heading styles */
                h1 {
                font-size: 24px;
                margin-bottom: 20px;
                text-align: center;
                }
                
                /* Text styles */
                p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
                }
                
                /* Button styles */
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
            <h1>Cambio de Contraseña Exitoso</h1>
            <p>Hola <strong>{{name}}</strong>,</p>
            <p>Tu contraseña ha sido cambiada exitosamente.</p>
            <p>Si no realizaste este cambio, te recomendamos contactar a nuestro equipo de soporte de inmediato.</p>
            <div class="footer">
            <p>Atentamente,</p>
            <p>El equipo de Veterinaria Mitsum</p>
            </div>
        </div>
    </body>
    </html>
`;

  const name = `${firstName} ${lastName}`;
  const compiledTemplate = Handlebars.compile(template);
  const renderedEmail = compiledTemplate({ name });

  return renderedEmail;
}
