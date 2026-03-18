<?php
/**
 * write-file.php — LRPF Admin: direct file writer
 * Upload this once to cPanel. Admin panel will POST here to update HTML files live.
 */

define('DEFAULT_PASSWORD', 'lrpf@2026');
define('CONFIG_FILE',      __DIR__ . '/admin-config.json');
define('ALLOWED_FILES', [
    'index.html', 'about.html', 'work.html', 'gallery.html',
    'get-involved.html', 'resources.html', 'contact.html', 'grievance.html'
]);

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) respond(false, 'Invalid request');

/* --- Check password --- */
$config    = file_exists(CONFIG_FILE) ? (json_decode(file_get_contents(CONFIG_FILE), true) ?: []) : [];
$storedPwd = isset($config['password']) ? $config['password'] : DEFAULT_PASSWORD;

if (($input['pwd'] ?? '') !== $storedPwd) {
    http_response_code(403);
    respond(false, 'Wrong password');
}

$action = $input['action'] ?? 'write';

/* --- Upload an image file to /uploads/ --- */
if ($action === 'upload-image') {
    $filename = $input['filename'] ?? '';
    $data     = $input['data']     ?? '';   // base64 data-URL

    if (!$filename || !$data) respond(false, 'Missing filename or data');

    // Sanitize: keep only safe characters, preserve extension
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '-', basename($filename));

    // Decode base64
    if (strpos($data, 'base64,') !== false) {
        $data = substr($data, strpos($data, 'base64,') + 7);
    }
    $decoded = base64_decode($data, true);
    if (!$decoded) respond(false, 'Invalid image data');

    $uploadDir = __DIR__ . '/Images/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    if (file_put_contents($uploadDir . $filename, $decoded) === false)
        respond(false, 'Could not save image — check permissions');

    respond(true, 'Images/' . $filename);
}

/* --- Write an HTML file --- */
if ($action === 'write') {
    $file = basename($input['file'] ?? '');
    if (!in_array($file, ALLOWED_FILES)) respond(false, 'File not allowed');

    $content = $input['content'] ?? '';
    if (empty($content)) respond(false, 'Empty content');

    if (file_put_contents(__DIR__ . '/' . $file, $content) === false)
        respond(false, 'Could not write ' . $file . ' — check folder permissions');

    respond(true, $file . ' updated successfully');
}

/* --- Change password (keeps in sync with admin panel) --- */
if ($action === 'change-password') {
    $newPwd = $input['new_pwd'] ?? '';
    if (strlen($newPwd) < 6) respond(false, 'Password must be at least 6 characters');
    $config['password'] = $newPwd;
    file_put_contents(CONFIG_FILE, json_encode($config, JSON_PRETTY_PRINT));
    respond(true, 'Password updated');
}

respond(false, 'Unknown action');

function respond($ok, $msg) {
    echo json_encode(['ok' => (bool)$ok, 'msg' => (string)$msg]);
    exit;
}
