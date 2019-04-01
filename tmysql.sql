create database  Tseries;
use Tseries;

create table musician
(ssn integer primary key,
first_name char(20),
surname char(20),
address varchar(100) not null,
phone_no char(15) not null,
id_i integer,
foreign key(id_i) references instrument(id_i)
);

create table instrument
(id_i integer primary key,
name_mi char(20),
m_key varchar(10)
);

create table album
(id_a integer primary key,
title char(20),
cp_date date,
format1 char(20),
producer_id integer,
foreign key(producer_id) references musician(ssn)
);

create table song
(id_a integer,
foreign key(id_a) references album(id_a),
title char(20),
author char(20)
);

select * from MUSICIAN;

alter table musician
modify phone_no char(15);
DESC SONG;
insert into song values(3,'PEACE','RAVI');

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1404';
FLUSH PRIVILEGES; 
/* This is because caching_sha2_password is introduced in MySQL 8.0, 
but the Node.js version is not implemented yet. You can see this pull request and this issue for more information. 
Probably a fix will come soon!*/
delete 
from song
where song.id_a=1;

create table users
(user_name varchar(40) unique,
password blob
);


INSERT INTO users VALUES ('Hales777', AES_ENCRYPT('swaroop','1404'));

select * from album;
select * from users;
select aes_decrypt(password,'1404') as password FROM users;
truncate table users;

UPDATE musician set first_name="swa",surname="me",address="qece",phone_no="122",id_i="12" where ssn=200;


