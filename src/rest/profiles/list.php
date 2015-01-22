<?php header('Content-Type: application/json'); ?>
<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

$m = new MongoClient();
$db = $m->zoumprofiler;

$profilesColl = $db->profiles;

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

// find all profiles
$profiles = $profilesColl->find($filter);

?>{
  "profiles":[
<?php
    // iterate through the results
    foreach ($profiles as $profile) {
        unset($profile['_internal']);
        echo "    ".json_encode($profile);
        if ($profiles->hasNext()) {
            echo ",";
        }
        echo "\n";
    }
?>  ]
}
