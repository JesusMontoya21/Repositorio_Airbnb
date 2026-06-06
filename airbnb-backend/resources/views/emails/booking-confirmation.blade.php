<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF385C, #E31C5F); padding: 40px; text-align: center; }
        .header h1 { color: white; font-size: 28px; margin: 0; }
        .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
        .body { padding: 40px; }
        .body h2 { color: #333; font-size: 22px; margin-bottom: 16px; }
        .body p { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 16px; }
        .booking-card { background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #FF385C; }
        .booking-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .booking-row span:first-child { color: #888; font-size: 14px; }
        .booking-row span:last-child { color: #333; font-size: 14px; font-weight: bold; }
        .total { background: #FF385C; color: white; border-radius: 12px; padding: 16px 24px; display: flex; justify-content: space-between; margin-top: 16px; }
        .total span { font-size: 18px; font-weight: bold; }
        .button { display: inline-block; background: #FF385C; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 16px 0; }
        .footer { background: #f1f1f1; padding: 24px; text-align: center; }
        .footer p { color: #999; font-size: 13px; margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>airbnb</h1>
            <p>¡Tu reservación está confirmada! ✅</p>
        </div>
        <div class="body">
            <h2>¡Hola, {{ $userName }}! 👋</h2>
            <p>Tu reservación ha sido confirmada exitosamente. Aquí están los detalles:</p>

            <div class="booking-card">
                <div class="booking-row">
                    <span>📍 {{ ucfirst($type) }}</span>
                    <span>{{ $propertyTitle }}</span>
                </div>
                <div class="booking-row">
                    <span>📅 Check-in</span>
                    <span>{{ \Carbon\Carbon::parse($checkIn)->format('d/m/Y') }}</span>
                </div>
                <div class="booking-row">
                    <span>📅 Check-out</span>
                    <span>{{ \Carbon\Carbon::parse($checkOut)->format('d/m/Y') }}</span>
                </div>
                <div class="booking-row">
                    <span>👥 Huéspedes</span>
                    <span>{{ $guests }}</span>
                </div>
                <div class="total">
                    <span>Total</span>
                    <span>${{ number_format($totalPrice, 2) }} MXN</span>
                </div>
            </div>

            <p>Recuerda que puedes ver y gestionar tus reservaciones desde tu cuenta.</p>
            <a href="http://localhost:5173/my-bookings" class="button">Ver mis reservaciones</a>
        </div>
        <div class="footer">
            <p>© 2025 Airbnb Clone. Todos los derechos reservados.</p>
            <p>Este correo fue enviado porque realizaste una reservación en nuestra plataforma.</p>
        </div>
    </div>
</body>
</html>