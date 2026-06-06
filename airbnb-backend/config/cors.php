<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://192.168.56.1:5173'],

    'allowed_headers' => ['*'],

    'supports_credentials' => true,
];