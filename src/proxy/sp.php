<?php
$trollId = $_REQUEST["trollId"];
$trollPassword = $_REQUEST["trollPassword"];
$script = $_REQUEST["script"];

$url = "http://sp.mountyhall.com/".$script."?Numero=".$trollId."&Motdepasse=".$trollPassword;
$data = file_get_contents($url);
echo $data;

//if ($script == "SP_Caract.php") {
//    $data = "BMM;9;3;7;7;20;0;2;2606;1184;6;-160;0;0\n".
//            "BMP;7;0;2;-4;0;0;-1;0;0;17;0;156;10\n".
//            "CAR;14;13;30;6;140;160;4;2102;3116;3;573;0;0";
//} else if ($script == "SP_Aptitudes2.php") {
//    $data = "C;18;90;0;2;\n".
//            "C;18;90;0;1;\n".
//            "C;3;93;0;1;\n".
//            "C;16;90;0;5;\n".
//            "C;16;90;0;4;\n".
//            "C;16;90;0;3;\n".
//            "C;16;90;0;2;\n".
//            "C;16;90;0;1;\n".
//            "C;12;90;5;1;\n".
//            "C;21;90;0;1;\n".
//            "C;8;90;0;5;\n".
//            "C;8;90;0;4;\n".
//            "C;8;90;0;3;\n".
//            "C;8;90;0;2;\n".
//            "C;8;87;0;1;\n".
//            "C;14;83;0;1;\n".
//            "C;44;90;0;1;\n".
//            "C;11;90;0;1;\n".
//            "C;7;90;0;1;\n".
//            "C;5;69;0;1;\n".
//            "C;9;43;0;2;\n".
//            "C;9;81;0;1;\n".
//            "S;3;80;0;1\n".
//            "S;6;75;0;1\n".
//            "S;10;80;0;1\n".
//            "S;27;80;0;1\n".
//            "S;28;67;0;1";
//} else if ($script == "SP_ProfilPublic2.php") {
//    $data = "104259;DevelZimZoum;Kastar;43;2011-01-21 14:07:48;;http://zoumbox.org/mh/syndikhd/104259_300.png;49;539;12;1900;20;0";
//} else {
//    $data = "WTF ? ".$script;
//}
//echo $data;
?>
