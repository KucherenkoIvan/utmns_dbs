use master;
go;

drop database if exists L3;
go;

create database L3;
go;

use L3;
go;

drop table if exists Positions;
create table Positions
(
    id   int          not null identity (1, 1) primary key,
    name nvarchar(30) not null unique
);
go;

drop table if exists Users;
create table Users
(
    id          int         not null identity (1, 1) primary key,
    email       varchar(50) not null unique,
    nickname    varchar(50) not null unique,

    position_id int         not null references Positions (id)
);
go;

drop table if exists TaskStatuses;
create table TaskStatuses
(
    id   int         not null primary key,
    name varchar(20) not null
);
go;

drop table if exists Tasks;
create table Tasks
(
    id          int           not null identity (1, 1) primary key,
    name        nvarchar(120) not null,
    description nvarchar(max),
    approve     bit,
    time_spent  bigint,

    status_id   int references TaskStatuses (id),
    assignee    int           not null references Users (id),
    author      int           not null references Users (id)
);
go;

drop table if exists TaskComments;
create table TaskComments
(
    id      int           not null identity (1, 1) primary key,
    content nvarchar(240) not null,

    author  int           not null references Users (id),
    task_id int           not null references Tasks (id)
)

drop table if exists Sprints;
create table Sprints
(
    id          int         not null identity (1, 1) primary key,
    started_at  date        not null default getdate(),
    release_tag varchar(25) not null,
    ended_at    date
);
go;

drop table if exists Sprint_Tasks;
create table Sprint_Tasks
(
    sprint_id int not null references Sprints (id),
    task_id   int not null references Tasks (id),

    primary key (sprint_id, task_id)
);
go;

-- TODO: Зыков просил добавить фичу с проектами, ответственных по задачам, связать пользователей с Positions через M:N
--       и добавить фактическую дату старта / окончания в спринты и задачи
