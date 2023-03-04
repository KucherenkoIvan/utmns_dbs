use LAB1

create table Regions
(Region_ID int Primary key not null,
 Region_Name varchar(25)
)  

create table Countries
 (Country_ID char(2) Primary key not null,
  Country_Name varchar(40),
  Region_ID int FOREIGN KEY REFERENCES Regions(Region_ID) not null
 )  

create table Locations
 (Location_ID int Primary key identity(2000, 100);
  Street_Address varchar(40),
  Postal_Code varchar(12),
  City varchar(30) not null,
  State_Province varchar(25),
  Country_ID char(2) FOREIGN KEY REFERENCES Countries(Country_ID) not null
 ) 


create table Departments
 (Department_ID int Primary key not null,
  Department_Name varchar(30) not null,
  Manager_ID int,
  Location_ID int FOREIGN KEY REFERENCES Locations(Location_ID)
 ) 


create table Jobs
 (Job_ID varchar(10) Primary key not null,
  Job_Title varchar(35) not null,
  Min_Salary int,
  Max_Salary int,
 ) 


create table Job_History
 (Employee_ID int not null,
  Start_Date datetime not null,
  End_Date datetime not null,
  Job_ID varchar(10) FOREIGN KEY REFERENCES Jobs(Job_ID) not null,
  Department_ID int FOREIGN KEY REFERENCES Departments(Department_ID) not null,
  CONSTRAINT pk_JhID PRIMARY KEY (Employee_ID,Start_Date)
 ) 
  

 create table Employees
 (Employee_ID int PRIMARY KEY not null, 
  First_Name varchar(20) not null, 
  Last_Name varchar(25) not null, 
  Email varchar(20) not null,
  Phone_Number varchar(20) not null,
  Hire_Date date not null,
  Job_ID varchar(10) FOREIGN KEY REFERENCES Jobs(Job_ID) not null,
  Salary int not null,
  Commission_Pct float,
  Manager_ID int FOREIGN KEY REFERENCES Employees(Employee_ID),
  Department_ID int FOREIGN KEY REFERENCES Departments(Department_ID) not null
 )


go
Alter Table Departments add FOREIGN KEY(Manager_ID) REFERENCES Employees(Employee_ID)
go
Alter Table Job_History add FOREIGN KEY(Employee_ID) REFERENCES Employees(Employee_ID)
go



