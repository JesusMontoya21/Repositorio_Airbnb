<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF385C, #E31C5F); padding: 40px; text-align: center; }
        .header h1 { color: white; font-size: 32px; margin: 0; }
        .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
        .body { padding: 40px; }
        .body h2 { color: #333; font-size: 24px; margin-bottom: 16px; }
        .body p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
        .button { display: inline-block; background: #FF385C; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 16px 0; }
        .features { background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .feature { display: flex; align-items: center; margin-bottom: 12px; }
        .feature span { font-size: 24px; margin-right: 12px; }
        .feature p { margin: 0; color: #444; font-size: 15px; }
        .footer { background: #f1f1f1; padding: 24px; text-align: center; }
        .footer p { color: #999; font-size: 13px; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>airbnb</h1>
            <p>Tu hogar en cualquier lugar del mundo</p>
        </div>
        <div class="body">
            <h2>¡Hola, {{ $name }}! 👋</h2>
            <p>¡Bienvenido a Airbnb! Estamos muy emocionados de tenerte con nosotros. Tu cuenta ha sido creada exitosamente.</p>
            <p>Ahora puedes:</p>
            <div class="features">
                <div class="feature">
                    <span>🏠</span>
                    <p>Explorar miles de alojamientos únicos</p>
                </div>
                <div class="feature">
                    <span>🎈</span>
                    <p>Reservar experiencias increíbles</p>
                </div>
                <div class="feature">
                    <span>🛎️</span>
                    <p>Contratar servicios profesionales</p>
                </div>
                <div class="feature">
                    <span>🌟</span>
                    <p>Convertirte en anfitrión y ganar dinero extra</p>
                </div>
            </div>
            <p>¿Listo para comenzar tu aventura?</p>
            <a href="http://localhost:5173" class="button">Explorar Airbnb</a>
        </div>
        <div class="footer">
            <p>© 2025 Airbnb Clone. Todos los derechos reservados.</p>
            <p>Este correo fue enviado porque te registraste en nuestra plataforma.</p>
        </div>
    </div>
</body>
</html>