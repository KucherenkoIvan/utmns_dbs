use L5;
go;
-- 1. при создании подзадачи автоматически копировать часть инфы из родителя
drop trigger if exists subtask_trigger;
go;

create trigger subtask_trigger
    on Tasks
    after insert
    as
    update Tasks
    set description = (select description from Tasks where id = (select parent_id from inserted))
    where id = (select id from inserted)
go;


insert into Tasks(name, status_id, assignee, author, parent_id, project_id)
values ('trigger test', 3, 2, 1, 1, 1);

select description
from Tasks
where name = 'trigger test';

go;

-- 2. запретить изменение статуса на done если есть не завершенные подзадачи
drop trigger if exists restrict_task_status_update;
go;

create trigger restrict_task_status_update
    on Tasks
    instead of update as
begin
    if exists(select I.id as isid
              from inserted I
                       join Tasks T on I.parent_id = T.id
              where T.status_id <> 6
                and I.status_id = 6)
        throw 50001, 'ban subtask', 1
    else
        MERGE Tasks AS T
        USING (SELECT * FROM INSERTED) AS I
        ON T.ID = I.ID
        WHEN MATCHED THEN
            UPDATE
            SET T.description = I.description,
                T.parent_id   = I.parent_id,
                T.status_id   = I.status_id,
                T.project_id  = I.project_id,
                T.assignee    = I.assignee,
                T.author      = I.author,
                T.end_date    = I.end_date,
                T.name        = I.name,
                T.start_date  = I.start_date,
                T.time_spent  = I.time_spent;
end
go;

update Tasks
set status_id = 4
where id = 1;

update Tasks
set status_id = 5
where id = (select top 1 id from Tasks where parent_id = 1);

begin try
    update Tasks
    set status_id = 6
    where parent_id = 1;
end try
begin catch
    print (@@ERROR)
end catch
go;

select status_id
from Tasks
where parent_id = 1;

go;

-- 3. после изменения части инфы в родительской таске менять ее в дочерней
drop trigger if exists subtask_update_author;
go;

create trigger subtask_update_author
    on Tasks
    after update
    as
    update Tasks
    set author = (select author from Tasks where id = (select id from inserted))
    where parent_id = (select id from inserted)
go;

-- 4. валидация email через триггер
drop trigger if exists restrict_email;
go;

create trigger restrict_email
    on Users
    instead of update as
begin
    if exists(select * from inserted where inserted.email not like '%@%.%')
        throw 50001, 'ban wrong email', 1
    else
        MERGE Users AS U
        USING (SELECT * FROM INSERTED) AS I
        ON U.ID = I.ID
        WHEN MATCHED THEN
            UPDATE
            SET U.email       = I.email,
                U.nickname    = I.nickname,
                U.position_id = I.position_id;
end
go;

update Users
set email = 'valid@email.com'
where id = 1;

begin try
    update Users
    set email = 'invalid email'
    where id = 1;
end try
begin catch
    print (@@ERROR)
end catch
go;

select email
from Users
where id = 1;
go;

-- 5. триггер на работу со схемой. Выводи ивент, дату, имя пользователя, ip пользователя, хостнейм пользователя
drop table if exists log_table_ddl
go;

create table log_table_ddl
(
    LogId        int identity (1,1) primary key,
    EventName    xml          not null,
    EventDate    datetime     not null,
    Userr        sysname      not null,
    IpAddr       varchar(48)  not null,
    UserHostname varchar(256) not null
)
go;

drop trigger if exists database_logging_trigger on database;
go;

create trigger database_logging_trigger on database
    for create_table, alter_table, drop_table
    as
begin
    set nocount on;
    insert into log_table_ddl (EventName, EventDate, Userr, IpAddr, UserHostname)
    values (eventdata(), getdate(), user, convert(varchar(48), connectionproperty('client_net_address')), HOST_NAME());
end;
go;

select *
from log_table_ddl;
go;

drop table if exists test_tbl;
go;

create table test_tbl
(
    id int not null primary key
)
go;

alter table test_tbl
    add var varchar(200);
go;

drop table test_tbl;
go;

select *
from log_table_ddl;
go;

-- 6. при изменении time_spent в подзадаче прибавлять его к total_time_spent в родителе
drop trigger if exists add_time_spent;
go;

create trigger add_time_spent
    on Tasks
    after update as
begin
    if exists(select *
              from inserted i
                       join deleted d on i.id = d.id
              where i.parent_id is not null
                and i.time_spent <> d.time_spent)
        MERGE Tasks AS T
        USING (SELECT I.parent_id, sum(I.time_spent) - sum(D.time_spent) as time_spent
               FROM INSERTED I
                        join deleted D on I.id = D.id
               group by I.parent_id) AS I
        ON T.ID = I.parent_id
        WHEN MATCHED THEN
            UPDATE
            SET T.time_spent += I.time_spent;
end;
go;

select time_spent
from Tasks
where id = 1;
go;

update Tasks
set time_spent += 1
where id = (select top 1 id from Tasks where parent_id = 1);

select time_spent
from Tasks
where parent_id = 1;
