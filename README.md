# Модуль «Редиректы»
Позволяет настроить редиректы в интерфейсе Fastsite CMS без использования файла .htaccess

# Установка
Выполнить команду:
```sh
composer require  cetera-labs/plugin-redirect
```

# Инструкция по работе

Позволяет настроить редиректы в интерфейсе Fastsite CMS без использования файла .htaccess
После установки модуля появляется пункт меню «Редиректы», открыв его можно увидеть две вкладки: «Список редиректов» и «Настройки»

Вкладка «Список редиректов» содержит список редиректов, где можно добавлять новые, изменять и/или удалять уже существующие.
При нажатии на кнопку добавить открывается модальное окно где указывается URL'ы с какой странцы и на какую страницу необходимо сделать редирект, а также выбирается код редиректа 301 или 302.
При выборе уже существующего редиректа и нажатии изменить открывается модальное окно где можно изменить параметры данного редиректа.
При выборе уже существующего редиректа и нажатии удалить открывается модальное окно с подтверждением данного действия.

Вкладка «Настройки» содержит общие настройки разбитые на категории, сейчас доступна одна категория «Общие редиректы».
Нажав на пункт «Общие редиректы» откроется модальное окно где можно выбрать следующие параметры.
1. Осуществлять редирект с url с www на без www
2. Осуществлять редирект с url без / на url с /
3. Осуществлять редирект с url с более чем одним / подряд на одинарный /
4. С 404 страницы на главную
5. С http на https и наоборот
