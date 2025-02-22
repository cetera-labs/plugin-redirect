<?php

namespace Redirect;

final class Redirect
{
    public static function redirect()
    {
        if (strtoupper($_SERVER['REQUEST_METHOD']) != "GET" && strtoupper($_SERVER['REQUEST_METHOD']) != "HEAD") {
            return;
        }
		
		if (strpos($_SERVER['REQUEST_URI'], "/cms/") === 0) {
			return;
		}
		
		if (strpos($_SERVER['REQUEST_URI'], "/plugins/") === 0) {
			return;
		}
		
        $host = $_SERVER["HTTP_HOST"];
        $protocol = !empty($_SERVER["HTTPS"])
        && $_SERVER["HTTPS"] != "off" ? "https" : "http";
        $port = !empty($_SERVER["SERVER_PORT"])
         && $_SERVER["SERVER_PORT"] != "80"
         && $_SERVER["SERVER_PORT"] != "443" ?
             (":" . $_SERVER["SERVER_PORT"]) : "";
        /*$port = ":8080";*/
        if (strpos($_SERVER["REQUEST_URI"], '//') === 0) {
			$currentUri = parse_url("/".ltrim($_SERVER["REQUEST_URI"], '/'), PHP_URL_PATH);
			$urlwo = $currentUri;
		} else {
			$currentUri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
			$urlwo = null;
		}
        $currentOptions = include __DIR__ . "/../../r_options.php";
        $redirects = include __DIR__ . "/../../r_list_urls.php";
        $urlf = null;
        $urlt = null;
        $r_sc = null;
        $wwwre = 0;


        $toProtocol = $currentOptions[0]["ro_pc"];
        if ($toProtocol == "to_https" && $protocol == "http") {
            $protocol = "https";
            $urlwo = $currentUri;
        } else if ($toProtocol == "to_http" && $protocol == "https") {
            $protocol = "http";
            $urlwo = $currentUri;
        }

        if ($currentOptions[0]["ro_www"] == "on"
            && substr($_SERVER["HTTP_HOST"], 0, 4) == "www.") {
			$host = substr($_SERVER["HTTP_HOST"], 4);
			$urlwo = $currentUri;
			$wwwre = 1;
        }

        if ($currentOptions[0]["ro_cetera"] === "on"
            && $_SERVER["HTTP_HOST"] === "ru.ceteralabs.com") {
                header('Location: ' . $protocol . "://cetera.ru", true, 301);
                exit;
        }
		
        if ($currentOptions[0]["ro_ss"] == "on" || $currentOptions[0]["ro_ms"] == "on" || $wwwre == 1) {
            $changed = false;
            $u = parse_url($currentUri);

            if ($currentOptions[0]["ro_ss"] == "on") {
                $tmp = basename(rtrim($u["path"], "/"));
                if (substr($u["path"], -1, 1) != "/" && substr($tmp, -4) != ".php" && substr($tmp, -4) != ".htm" && substr($tmp, -5) != ".html" && substr($tmp, -4) != ".png" && substr($tmp, -4) != ".jpg" && substr($tmp, -5) != ".jpeg" && substr($tmp, -5) != ".webp" && substr($tmp, -4) != ".gif" && substr($tmp, -5) != ".webm" && substr($tmp, -4) != ".pdf" && substr($tmp, -4) != ".mp3" && substr($tmp, -4) != ".aac" && substr($tmp, -4) != ".bmp" && substr($tmp, -4) != ".txt" && substr($tmp, -4) != ".ico" && substr($tmp, -4) != ".xml" && substr($tmp, -3) != ".js" && substr($tmp, -5) != ".json" && substr($tmp, -5) != ".docx" && substr($tmp, -4) != ".doc") {
                    $u["path"] .= "/";
                    $changed = true;
                }
            }

            if ($currentOptions[0]["ro_ms"] == "on") {
                if (strpos($u["path"], "//") !== false) {
                    $u["path"] = preg_replace('{/+}s', "/", $u["path"]);
                    $changed = true;
                }
            }
			
			if ($currentOptions[0]["ro_remin"] == "on") {
				if (strpos($u["path"], "/index/") !== false) {
					$u["path"] = preg_replace('/index/', "/", $u["path"]);
					$u["path"] = preg_replace('{/+}s', "/", $u["path"]);
					$changed = true;
				}
				if (strpos($u["path"], "/index.html") !== false) {
					$u["path"] = str_replace("/index.html", "/", $u["path"]);
					$changed = true;
				}
				if (strpos($u["path"], "/index.php") !== false) {
					$u["path"] = str_replace("/index.php", "/", $u["path"]);
					$changed = true;
				}
			}
			
            if ($changed) {
                $urlwo = $u["path"];
                if (!empty($u["query"])) {
                    $urlwo .= "?" . $u["query"];
                }
            }
			
            if (!empty($urlwo) || $wwwre == 1) {
                header('Location: ' . $protocol . "://" . $host . $port . $urlwo, true, 301);
                exit;
            }
        }

        if ($currentOptions[0]["ro_404"] == "on") {
            if (http_response_code() == 404) {
                header('Location: ' . $protocol . "://" . $host . $port . "/", true, 301);
                exit;
            }
        }

        if ($currentOptions[0]["ro_lower"] == "on") {
            $url = $_SERVER['REQUEST_URI'];
            $parsedUrl = parse_url($_SERVER['REQUEST_URI']);
            $lowerUrl = strtolower($parsedUrl['path']);
            if (array_key_exists('query',$parsedUrl)) {
                $lowerUrl .= '?'.$parsedUrl['query'];
            }

            if (preg_match('/[A-Z]/', $url)) {
                if ($lowerUrl !== $url) {
                    header('Location: '.$lowerUrl, TRUE, 301);
                    exit();
                }
            }
        }

        foreach ($redirects as $row => $innerArray) {
            $urlf = $redirects[$row]["url_from"];
            $urlt = $redirects[$row]["url_to"];
            $r_sc = $redirects[$row]["r_code"];
            $r_domain = $redirects[$row]["r_domain"];
            if (!$r_domain) {
                if ($urlf == $currentUri && substr($urlt, 0, 4) != "http") {
                    header('Location: ' . $protocol . "://" . $host . $port . $urlt, true, $r_sc);
                    exit;
                } else if ($urlf == $currentUri && substr($urlt, 0, 4) == "http") {
                    header('Location: ' . $urlt, true, $r_sc);
                    exit;
                }
            } else {
                if ($r_domain == $host) {
                    if ($urlf == $currentUri && substr($urlt, 0, 4) != "http") {
                        header('Location: ' . $protocol . "://" . $host . $port . $urlt, true, $r_sc);
                        exit;
                    } else if ($urlf == $currentUri && substr($urlt, 0, 4) == "http") {
                        header('Location: ' . $urlt, true, $r_sc);
                        exit;
                    }
                }

            }

        }
    }
}
