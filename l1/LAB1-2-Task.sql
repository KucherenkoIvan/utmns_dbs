use LAB1

--Таблица Employees. Получить список всех сотрудников
SELECT * FROM Employees

--Таблица Employees. Получить список всех сотрудников с именем 'David'
SELECT * FROM Employees Where First_Name = 'David'

--Таблица Employees. Получить список всех сотрудников с job_id равным 'IT_PROG'
SELECT * FROM Employees Where Job_ID  = 'IT_PROG'

--Таблица Employees. Получить список всех сотрудников из 50го отдела (department_id) с зарплатой(salary), большей 4000
SELECT * FROM Employees WHERE Department_ID=50 AND Salary>4000

--Таблица Employees. Получить список всех сотрудников из 20го и из 30го отдела (department_id)
SELECT * FROM Employees WHERE Department_ID=20 OR Department_ID=30

--Таблица Employees. Получить список всех сотрудников у которых последняя буква в имени равна 'a'
SELECT * FROM Employees WHERE First_Name LIKE '%a'

--Таблица Employees. Получить список всех сотрудников из 50го и из 80го отдела (department_id) у которых есть бонус (значение в колонке commission_pct не пустое)
SELECT * FROM Employees WHERE (Department_ID=50 OR Department_ID=80) AND Commission_Pct is not null

--Таблица Employees. Получить список всех сотрудников у которых в имени содержатся минимум 2 буквы 'n'
SELECT * FROM Employees WHERE First_Name LIKE '%n%n%'

--Таблица Employees. Получить список всех сотрудников у которых длина имени больше 4 букв
SELECT * FROM Employees WHERE LEN(First_Name) > 4

--Таблица Employees. Получить список всех сотрудников у которых зарплата находится в промежутке от 8000 до 9000 (включительно)
SELECT * FROM Employees WHERE Salary BETWEEN 8000 AND 9000

