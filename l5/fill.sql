use L5;
go;

SET IDENTITY_INSERT Positions ON
insert into Positions(id, name)
values (1, 'CEO'),
       (2, 'CTO'),
       (3, 'Team Lead'),
       (4, 'Dev'),
       (5, 'QA'),
       (6, 'DevOps')
SET IDENTITY_INSERT Positions OFF
go;

SET IDENTITY_INSERT ProjectRoles ON
insert into ProjectRoles(id, name)
values (1, 'Owner'),
       (2, 'Maintainer'),
       (3, 'Collaborator')
SET IDENTITY_INSERT ProjectRoles OFF
go;

SET IDENTITY_INSERT Projects ON
insert into Projects(id, name)
values (1, 'Main Project')
SET IDENTITY_INSERT Projects OFF
go;

SET IDENTITY_INSERT Users ON
insert into Users(id, email, nickname, position_id)
values (1, 'ceo@email.com', 'im_a_ceo', 1),
       (2, 'cto@email.com', 'tech_nerd', 2),

       (3, 'lead_dev@email.com', 'lead_dev', 3),
       (4, 'lead_qa@email.com', 'lead_qa', 3),
       (5, 'lead_devops@email.com', 'lead_devops', 3),

       (6, 'dev1@email.com', 'dev1', 4),
       (7, 'dev2@email.com', 'dev2', 4),
       (8, 'dev3@email.com', 'dev3', 4),
       (9, 'dev4@email.com', 'dev4', 4),
       (10, 'dev5@email.com', 'dev5', 4),
       (11, 'qa1@email.com', 'qa1', 5),
       (12, 'qa2@email.com', 'qa2', 5),
       (13, 'devops@email.com', 'devops', 6)
SET IDENTITY_INSERT Users OFF
go;

insert into ProjectParticipants(project_id, user_id, role_id)
values (1, 1, 1),
       (1, 2, 2),
       (1, 3, 2),
       (1, 4, 2),
       (1, 5, 2),
       (1, 6, 3),
       (1, 7, 3),
       (1, 8, 3),
       (1, 9, 3),
       (1, 10, 3),
       (1, 11, 3),
       (1, 12, 3),
       (1, 13, 3)
go;

insert into TaskStatuses(id, name)
values (1, 'backlog'),
       (2, 'todo'),
       (3, 'in progress'),
       (4, 'review'),
       (5, 'testing'),
       (6, 'done')
go;

insert into Tasks(name, description, time_spent, status_id, assignee, author, project_id)
select concat('test_task_name ', u1.id, u2.id, u3.id)                                         as name,
       concat('some description idk ', u1.id, u2.id, u3.id)                                   as description,
       cast(round(rand(u1.id * 10000 + u2.id * 10000 + u3.id) * 1000 * 60 * 12, 0) as bigint) as time_spent,
       (round(rand(u2.id * 10000 + u2.id * 10000 + u3.id * u3.id) * 5, 0)) + 1                as status_id,
       (round(rand(u1.id * 10000 - u3.id) * 11, 0)) + 3                                       as assignee,
       (round(rand(u2.id * 10000 - u3.id) * 4, 0)) + 1                                        as author,
       1                                                                                      as project_id
from Users u1
         cross join Users u2
         cross join Users u3
go;

with Temp(num, curr, prev) as (select row_number() over (order by u1.id + u2.id) as num,
                                      dateadd(month, row_number() over (order by u1.id + u2.id) + 1,
                                              cast('1-01-2009' as date))         as curr,
                                      dateadd(month, row_number() over (order by u1.id + u2.id),
                                              cast('1-01-2009' as date))         as prev
                               from Users u1
                                        cross join Users u2)
insert
into Sprints(started_at, ended_at, release_tag)
select cast(prev as date) as started_at, cast(curr as date) as ended_at, concat('#release_', num) as release_tag
from Temp
go;

insert into Sprint_Tasks(sprint_id, task_id)
select (cast((Tasks.id + (round(rand(Tasks.id * 531) * 100, 0))) as int) % (select count(*) from Sprints)) +
       1        as sprint_id,
       Tasks.id as task_id
from Tasks
go;

insert into TaskComments(content, author, task_id)
select 'test comment' as comment, greatest(author, assignee) as author, id as task_id
from Tasks
go;


insert into Tasks(name, description, time_spent, start_date, end_date, parent_id, project_id, status_id, assignee,
                  author) values ('subtask', 'subtask for task 1', 0, GETDATE(), null, 1, 1, 1, 1, 1)
go;

