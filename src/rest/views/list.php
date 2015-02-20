<?php header('Content-Type: application/json'); ?>
<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

$m = new MongoClient();
$db = $m->zoumprofiler;

$viewsColl = $db->views;

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

// find all views
$views = $viewsColl->find($filter);

?>{
  "views":[
<?php
    // iterate through the results
    foreach ($views as $view) {
        echo "    ".json_encode($view);
        if ($views->hasNext()) {
            echo ",";
        }
        echo "\n";
    }
?>  ]
}
