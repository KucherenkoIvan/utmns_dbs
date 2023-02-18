create table if not exists regions (
	region_id int not null primary key,
	name varchar(100) not null
);

create table if not exists countries (
	country_id int not null primary key,
	country_name varchar(50) not null,
	region_id int not null references regions(region_id)
);

create table if not exists locations (
	location_id int not null primary key,
	street_adress varchar(150) not null,
	postal_code varchar(20) not null,
	city varchar(50) not null,
	state_province varchar(100),
	country_id int not null references countries(country_id)
);

create table if not exists jobs (
	job_id int not null primary key,
	job_title varchar(100) not null,
	min_salary int not null,
	max_salary int not null
);

create table if not exists departments (
)