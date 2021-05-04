<?php
if ($_POST['dn']) {
    $ip = gethostbyname($_POST['dn']);
    echo $ip;
}
?>