-- Таблица Employees. Получить список всех сотрудников у которых в имени содержится символ '%'
SELECT * FROM Employees WHERE First_Name LIKE '%\%%' {escape '\'}

--Таблица Employees. Получить список всех ID менеджеров
SELECT DISTINCT Manager_ID FROM Employees

--Таблица Employees. Получить список работников с их позициями в формате: Donald(sh_clerk)
SELECT CONCAT(First_Name, '(', Job_ID, ')') Employees

--Таблица Employees. Получить список всех сотрудников у которых длина имени больше 10 букв
SELECT * FROM Employees WHERE LEN(First_Name) < 10

--Таблица Employees. Получить список всех сотрудников у которых в имени есть буква 'b' (без учета регистра)
SELECT * FROM Employees WHERE LOWER(First_Name) LIKE '%b%'

--Таблица Employees. Получить список всех сотрудников у которых в имени содержатся минимум 2 буквы 'a'
SELECT * FROM Employees WHERE First_Name LIKE '%a%a%'

--Таблица Employees. Получить список всех сотрудников зарплата которых кратна 1000
SELECT * FROM Employees WHERE Salary % 1000=0

--Таблица Employees. Получить первое 3х значное число телефонного номера сотрудника если его номер в формате ХХХ.ХХХ.ХХХХ
SELECT Phone_Number, SUBSTRING(Phone_Number , 1 , 3) as RESULT FROM Employees WHERE Phone_Number LIKE '[0-9][0-9][0-9].[0-9][0-9][0-9].[0-9][0-9][0-9][0-9]'

 --Таблица Departments. Получить первое слово из имени департамента для тех у кого в названии больше одного слова
SELECT LEFT(Department_Name,CHARINDEX(' ',Department_Name,1)) FROM Departments WHERE Department_Name LIKE '% %'

--Таблица Employees. Получить список всех сотрудников у которых последняя буква в имени равна 'm' и длинной имени большей 5ти
SELECT * FROM Employees WHERE First_Name LIKE '%m' AND LEN(First_Name)>5

--Таблица Dual. Получить дату следующей пятницы
SELECT DATEADD(DAY, 13 - (@@DATEFIRST + (DATEPART(WEEKDAY,GETDATE()) %7)), GETDATE())

-- Таблица Employees. Получить список всех сотрудников которые работают в компании больше 17 лет
SELECT * FROM Employees WHERE DATEDIFF(yy,Hire_Date,GETDATE())>17 OR
(DATEDIFF(yy,Hire_Date,GETDATE())=17 AND
(MONTH(Hire_Date)<MONTH(GETDATE()) OR (MONTH(Hire_Date)=MONTH(GETDATE()) AND DAY(Hire_Date)<DAY(GETDATE()))))

--Таблица Employees. Получить список всех сотрудников у которых последня цифра телефонного номера нечетная и состоит из 3ех чисел разделенных точкой
SELECT Phone_Number FROM Employees WHERE Phone_Number NOT LIKE '%[^0-9]%.%[^0-9]%.%[^0-9]%' AND Phone_Number LIKE '%[1,3,5,7,9]'

--Таблица Employees. Получить список всех сотрудников у которых в значении job_id после знака '_' как минимум 3 символа но при этом это значение после '_' не равно 'CLERK'
SELECT * FROM Employees WHERE Job_ID LIKE '%#____%' ESCAPE '#' AND Job_ID NOT LIKE '%#_CLERK%' ESCAPE '#'

--Таблица Employees. Получить список всех сотрудников заменив в значении PHONE_NUMBER все '.' на '-'
SELECT *,
REPLACE(Phone_Number, '.', '-') AS Phone_Number
FROM Employees

--Таблица Employees. Получить список всех сотрудников которые пришли на работу в первый день месяца (любого)
SELECT * FROM Employees WHERE DATEPART(DAY, Hire_Date) = 1

--Таблица Employees. Получить список всех сотрудников которые пришли на работу в 2008ом году
SELECT * FROM Employees WHERE DATEPART(YEAR, Hire_Date) = 2008

 --Таблица DUAL. Показать завтрашнюю дату
SET LANGUAGE us_english
PRINT 'Tomorrow is '+DATENAME(day,DATEADD(day,1,GETDATE()))+' Day of '+ DATENAME(month,DATEADD(day,1,GETDATE()))
SET LANGUAGE russian

--Таблица Employees. Получить список всех сотрудников и дату прихода на работу каждого в формате: 21st of June, 2007
SELECT *, CONCAT(DATENAME(DAY, Hire_Date), ' of ', DATENAME(MONTH, Hire_Date), ', ', DATENAME(YEAR, Hire_Date)) as Hire_Date  FROM Employees

--Таблица Employees. Получить список работников с увеличенными зарплатами на 20%. Зарплату показать со знаком доллара
SELECT Employee_ID, First_Name,Last_Name,Email,Phone_Number,Hire_Date,Job_ID,
CAST((Salary*1.2) as varchar)+'$' as 'Salary', Commission_Pct,Manager_ID,Department_ID
FROM Employees WHERE Commission_Pct=20

-- Таблица Employees. Получить список всех сотрудников которые приши на работу в феврале 2007го года.
SELECT * FROM Employees WHERE DATEPART(YEAR, Hire_Date) = 2007 and DATEPART(MONTH, Hire_Date) = 2

-- Таблица DUAL. Вывезти актуальную дату, + секунда, + минута, + час, + день, + месяц, + год
SELECT CAST(current_timestamp as nvarchar),'+1 секунда:'+CAST(DATEADD(s,1,current_timestamp) as nvarchar),'+1 минута:'+
CAST(DATEADD(mi,1,current_timestamp) as nvarchar),'+1 час:'+CAST(DATEADD(hh,1,current_timestamp) as nvarchar),
'+1 день:'+CAST(DATEADD(dd,1,current_timestamp) as nvarchar),'+1 месяц:'+CAST(DATEADD(mm,1,current_timestamp) as nvarchar),
'+1 год:'+CAST(DATEADD(yy,1,current_timestamp) as nvarchar)

--Таблица Employees. Получить список всех сотрудников с полными зарплатами (salary + commission_pct(%)) в формате: $24,000.00
SELECT *, CONVERT(NUMERIC(20,2), Salary + (Salary * COALESCE(Commission_Pct, 0)/100))  AS Full_Salary FROM Employees

--Таблица Employees. Получить список всех сотрудников и информацию о наличии бонусов к зарплате (Yes/No)
SELECT t.*, (case when t.Commission_Pct is null then 'NO' else 'YES' END) as 'Наличие_скидки' FROM Employees t

--Таблица Countries. Для каждой страны показать регион в котором он находится: 1-Europe, 2-America, 3-Asia, 4-Africa (без Join)
SELECT Country_ID,Country_Name,Region_ID,
(case when Region_ID=1 then 'Europe' when Region_ID=2 then 'America' when Region_ID=3 then 'Asia'
when Region_ID=4 then 'Africa' END) as 'Region_Name' FROM Countries

--Reporting Aggregated Data Using the Group Functions

--Таблица Employees. Получить репорт по department_id с минимальной и максимальной зарплатой, с ранней и поздней датой прихода на работу и с количествов сотрудников. Сорировать по количеству сотрудников (по убыванию)
SELECT Departments.Department_ID, Departments.Department_Name,
MIN(Employees.Salary) AS MIN_SALARY, MAX(Employees.Salary) AS MAX_SALARY,
MIN(Employees.Hire_Date) AS MIN_Hire_Date, MAX(Employees.Hire_Date) AS MAX_Hire_Date, COUNT(Employees.Employee_ID) AS KOLVO_SOTRUDNIKOV
FROM Departments
left join Employees on Departments.Department_ID = Employees.Department_ID GROUP BY Departments.Department_ID, Departments.Department_Name ORDER BY KOLVO_SOTRUDNIKOV DESC

--Таблица Employees. Сколько сотрудников имена которых начинается с одной и той же буквы? Сортировать по количеству. Показывать только те где количество больше 1
SELECT COUNT(*) as 'Количество', LEFT(First_Name,1) as 'Буква' FROM Employees GROUP BY LEFT(First_Name,1)
HAVING COUNT(*)>1 ORDER BY COUNT(*) DESC

--Таблица Employees. Сколько сотрудников которые работают в одном и тоже отделе и получают одинаковую зарплату?
SELECT DISTINCT Department_ID, Salary, COUNT(*) AS KOLVO_SOTRUDNIKOV FROM Employees GROUP BY Department_ID, Salary

--Таблица Employees. Получить репорт сколько сотрудников приняли на работу в каждый день недели. Сортировать по количеству
SELECT COUNT(*) as 'Количество', DATENAME(dw,Hire_Date) as 'День_недели' FROM Employees
GROUP BY DATENAME(dw,Hire_Date) ORDER BY COUNT(*) DESC

--Таблица Employees. Получить репорт сколько сотрудников приняли на работу по годам. Сортировать по количеству
SELECT COUNT(*) as KOLVO_SOTRUDNIKOV, DATENAME(year,Hire_Date) as 'HireYear' FROM Employees
GROUP BY DATENAME(year,Hire_Date) ORDER BY COUNT(*) DESC

--Таблица Employees. Получить количество департаментов в котором есть сотрудники
SELECT COUNT(DISTINCT Department_ID) as 'Количество_департаментов' FROM Employees

--Таблица Employees. Получить список department_id в котором работают больше 30 сотрудников
SELECT Department_ID, COUNT(*) AS KOLVO_SOTRUDNIKOV FROM Employees GROUP by Department_ID HAVING COUNT(*) > 30

--Таблица Employees. Получить список department_id и округленную среднюю зарплату работников в каждом департаменте.
SELECT Department_ID, ROUND(AVG(CAST(Salary as float)),2) as 'Средняя_ЗП' FROM Employees GROUP BY Department_ID

--Таблица Countries. Получить список region_id сумма всех букв всех country_name в котором больше 60ти
select region_id, sum(len(Country_Name)) as SUUUUUM from Countries group by Region_ID HAVING sum(len(Country_Name)) > 60

--Таблица Employees. Получить список department_id в котором работают работники нескольких (>1) job_id
SELECT Department_ID, COUNT(DISTINCT Job_ID) as 'Количество' FROM Employees GROUP BY Department_ID
HAVING COUNT(DISTINCT Job_ID)>1

--Таблица Employees. Получить список manager_id у которых количество подчиненных больше 5 и сумма всех зарплат его подчиненных больше 50000
SELECT Manager_ID, SUM(Salary) as 'ЗП', COUNT(Employee_ID) as 'К' FROM Employees
GROUP BY Manager_ID HAVING SUM(Salary) > 50000 and COUNT(Employee_ID) > 5

--Таблица Employees. Получить список manager_id у которых средняя зарплата всех его подчиненных находится в промежутке от 6000 до 9000 которые не получают бонусы (commission_pct пустой)
SELECT Manager_ID, AVG(Salary) as 'Средняя_ЗП' FROM Employees WHERE Commission_Pct IS NULL
GROUP BY Manager_ID HAVING AVG(Salary) BETWEEN 6000 AND 9000

--Таблица Employees. Получить максимальную зарплату из всех сотрудников job_id которы заканчивается на слово 'CLERK'
SELECT Job_ID, MAX(Salary) as 'ЗП'FROM Employees
GROUP BY Job_ID HAVING Job_ID like '%CLERK'

--Таблица Employees. Получить максимальную зарплату среди всех средних зарплат по департаменту
SELECT DISTINCT MAX(AVG(Salary)) OVER() as 'Макс_Ср_ЗП' FROM Employees GROUP BY Department_ID

--Таблица Employees. Получить количество сотрудников с одинаковым количеством букв в имени. При этом показать только тех у кого длина имени больше 5 и количество сотрудников с таким именем больше 20. Сортировать по длинне имени
SELECT LEN(First_Name) as 'LENGTHHHH', COUNT(*) as COUNTTTTTTTT from Employees GRoUp by LEN(First_Name)  having LEN(First_Name) > 5 and COUNT(*) > 20

--Таблица Employees, Departaments, Locations, Countries, Regions. Получить список регионов и количество сотрудников в каждом регионе
SELECT Region_Name, COUNT(Employees.Employee_ID) FROM Regions left join Countries on Regions.Region_ID = Countries.Region_ID
left join Locations on Locations.Country_ID = Countries.Country_ID
left join Departments on Departments.Location_ID = Locations.Location_ID
left join Employees on Employees.Department_ID = Departments.Department_ID
group by Region_Name

--Таблица Employees, Departaments, Locations, Countries, Regions. Получить детальную информацию о каждом сотруднике: First_name, Last_name, Departament, Job, Street, Country, Region
SELECT First_Name,Last_Name,Department_Name as 'Department',Job_Title as 'Job',Street_Address as 'Street',
Country_Name as 'Country',Region_Name as 'Region'
FROM Employees t JOIN Departments ON t.Department_ID=Departments.Department_ID
JOIN Jobs ON t.Job_ID=Jobs.Job_ID
JOIN Locations ON Departments.Location_ID=Locations.Location_ID
JOIN Countries ON Locations.Country_ID=Countries.Country_ID
JOIN Regions ON Regions.Region_ID=Countries.Region_ID

--Таблица Employees. Показать всех менеджеров которые имеют в подчинении больше 6ти сотрудников
SELECT t.Manager_ID, COUNT(t.Employee_ID) FROM Employees t LEFT JOIN Employees e ON t.Manager_ID=e.Employee_ID
group by t.Manager_ID
having COUNT(t.Employee_ID) > 6

--Таблица Employees. Показать всех сотрудников которые ни кому не подчиняются
SELECT t.* FROM Employees t LEFT JOIN Employees e ON t.Manager_ID=e.Employee_ID WHERE e.First_Name is NULL


--Таблица Employees, Job_history. В таблице Employee хранятся все сотрудники. В таблице Job_history хранятся сотрудники которые покинули компанию. Получить репорт о всех сотрудниках и о его статусе в компании (Работает или покинул компанию с датой ухода)
select Employees.Employee_ID, Job_History.End_Date from Employees
left join Job_History on Employees.Employee_ID = Job_History.Employee_ID

--Таблица Employees, Departaments, Locations, Countries, Regions. Получить список сотрудников которые живут в Europe (region_name)
Select e.* FROM Employees e JOIN Departments d on d.Department_ID=e.Department_ID
JOIN Locations l ON d.Location_ID=l.Location_ID
JOIN Countries c ON l.Country_ID=c.Country_ID
JOIN Regions r ON r.Region_ID=c.Region_ID
WHERE r.Region_Name LIKE 'Europe'

-- Таблица Employees, Departments. Показать все департаменты в которых работают больше 30ти сотрудников
select Departments.Department_ID, COUNT(Employees.Employee_ID) from Departments
join Employees on Departments.Department_ID = Employees.Department_ID
group by Departments.Department_ID
having COUNT(Employees.Employee_ID) > 30

--Таблица Employees, Departaments. Показать всех сотрудников которые не состоят ни в одном департаменте
SELECT e.* FROM Employees e LEFT JOIN Departments d ON d.Department_ID=e.Department_ID
WHERE d.Department_Name is null

--Таблица Employees, Departaments. Показать все департаменты в которых нет ни одного сотрудника
select Departments.Department_ID, COUNT(Employees.Employee_ID) from Departments
left join Employees on Departments.Department_ID = Employees.Department_ID
group by Departments.Department_ID
having COUNT(Employees.Employee_ID) = 0

--Таблица Employees. Показать всех сотрудников у которых нет ни кого в подчинении
SELECT m.* FROM Employees e RIGHT JOIN Employees m on m.Employee_ID=e.Manager_ID WHERE e.Last_Name is null

--Таблица Employees. Получить список сотрудников менеджеры которых устроились на работу в 2005ом году но при это сами эти работники устроились на работу до 2005 года
SELECT e.* FROM Employees e
left JOIN Employees m ON e.Manager_ID=m.Employee_ID
WHERE YEAR(e.Hire_Date)<2005 AND YEAR(m.Hire_Date)=2005

--Таблица Employees. Получить список сотрудников менеджеры которых устроились на работу в январе месяце любого года и длина job_title этих сотрудников больше 15ти символов
SELECT e.* FROM Employees e
JOIN Employees m ON e.Manager_ID=m.Employee_ID
JOIN Jobs j ON e.Job_ID=j.Job_ID
WHERE LEN(j.Job_Title)>15 AND MONTH(m.Hire_Date)=1

--Таблица Employees. Получить список сотрудников с самым длинным именем.
select * from Employees WHERE First_Name = (select top 1 First_Name from Employees group by First_Name order by len(First_Name) desc)

--Таблица Employees. Получить список сотрудников с зарплатой большей средней зарплаты всех сотрудников.
SELECT * FROM Employees WHERE Salary>(SELECT AVG(Salary) FROM Employees)

--Таблица Employees, Departments, Locations. Получить город в котором сотрудники в сумме зарабатывают меньше всех.
select top 1 Locations.City, SUM(Employees.Salary) from Locations join Departments on Locations.Location_ID = Departments.Location_ID
join Employees on Employees.Department_ID = Departments.Department_ID
group by Locations.City order by SUM(Employees.Salary) asc


--Таблица Employees. Получить список сотрудников у которых менеджер получает зарплату больше 15000.
SELECT * FROM Employees WHERE Manager_ID in (SELECT e.Employee_ID FROM Employees e WHERE e.Salary>15000)

--Таблица Employees, Departaments. Показать все департаменты в которых нет ни одного сотрудника
select * from Departments left join Employees on Departments.Department_ID = Employees.Department_ID
where Employees.Employee_ID is null

--Таблица Employees. Показать всех сотрудников которые не являются менеджерами
SELECT * FROM Employees WHERE Employee_ID NOT IN (SELECT e.Manager_ID FROM Employees e)

--Таблица Employees. Показать всех менеджеров которые имеют в подчинении больше 6ти сотрудников
SELECT t.Manager_ID, COUNT(t.Employee_ID) FROM Employees t LEFT JOIN Employees e ON t.Manager_ID=e.Employee_ID
group by t.Manager_ID
having COUNT(t.Employee_ID) > 6

--Таблица Employees, Departaments. Показать сотрудников которые работают в департаменте IT
SELECT * FROM Employees WHERE Department_ID in (SELECT d.Department_ID FROM Departments d WHERE Department_Name LIKE 'IT')

--Таблица Employees, Jobs, Departaments. Показать сотрудников в формате: First_name, Job_title, Department_name
select First_Name, Job_Title, Department_Name from Employees
join Jobs on Employees.Job_ID = Jobs.Job_ID
join Departments on Departments.Department_ID = Employees.Department_ID

--Таблица Employees. Получить список сотрудников менеджеры которых устроились на работу в 2005ом году но при это сами эти работники устроились на работу до 2005 года
SELECT * FROM Employees WHERE YEAR(Hire_Date)<2005 and
Manager_ID in (SELECT m.Employee_ID FROM Employees m WHERE YEAR(Hire_Date)=2005)

--Таблица Employees. Получить список сотрудников менеджеры которых устроились на работу в январе месяце любого года и длина job_title этих сотрудников больше 15ти символов
select * from Employees
as T join Jobs on Jobs.Job_ID = T.Job_ID
where MONTH((select Hire_Date from Employees where Employee_ID = T.Manager_ID)) = 1 and len(Jobs.Job_Title) > 15




