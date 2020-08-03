<?php
include_once('common_bo.php');
if (!$application->getUser()->isAdmin()) die('access denied');

$res = array(
    'success' => false,
    'errors' => array()
);

$action = $_POST['action'];
$id = (int)$_POST['id'];

if ($action == 'save_r_options') {

    $query = 'r_options_plugin SET ro_www=?, ro_ss=?, ro_ms=?, ro_404=?, ro_pc=?';

    if ($id) $query = 'UPDATE ' . $query . ' WHERE id=' . $id;
    else $query = 'INSERT INTO ' . $query;

    $application->getConn()->executeQuery($query, array($_POST['ro_www'], $_POST['ro_ss'], $_POST['ro_ms'], $_POST['ro_404'], $_POST['ro_pc']));
    if (!$id) $id = $application->getConn()->lastInsertId();

    $res['success'] = true;
}

if ($action == 'get_r_options') {

	$query = 'SELECT * FROM r_options_plugin WHERE id=?';
	
	$res['data'] = $application->getConn()->fetchAssoc($query, array((int)$_REQUEST['id']));
	$res['success'] = true;

}

echo json_encode($res);