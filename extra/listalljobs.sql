use Extra;
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
select count(*) as tasks_lengt
from Tasks;

insert into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
                  author)
values ('insertion test 1', 'тестим вставку в таблицу с задачами', 0, GETDATE(), null, null, 1, 1, 1, 1)

insert into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
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
select count(*) as tasks_lengt
from Tasks;

exec copy_data

select count(*) as summary_lengt
from Summary;
select count(*) as tasks_lengt
from Tasks;

-- тут мы показали что всё работает и не копируется ничего лишнего
-- создаем джобу
USE msdb;
-- EXEC sp_delete_job
--      @job_name = N'Archive tasks every minute';
GO
EXEC msdb.dbo.sp_add_job
     @job_name = N'Archive tasks every minute';
GO
EXEC sp_add_jobstep
     @job_name = N'Archive tasks every minute',
     @step_name = N'Copy',
     @subsystem = N'TSQL',
     @command = N'exec Extra.dbo.copy_data',
     @retry_attempts = 5,
     @retry_interval = 5;
GO

-- создаем Расписание
select *
from sysjobs
go
exec sp_delete_jobschedule
     @job_name = N'Archive tasks every minute',
     @name = N'RunEveryMinute';
GO
EXEC dbo.sp_add_schedule
     @schedule_name = N'RunEveryMinute',
     @freq_type = 128,
     @freq_subday_type = 0x4, -- minutes
     @freq_subday_interval = 1;
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
-- ...

    select
       S.name AS JobName,
       S.*,
       SS.name AS ScheduleName,
       CASE(SS.freq_type)
            WHEN 1  THEN 'Once'
            WHEN 4  THEN 'Daily'
            WHEN 8  THEN (case when (SS.freq_recurrence_factor > 1) then  'Every ' + convert(varchar(3),SS.freq_recurrence_factor) + ' Weeks'  else 'Weekly'  end)
            WHEN 16 THEN (case when (SS.freq_recurrence_factor > 1) then  'Every ' + convert(varchar(3),SS.freq_recurrence_factor) + ' Months' else 'Monthly' end)
            WHEN 32 THEN 'Every ' + convert(varchar(3),SS.freq_recurrence_factor) + ' Months' -- RELATIVE
            WHEN 64 THEN 'SQL Startup'
            WHEN 128 THEN 'SQL Idle'
            ELSE '??'
        END AS Frequency,
       CASE
            WHEN (freq_type = 1)                       then 'One time only'
            WHEN (freq_type = 4 and freq_interval = 1) then 'Every Day'
            WHEN (freq_type = 4 and freq_interval > 1) then 'Every ' + convert(varchar(10),freq_interval) + ' Days'
            WHEN (freq_type = 8) then (select 'Weekly Schedule' = MIN(D1+ D2+D3+D4+D5+D6+D7 )
                                        from (select SS.schedule_id,
                                                        freq_interval,
                                                        'D1' = CASE WHEN (freq_interval & 1  <> 0) then 'Sun ' ELSE '' END,
                                                        'D2' = CASE WHEN (freq_interval & 2  <> 0) then 'Mon '  ELSE '' END,
                                                        'D3' = CASE WHEN (freq_interval & 4  <> 0) then 'Tue '  ELSE '' END,
                                                        'D4' = CASE WHEN (freq_interval & 8  <> 0) then 'Wed '  ELSE '' END,
                                                    'D5' = CASE WHEN (freq_interval & 16 <> 0) then 'Thu '  ELSE '' END,
                                                        'D6' = CASE WHEN (freq_interval & 32 <> 0) then 'Fri '  ELSE '' END,
                                                        'D7' = CASE WHEN (freq_interval & 64 <> 0) then 'Sat '  ELSE '' END
                                                    from msdb..sysschedules ss
                                                where freq_type = 8
                                            ) as F
                                        where schedule_id = SJ.schedule_id
                                    )
            WHEN (freq_type = 16) then 'Day ' + convert(varchar(2),freq_interval)
            WHEN (freq_type = 32) then (select  freq_rel + WDAY
                                        from (select SS.schedule_id,
                                                        'freq_rel' = CASE(freq_relative_interval)
                                                                    WHEN 1 then 'First'
                                                                    WHEN 2 then 'Second'
                                                                    WHEN 4 then 'Third'
                                                                    WHEN 8 then 'Fourth'
                                                                    WHEN 16 then 'Last'
                                                                    ELSE '??'
                                                                    END,
                                                    'WDAY'     = CASE (freq_interval)
                                                                    WHEN 1 then ' Sun'
                                                                    WHEN 2 then ' Mon'
                                                                    WHEN 3 then ' Tue'
                                                                    WHEN 4 then ' Wed'
                                                                    WHEN 5 then ' Thu'
                                                                    WHEN 6 then ' Fri'
                                                                    WHEN 7 then ' Sat'
                                                                    WHEN 8 then ' Day'
                                                                    WHEN 9 then ' Weekday'
                                                                    WHEN 10 then ' Weekend'
                                                                    ELSE '??'
                                                                    END
                                                from msdb..sysschedules SS
                                                where SS.freq_type = 32
                                                ) as WS
                                        where WS.schedule_id = SS.schedule_id
                                        )
        END AS Interval,
        CASE (freq_subday_type)
            WHEN 1 then   left(stuff((stuff((replicate('0', 6 - len(active_start_time)))+ convert(varchar(6),active_start_time),3,0,':')),6,0,':'),8)
            WHEN 2 then 'Every ' + convert(varchar(10),freq_subday_interval) + ' seconds'
            WHEN 4 then 'Every ' + convert(varchar(10),freq_subday_interval) + ' minutes'
            WHEN 8 then 'Every ' + convert(varchar(10),freq_subday_interval) + ' hours'
            ELSE '??'
        END AS [Time],
        CASE SJ.next_run_date
            WHEN 0 THEN cast('n/a' as char(10))
            ELSE convert(char(10), convert(datetime, convert(char(8),SJ.next_run_date)),120)  + ' ' + left(stuff((stuff((replicate('0', 6 - len(next_run_time)))+ convert(varchar(6),next_run_time),3,0,':')),6,0,':'),8)
        END AS NextRunTime
from msdb.dbo.sysjobs S
left join msdb.dbo.sysjobschedules SJ on S.job_id = SJ.job_id
left join msdb.dbo.sysschedules SS on SS.schedule_id = SJ.schedule_id
order by S.name
