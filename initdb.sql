ALTER USER 'dbuser'@'%' IDENTIFIED WITH mysql_native_password BY 'secret';
GRANT all ON *.* TO 'dbuser'@'%';
