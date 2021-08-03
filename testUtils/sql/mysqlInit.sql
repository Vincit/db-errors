CREATE USER 'db_errors'@'%' IDENTIFIED WITH mysql_native_password BY 'db_errors';
GRANT ALL ON *.* TO 'db_errors'@'%';
CREATE DATABASE db_errors_test;