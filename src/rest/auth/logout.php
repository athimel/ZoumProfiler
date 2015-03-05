<?php header('Content-Type: application/json'); ?>
<?php
session_start();
unset($_SESSION['authenticatedUserId']);
session_destroy();
?>{}