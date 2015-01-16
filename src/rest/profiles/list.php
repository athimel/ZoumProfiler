<?php

session_start();
$userId = $_SESSION['authenticatedUserId'];

$m = new MongoClient();
$db = $m->zoumprofiler;

$profilesColl = $db->profiles;

// find all profiles
$profiles = $profilesColl->find();

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
