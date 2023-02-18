create table if not exists regions (
	region_id int not null primary key,
	name varchar(100) not null
);

create table if not exists countries (
	country_id varchar(3) not null primary key,
	country_name varchar(50) not null,
	region_id int not null references regions(region_id)
);

create table if not exists locations (
	location_id int not null primary key,
	street_adress varchar(150) not null,
	postal_code varchar(20) not null,
	city varchar(50) not null,
	state_province varchar(100),
	country_id varchar(3) null references countries(country_id)
);

create table if not exists jobs (
	job_id not null varchar(15) null primary key,
	job_title varchar(100) not null,
	min_salary int not null,
	max_salary int not null
);

create table if not exists departments (
	department_id int not null primary key,
	department_name varchar(50) not null,
	manager_id int not null,
	location_id int not null references locations(location_id)
);

create table employees (
	employee id int not null primary key,
	first_name varchar(50) not null,
	last_name varchar(50) not null,
	email varchar(100) not null,
	phone_number varchar(15) not null,
	hire_date date not null,
	job_id varchar(15) not null references jobs(job_id),
	salary int not null,
	commission_pct int,
	manager_id int references employee(employee_id),
	department_id int not null references departments(department_id)
)


