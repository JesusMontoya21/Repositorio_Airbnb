<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://192.168.56.1:5173', 'http://localhost', 'http://127.0.0.1'],

    'allowed_headers' => ['*'],

    'supports_credentials' => true,
];