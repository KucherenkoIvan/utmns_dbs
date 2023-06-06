use
    Extra;
go;

-- 0. Создаем таблицу с итогами
drop table if exists Summary;
go;

create table Summary
(
    id                     int not null identity (1, 1) primary key,

    task_id                int,
    task_name              nvarchar(120),
    task_description       nvarchar(max),
    task_time_spent        bigint,
    task_start_date        date,
    task_end_date          date,

    task_parent_id         int,

    project_name           nvarchar(30),
    status_name            varchar(20),

    assignee_email         varchar(50),
    assignee_name          varchar(50),
    assignee_position_name nvarchar(30),

    author_email           varchar(50),
    author_name            varchar(50),
    author_position_name   nvarchar(30),
)
go;
-- 1. Процедура для копирования, запускаемая по расписанию
drop procedure if exists copy_data;
go;

create procedure copy_data as
begin
    insert into Summary(task_id, task_name, task_description, task_time_spent, task_start_date, task_end_date,
                        task_parent_id, project_name, status_name, assignee_email, assignee_name,
                        assignee_position_name,
                        author_email, author_name, author_position_name)
    select T.id,
           T.name,
           T.description,
           T.time_spent,
           T.start_date,
           T.end_date,
           T.parent_id,
           PR.name,
           TS.name,
           ASS.email,
           ASS.nickname,
           PASS.name,
           AUT.email,
           AUT.nickname,
           PAUT.name
    from Tasks T
             join Projects PR on T.project_id = PR.id
             join TaskStatuses TS on T.status_id = TS.id
             join Users ASS on T.assignee = ASS.id
             join Positions PASS on PASS.id = ASS.position_id
             join Users AUT on T.author = AUT.id
             join Positions PAUT on PAUT.id = AUT.position_id
    where T.id > (select COALESCE(max(task_id), 0) from Summary)
end
go;

exec copy_data

select count(*) as summary_lengt
from Summary;
select count(*) as tasks_length
from Tasks;

insert into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
                  author)
values ('insertion test 1', 'тестим вставку в таблицу с задачами', 0, GETDATE(), null, null, 1, 1, 1, 1)
insert
into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
           author)
values ('insertion test 2', 'тестим вставку в таблицу с задачами', 0, GETDATE(), null, null, 1, 1, 1, 1)

insert into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
                  author)
values ('insertion test 3', 'тестим вставку в таблицу с задачами', 0, GETDATE(), null, null, 1, 1, 1, 1)

insert into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
                  author)
values ('insertion test 4', 'тестим вставку в таблицу с задачами', 0, GETDATE(), null, null, 1, 1, 1, 1)

select count(*) as summary_lengt
from Summary;
select count(*) as tasks_length
from Tasks;

exec copy_data

select count(*) as summary_lengt
from Summary;
select count(*) as tasks_length
from Tasks;

-- тут мы показали что всё работает и не копируется ничего лишнего
-- создаем джобу
USE
    msdb;
declare
    @c int = (select count(*)
              from sysjobs
              where name = 'Archive tasks every minute')
if @c <> 0
    begin
        EXEC sp_delete_job
             @job_name = N'Archive tasks every minute';
    end

EXEC msdb.dbo.sp_add_job
     @job_name = N'Archive tasks every minute';
GO

EXEC sp_add_jobstep
     @job_name = N'Archive tasks every minute',
     @step_name = N'Copy',
     @subsystem = N'TSQL',
     @command = N'exec Extra.dbo.copy_data',
     @database_name=N'Extra',
     @retry_attempts = 5,
     @retry_interval = 5;
GO

-- создаем Расписание
-- select *
-- from sysschedules
go
-- select name, schedule_uid from sysschedules where name = 'RunEveryMinute'
-- go
-- exec sp_delete_schedule
--      @schedule_id = N'RunEveryMinute';
-- GO
declare
    @c int = (select count(*)
              from sysschedules
              where name = 'RunEveryMinute')
if @c = 0
    begin
        EXEC dbo.sp_add_schedule
             @schedule_name = N'RunEveryMinute',
             @freq_type=4,
             @freq_interval=1,
             @freq_subday_type = 0x4, -- minutes
             @freq_subday_interval = 1;
    end
GO
-- Прикрепляем джобу к расписанию
EXEC sp_attach_schedule
     @job_name = N'Archive tasks every minute',
     @schedule_name = N'RunEveryMinute';
GO
-- запускаем
EXEC dbo.sp_add_jobserver
     @job_name = N'Archive tasks every minute';
GO

EXEC dbo.sp_start_job
     @job_name = N'Archive tasks every minute';
GO

-- EXEC dbo.sp_help_jobhistory
--     @job_name = N'Archive tasks every minute'

-- https://studfile.net/preview/16420327/
-- Создать хранимую процедуру, выполняющую [действия]

use Extra;
go;

drop procedure if exists TEST_INSERT_SPEED;
go;

CREATE PROCEDURE TEST_INSERT_SPEED @records_count INT,
                                   @use_autocommit INT,
                                   @total_time TIME OUTPUT
