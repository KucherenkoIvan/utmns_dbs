--Задача 1.
--Произвести розыгрыш среди пользователей по номерам паспортов с использованием T-SQL:
--1.       Высчитать сумму всех цифр серии и номера паспорта (На входе получаем текст, состоящий из
--серии и номера паспорта, разделенных пробелом, например, «1234 567890». На выходе должно получиться
--число меньше десяти. Пример: 1+2+3+4+5+6+7+8+9+0 = 45 = 4+5 = 9
--2.       Отсортировать по дате выдачи паспорта
--3.       Выбрать первые 10 победителей, сумма цифр серии и паспорта которых кратна 2.
--4.       Вывести имя, отчество, фамилию, номер паспорта, дату выдачи паспорта.
use l1;

go;
drop table if exists Documents;

--Create table
go;
create table Documents (
    Id int identity(1,1) primary key,
    Number varchar(11),
    ReceiveDate date,
    FirstName varchar(max),
    Surname varchar(max),
    LastName varchar(max)
);

--Fill table
go;
insert into Documents values('1234 567890', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Ivan', 'Toropov', 'Leonidovich');
insert into Documents values('5444 237897', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Ivan', 'Kucherenko', 'Mikhailovich');
insert into Documents values('9832 537897', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Artur', 'Khasanov', 'Maratovich');
insert into Documents values('7263 321894', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Nikita', 'Tolstoukhov', 'Sergeevich');
insert into Documents values('6544 345654', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');
insert into Documents values('5346 345654', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');
insert into Documents values('2574 345654', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');
insert into Documents values('7658 345654', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');
insert into Documents values('3567 345654', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');
insert into Documents values('9524 345654', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');
insert into Documents values('6544 987675', getdate() - month(floor(rand()*(10000 - 1 + 1))+ 1), 'Any', 'Many', 'Sany');

go;
drop function if exists sum_digits;

--Func for calculate sum digits in number
go;
create or alter function sum_digits(@intvar bigint) returns int as
begin
    declare @pass_numer_sum bigint;
    with i as (select @intvar / 10 n, @intvar % 10 d union all select n / 10, n % 10 from i where n > 0) select @pass_numer_sum = sum(d) from i;
    return @pass_numer_sum;
end;

go;
drop function if exists passport_sum_number;

--Func for delete spaces and full calculate
go;
create or alter function passport_sum_number(@recordId int) returns int as
begin
    declare @pass_number bigint = (select replace(Number, ' ', '') from Documents where Id = @recordId);
    return (select dbo.sum_digits((select dbo.sum_digits(@pass_number))))
end;

--Main query for task
go;
select top 10 FirstName, LastName, Surname, Number, ReceiveDate from Documents where (select dbo.passport_sum_number(Id)) % 2 = 0 order by ReceiveDate asc;



--Задача 2.
--Написать скрипт на выборку сумм по продажам товаров со следующими условиями:
--1) Выводить суммы продаж за указанный пользователем период (любой)
--2) В строки выводить наименование товаров, сумму продаж за указанную дату, при этом т.к.
--период выборки может меняться, количество колонок в итоговом отчете заранее неизвестно.
--Данные выводить без учета времени.
--В итоговый запрос выводить колонки: Наименование товара, дата1, дата2 и т.д.

use l1;

go;
drop table if exists Sales;

--Create tables
go;
create table Sales (
    tid int identity(1,1) primary key,
    product_id int,
    quantity float,
    recdate datetime
);

go;
drop table if exists Products;

go;
create table Products (
    tid int identity(1,1) primary key,
    productName varchar(max)
);

--Fill tables
insert into Products values('Kasha');
insert into Products values('Vodka');
insert into Products values('Khleb');

insert into Sales values(3, 5, '10.11.2015');
insert into Sales values(2, 21,'11.05.2016');
insert into Sales values(2, 8,'05.30.2017');
insert into Sales values(1, 15,'01.09.2018');
insert into Sales values(1, 32,'01.01.2015');
insert into Sales values(3, 64, '01.12.2020');

go;
drop function if exists get_sales;

--Main function
go;
create function dbo.get_sales(@date1 datetime, @date2 datetime)
returns table
as
return
(select productName, sum(quantity) as productCount from Sales
    join Products on Sales.product_id = Products.tid
    where recdate between  @date1 and @date2 group by productName
);

go
select * from dbo.get_sales('01-01-2016', '01-01-2020')

--Задача 3.
--Рассчитать среднее время в пути в разрезе транспорта
use l1;
go;
drop table if exists Trains;

--Create table
go;
create table Trains (
    ID int,
    Date datetime,
    Reason varchar(32)
);

--Fill table
go;
insert into Trains values(1, '2018-07-21 11:00', 'Otbytie');
insert into Trains values(1, '2018-07-21 18:00','Pribytie');
insert into Trains values(1, '2018-08-12 14:40', 'Otbytie');
insert into Trains values(1, '2018-08-12 19:20','Pribytie');
insert into Trains values(1, '2018-08-13 10:00', 'Otbytie');
insert into Trains values(1, '2018-08-14 08:10','Pribytie');

insert into Trains values(2, '2018-09-19 12:00', 'Otbytie');
insert into Trains values(2, '2018-09-19 12:15','Pribytie');
insert into Trains values(3, '2018-09-24 11:00', 'Otbytie');
insert into Trains values(3, '2018-09-25 16:00','Pribytie');
insert into Trains values(3, '2018-09-30 16:00', 'Otbytie');
insert into Trains values(3, '2018-10-02 11:40','Pribytie');

--Main query
go;
with calculate_difftime as
(
select ID, Date, Reason, case
when Reason = 'Pribytie' then datediff(minute,
(select max(Tr.Date) from Trains as Tr where Trains.ID = Tr.ID and Trains.Date > Tr.Date and Tr.Reason = 'Otbytie'), Trains.Date)
end as TripTime
from Trains
)
select ID, avg(TripTime) as AverageTimeInTrip from calculate_difftime where TripTime is not null group by ID
