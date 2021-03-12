<?php
if (isset($_POST["tool"])){
    require 'dbconfig.php';
    $insert = $DB->prepare("INSERT INTO tools_usage (ts, tool) VALUES (:ts, :tool)");
    $values = array('ts' => $_POST["ts"], 'tool' => $_POST["tool"]);
    $insert->execute($values);
    // print_r($values);
}
elseif (isset($_POST["showStat"])) {
    require 'dbconfig.php';
    $start = $_POST['start'];
    $end = $_POST['end'];
    $main_select = $DB->query("SELECT * FROM tools_usage WHERE ts >= ".$start." AND ts <= ".$end." ORDER BY ts DESC");
    echo "<table>
    <tr><i><b><th>Время</th><th>Инструмент</th></b></i></tr>";
    while ($row = $main_select->fetch(PDO::FETCH_ASSOC)) {
        $dt = date('Y-m-d H:i:s', substr($row['ts'],0,-3));
        echo "<tr><td>".$dt."</td><td>".$row['tool']."</td></tr>";
    }
    echo "</table>";
}
?>