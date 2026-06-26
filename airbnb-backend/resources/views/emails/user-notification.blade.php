<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; }
        .container { max-width: 620px; margin: 32px auto; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #FF385C, #E31C5F); padding: 28px 32px; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .body { padding: 28px 32px; }
        .body h2 { color: #222; font-size: 21px; margin: 0 0 10px; }
        .body p { color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 12px; }
        .cta { display: inline-block; margin-top: 10px; background: #FF385C; color: #fff; text-decoration: none; border-radius: 10px; padding: 12px 18px; font-weight: bold; }
        .footer { background: #fafafa; border-top: 1px solid #eee; padding: 18px 32px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Notificación Airbnb</h1>
        </div>
        <div class="body">
            <h2>Hola, {{ $userName }}</h2>
            <p><strong>{{ $title }}</strong></p>
            @if(!empty($body))
                <p>{{ $body }}</p>
            @endif
            @if(!empty($actionUrl))
                <a href="{{ $actionUrl }}" class="cta">Ver detalle</a>
            @endif
        </div>
        <div class="footer">
            Recibiste este correo porque tienes notificaciones activas en la plataforma.
        </div>
    </div>
</body>
</html>