AS
BEGIN
    DECLARE
        @counter INT = 0;
    DECLARE
        @old_autocommit INT = 0;
    DECLARE
        @start_time TIME;
    DECLARE
        @finish_time TIME;

    IF
        (@@TRANCOUNT = 0 AND (@@OPTIONS & 2 = 0))
        BEGIN
            PRINT
                'IMPLICIT_TRANSACTIONS = OFF, no transaction is running.';
            SET
                @old_autocommit = 1;
        END
    ELSE
        IF (@@TRANCOUNT = 0 AND (@@OPTIONS & 2 = 2))
            BEGIN
                PRINT
                    'IMPLICIT_TRANSACTIONS = ON, no transaction is running.';
                SET
                    @old_autocommit = 0;
            END
        ELSE
            IF (@@OPTIONS & 2 = 0)
                BEGIN
                    PRINT
                        'IMPLICIT_TRANSACTIONS = OFF, explicit transaction is running.';
                    SET
                        @old_autocommit = 1;
                END
            ELSE
                BEGIN
                    PRINT
                        'IMPLICIT_TRANSACTIONS = ON, implicit or explicit transaction
                         is running.';
                    SET
                        @old_autocommit = 0;
                END;
    PRINT
        CONCAT('Old autocommit value = ', @old_autocommit);
    PRINT
        CONCAT('New autocommit value = ', @use_autocommit);
    IF
        (@use_autocommit != @old_autocommit)
        BEGIN
            PRINT
                CONCAT('Switching autocommit to ', @use_autocommit);
            IF
                (@use_autocommit = 1)
                SET IMPLICIT_TRANSACTIONS OFF;
            ELSE
                SET IMPLICIT_TRANSACTIONS ON;
        END
    ELSE
        PRINT 'No changes in autocommit mode needed.';
    PRINT
        CONCAT('Starting insert of ', @records_count, ' records...');
    SET
        @start_time = GETDATE();
    WHILE (@counter < @records_count)
        BEGIN
            INSERT INTO Users
                (email, nickname, position_id)
            VALUES (CONCAT('n_user_', (@counter + 1) * Rand(), '@email.com'),
                    CONCAT('n_user_', (@counter + 1) * Rand()), 4);
            SET
                @counter = @counter + 1;
        END;
    SET
        @finish_time = GETDATE();
    PRINT
        CONCAT('Finished insert of ', @records_count, ' records...');
    IF
        (@use_autocommit = 0)
        BEGIN
            PRINT
                'Current autocommit mode is 0 (IMPLICIT_TRANSACTIONS = ON).
                 Performing explicit commit.';
            COMMIT;
        END;
    IF
        (@use_autocommit != @old_autocommit)
        BEGIN
            PRINT
                CONCAT('Switching autocommit back to ', @old_autocommit);
            IF
                (@old_autocommit = 1)
                SET IMPLICIT_TRANSACTIONS OFF;
            ELSE
                SET IMPLICIT_TRANSACTIONS ON;
        END
    ELSE
        PRINT 'No changes in autocommit mode needed.';
    SET
        @total_time = CONVERT(VARCHAR(12),
                DATEADD(ms,
                        DATEDIFF(ms, @start_time, @finish_time),
                        0),
                114);
    PRINT
        CONCAT('Time used: ', @total_time);
    RETURN;
END;

go;

DECLARE @t TIME;
SET IMPLICIT_TRANSACTIONS ON
EXECUTE TEST_INSERT_SPEED 100, 1, @t OUTPUT;
PRINT CONCAT('Stored procedure has returned the following value: ', @t);
go;

-- заметно быстрее
DECLARE @t TIME;
SET IMPLICIT_TRANSACTIONS ON
EXECUTE TEST_INSERT_SPEED 100, 0, @t OUTPUT;
PRINT CONCAT('Stored procedure has returned the following value: ', @t);
go;

-- Создание представления, ускоряющего получение всей информации из таблицы в человекочитаемом виде

drop view if exists cache_view;
go;

create view cache_view with schemabinding as
select T.id          as task_id,
       T.name        as task_name,
       T.description as task_description,
       T.time_spent  as time_spent,
       T.start_date  as task_start_date,
       T.end_date    as task_end_date,
       PR.name       as project,
       TS.name       as status,
       U.email       as author_email
from dbo.Tasks T
         join dbo.Projects PR on T.project_id = PR.id
         join dbo.TaskStatuses TS on T.status_id = TS.id
         join dbo.Users U on T.author = U.id
go;

CREATE UNIQUE CLUSTERED INDEX idx_cache_view
    ON cache_view (task_id);
go;

-- сравним - +30%
select *
from cache_view

select T.id          as task_id,
       T.name        as task_name,
       T.description as task_description,
       T.time_spent  as time_spent,
       T.start_date  as task_start_date,
       T.end_date    as task_end_date,
       PR.name       as project,
       TS.name       as status,
       U.email       as author_email
from dbo.Tasks T
         join dbo.Projects PR on T.project_id = PR.id
         join dbo.TaskStatuses TS on T.status_id = TS.id
         join dbo.Users U on T.author = U.id

-- 4. Индексы
-- запрос за задачами пользователя
drop index if exists Tasks.test

DBCC DROPCLEANBUFFERS
GO
DBCC FREEPROCCACHE
GO

declare @me integer = 3
select *
from Tasks
         join Projects on Tasks.project_id = Projects.id
         join ProjectParticipants on Projects.id = ProjectParticipants.project_id and ProjectParticipants.user_id = @me
where assignee = @me
   or author = @me

-------------------------------------------------
go;

DBCC DROPCLEANBUFFERS
GO
DBCC FREEPROCCACHE
GO

create index test on Tasks (author, assignee)

-- запрос за задачами пользователя
declare @me integer = 3
select *
from Tasks
         join Projects on Tasks.project_id = Projects.id
         join ProjectParticipants on Projects.id = ProjectParticipants.project_id and ProjectParticipants.user_id = @me
where assignee = @me
   or author = @me