create database user_db;
create database driver_db;
create database ride_db;
create database payment_db;
create database rating_db;


 
use user_db;
use driver_db;
use ride_db;
use payment_db;
use rating_db;
 
select * from user;
select * from driver;
select * from ride;
select * from payment;
select * from rating;
 
 
delete from driver where driver_id=8;
drop database user_db;
drop table user;