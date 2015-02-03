<?php header('Content-Type: text/plain; charset=utf-8'); ?>
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
//} else if ($script == "SP_Vue2.php") {
//    $data = "#DEBUT TROLLS\n".
//               "49604;81;-40;-86\n".
//               "86133;81;-40;-86\n".
//               "95636;80;-40;-86\n".
//               "100160;81;-40;-86\n".
//               "104259;82;-39;-86\n".
//               "105395;81;-40;-86\n".
//               "89138;82;-38;-85\n".
//               "90568;79;-41;-85\n".
//               "#FIN TROLLS\n".
//               "#DEBUT MONSTRES\n".
//               "5285246;Petit Foudroyeur [Larve];79;-41;-85\n".
//               "5231059;Nécrochore Nécromant [Vénérable];81;-40;-86\n".
//               "5265205;Petite Ame-en-peine [Ancienne];81;-37;-86\n".
//               "5290176;Fantôme Corrompu [Naissant];81;-36;-86\n".
//               "5279870;Spectre Corrompu [Naissant];81;-36;-86\n".
//               "5280914;Ame-en-peine [Naissante];81;-36;-86\n".
//               "5285516;Ame-en-peine [Naissante];81;-36;-86\n".
//               "5288135;Ombre [Naissante];81;-36;-86\n".
//               "5274669;Goule [Récente];81;-35;-86\n".
//               "5182595;Effrit Colossal [Doyen];82;-41;-86\n".
//               "5286997;Fantôme [Naissant];82;-37;-85\n".
//               "5292767;Goule [Naissante];84;-35;-85\n".
//               "5284419;Maître Ectoplasme [Naissant];84;-34;-85\n".
//               "#FIN MONSTRES\n".
//               "#DEBUT ORIGINE\n".
//               "5;82;-39;-86\n".
//               "#FIN ORIGINE";
//} else {
//    $data = "WTF ? ".$script;
//}
//echo $data;






//if ($script == "SP_Caract.php") {
//    $data =  "BMM;6;9;10;8;20;0;9;8061;6368;20;-140;0;0\n".
//             "BMP;-1;-5;2;-2;0;0;-2;0;0;22;0;148.5;0\n".
//             "CAR;16;27;23;9;240;260;12;3373;16764;5;585;0;0\n";
//} else if ($script == "SP_Aptitudes2.php") {
//    $data =  "C;18;90;0;2;\n".
//             "C;18;90;0;1;\n".
//             "C;38;52;0;1;\n".
//             "C;19;77;0;1;\n".
//             "C;24;90;0;1;\n".
//             "C;15;32;0;1;Pi�ge � Feu\n".
//             "C;12;90;0;1;\n".
//             "C;10;71;0;2;\n".
//             "C;10;80;0;1;\n".
//             "C;14;81;0;1;\n".
//             "C;21;90;0;1;\n".
//             "C;1;90;0;1;\n".
//             "C;5;73;0;1;\n".
//             "C;16;90;0;4;\n".
//             "C;16;90;0;3;\n".
//             "C;16;90;0;2;\n".
//             "C;16;90;0;1;\n".
//             "C;29;90;0;1;\n".
//             "C;8;73;0;3;\n".
//             "C;8;90;0;2;\n".
//             "C;8;90;0;1;\n".
//             "C;26;59;0;1;\n".
//             "C;30;50;0;1;\n".
//             "S;2;80;0;1\n".
//             "S;5;79;0;1\n".
//             "S;7;80;0;1\n".
//             "S;8;80;0;1\n".
//             "S;9;79;0;1\n".
//             "S;10;80;0;1\n".
//             "S;12;80;0;1\n".
//             "S;13;80;0;1\n".
//             "S;15;80;0;1\n".
//             "S;16;80;0;1\n".
//             "S;17;80;0;1\n".
//             "S;18;80;0;1\n".
//             "S;20;80;0;1\n".
//             "S;21;80;0;1\n".
//             "S;22;76;0;1\n".
//             "S;23;80;0;1\n".
//             "S;24;80;0;1\n".
//             "S;27;79;0;1\n".
//             "S;28;35;0;1\n".
//             "S;29;80;0;1\n".
//             "S;33;63;0;1\n";
//} else if ($script == "SP_ProfilPublic2.php") {
//    $data = "86133;SLJ;Skrim;43;2011-01-21 14:07:48;;http://zoumbox.org/mh/syndikhd/104259_300.png;49;539;12;1900;20;0";
//} else {
//    $data = "WTF ? ".$script;
//}
//echo $data;

?>
