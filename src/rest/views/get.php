<?php header('Content-Type: application/json'); ?>
<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

$m = new MongoClient();
$db = $m->zoumprofiler;

$viewsColl = $db->views;

$viewId = $_REQUEST["viewId"];

$publicGroupFilter = array("_internal.shares.group" => "public");
if ($userId) {
    $usersColl = $db->users;

    // Is owner   OR   Is shared with this user   OR   Is public
    $or = array( array("_internal.owner" => $userId),  array("_internal.shares.user" => $userId), $publicGroupFilter);
    $user = $usersColl->findOne(array('_id' => $userId));

    //  OR   Is shared with group
    foreach ($user['groups'] as $group) {
        array_push($or, array("_internal.shares.group" => $group));
    }

    $filter = array('$or' => $or);
} else {
    $filter = $publicGroupFilter;
}

$and = array( array('_id' => new MongoId($viewId)), $filter);
// find all views
$view = $viewsColl->findOne(array('$and' => $and));

echo json_encode($view);

?>
