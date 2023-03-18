use L4;
go;
-- скалярная функция, возвращающая количество завершенных задач за определенный период по выбранному сотруднику;
drop function if exists dbo.getTaskCount;
go;
CREATE FUNCTION dbo.getTaskCount(@UserId int, @DateStart date, @DateEnd date)
    RETURNS int
AS
BEGIN
    DECLARE @ret int;
    SELECT @ret = count(*)
    FROM L4.dbo.Tasks T
    WHERE T.assignee = @UserId
      AND T.end_date is not null
      and T.end_date between @DateStart and @DateEnd
    IF (@ret IS NULL)
        SET @ret = 0;
    RETURN @ret;
END;
go;

SELECT dbo.getTaskCount(8, '05-10-2015', '10-12-2022')

-- табличная функция, возвращающая информацию о сотрудниках, которые должны были закрыть задачи до заданной даты.
drop function if exists dbo.getUsersAndTasks;
go;
CREATE FUNCTION dbo.getUsersAndTasks(@Date date)
    RETURNS table
        AS
        return
            (
                select U.id       as userId,
                       T.id       as taskId,
                       T.end_date as task_end_date,
                       T.name     as task_name,
                       U.nickname as user_nickname
                FROM L4.dbo.Tasks T
                         join L4.dbo.Users U on U.id = T.assignee
                WHERE T.end_date is not null
                  and T.end_date < @Date
            )
go;

-- процедура создания задачи
drop procedure if exists dbo.createTask;
go;

CREATE PROCEDURE dbo.createTask(@ProjectId int, @DateStart date, @DateEnd date, @Name nvarchar(120),
                                @Description nvarchar(max), @Parent_id int, @Assignee int, @Author int, @Sprint_id int)
AS
BEGIN
    insert into L4.dbo.Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id,
                             assignee, author)
    values (@Name, @Description, 0, @DateStart, @DateEnd, @Parent_id, @ProjectId, 1, @Assignee, @Author)
    if (NOT Exists(select top 1 id from Sprints where id = @Sprint_id))
        BEGIN
            SET IDENTITY_INSERT Sprints ON insert into Sprints(id, started_at) values (@Sprint_id, @DateStart)
            SET IDENTITY_INSERT Sprints OFF
        END

    insert into Sprint_Tasks(sprint_id, task_id) values (@Sprint_id, (select max(id) from Tasks))
END;
go;

declare @now date;
set @now = getdate();
exec dbo.createTask @ProjectId = 1, @DateStart = @now, @DateEnd = null, @Name = 'test', @Description = 'test test',
     @Parent_id = null, @Assignee = 8, @Author = 2, @Sprint_id = 1984;
select *
from Sprint_Tasks
where sprint_id = 1984
go;

--процедура, возвращающая информацию о задачах, выполнение которых не уложилось в сроки спринта
drop procedure if exists dbo.getExpiredTasks;
go;

CREATE PROCEDURE dbo.getExpiredTasks
AS
BEGIN
    with Test(sprint_release_tag, task_name, task_end_date, sprint_end_date)
             as (select S.release_tag as sprint_release_tag,
                        T.name        as task_name,
                        T.end_date    as task_end_date,
                        S.ended_at    as sprint_end_date
                 from Sprints S
                          join Sprint_Tasks ST on S.id = ST.sprint_id
                          join Tasks T on ST.task_id = T.id
                 where T.end_date > S.ended_at
                    or (T.end_date is NULL and S.ended_at is not null))
    select *
    from Test
    union
    select concat('Total tags ', count(distinct sprint_release_tag)) as sprint_release_tag,
           concat('Total tasks ', count(sprint_release_tag))         as task_name,
           null,
           null
    from Test
    group by sprint_release_tag
    with rollup
END;
go;

exec dbo.getExpiredTasks
go;
