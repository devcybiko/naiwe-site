ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'hokxan9Mysql';
create database if not exists naiwe;
use naiwe;

drop table if exists rawlogs;

create table if not exists rawlogs (
  id INT NOT NULL AUTO_INCREMENT,
  logname VARCHAR(100) NOT NULL,
  logtext VARCHAR(750) UNIQUE NOT NULL,
  logerr VARCHAR(750),
  logtime DATETIME,
  PRIMARY KEY (id)
  -- UNIQUE KEY `text_key` (`logtext`)
);
