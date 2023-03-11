use L3;
go;

drop view if exists profiles;
go;
create view profiles as
select nickname, name as position
from Users
         join Positions on Users.position_id = Positions.id
go;

select *
from profiles;
go;

drop view if exists comments;
go;
create view comments as
select TaskComments.author as author, T.name as subject, TaskComments.content as comment
from TaskComments
         join Tasks T on TaskComments.task_id = T.id;
go;

select *
from comments;
go;

drop view if exists sprint_completion;
go;
create view sprint_completion as
select sprint_id,
       release_tag,
       concat(round(((select count(task_id)
                      from Tasks
                               join Sprint_Tasks on Tasks.id = Sprint_Tasks.task_id
                      where status_id = 6
                        and sprint_id = Sprints.id) / cast(count(task_id) as float)) * 100, 2), '%') as completion_pct
from Sprints
         join Sprint_Tasks on Sprints.id = Sprint_Tasks.sprint_id
group by release_tag, sprint_id, Sprints.id
go;

select *
from sprint_completion;
go;

drop view if exists best_sprints;
go;
create view best_sprints as
select top 10 started_at,
              ended_at,
              completion_pct
from sprint_completion
         join Sprints on Sprints.id = sprint_id
order by completion_pct desc
go;

select *
from best_sprints;
go;

alter view profiles as
    select nickname, name as position, email
    from Users
             join Positions on Users.position_id = Positions.id
go;

select *
from profiles;
go;

drop view comments;
go;

drop view if exists assigners;
go;
create view assigners as
select distinct author as userId
from Tasks;
go;

select *
from assigners;
go;

drop view if exists assignees;
go;
create view assignees as
select distinct assignee as userId
from Tasks;
go;

select *
from assignees;
go;

drop view if exists users_from_tasks;
go;
create view users_from_tasks as
select *
from (select userId
      from assigners
      union
      select userId
      from assignees) T
         join Users on T.userId = Users.id
go;

select *
from users_from_tasks;
go;

drop view if exists assigners_only;
go;
create view assigners_only as
select *
from (select userId from assigners except select userId from assignees) T
         join Users on userId = Users.id;
go;

select *
from assigners_only;
go;

drop view if exists assignees_only;
go;
create view assignees_only as
select *
from (select userId from assignees except select userId from assigners) T
         join Users on userId = Users.id;
go;

select *
from assignees_only;
go;

drop view if exists both_assigners_and_assignees;
go;
create view both_assigners_and_assignees as
select *
from (select userId from assigners intersect select userId from assignees) T
         join Users on userId = Users.id;
go;

select *
from both_assigners_and_assignees;
go;
