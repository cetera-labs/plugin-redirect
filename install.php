<?php

$a = \Cetera\Application::getInstance();

$conn = $a->getConn();

$r = $conn->fetchColumn("select count(*) from r_options_plugin where id = ?", array(1));

if (!$r) {
    $conn->executeQuery(
        'INSERT INTO
				r_options_plugin (
					  id,
					  ro_www,
					  ro_ss,
					  ro_ms,
					  ro_remin,
                      ro_404,
				      ro_lower,
                      ro_cetera,
                      ro_pc,
					  ro_enablecity,
					  ro_defaultcity
				)
				VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        array(
            1,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
			"",
			"",
            "off"
        )
    );
}