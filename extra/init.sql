use master;
go;

drop database if exists Extra;
go;

create database Extra;
go;

use Extra;
go;

drop table if exists Positions;
create table Positions
(
    id   int          not null identity (1, 1) primary key,
    name nvarchar(30) not null unique
);
go;

drop table if exists ProjectRoles;
create table ProjectRoles
(
    id   int          not null identity (1, 1) primary key,
    name nvarchar(30) not null unique
);
go;

drop table if exists Projects;
create table Projects
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

drop table if exists ProjectParticipants;
create table ProjectParticipants
(
    project_id int not null references Projects (id),
    user_id    int not null references Users (id),
    role_id    int not null references ProjectRoles (id),
    primary key (project_id, user_id, role_id)
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
    time_spent  bigint,
    start_date  date,
    end_date    date,

    parent_id   int references Tasks (id),
    project_id  int           not null references Projects (id),
    status_id   int references TaskStatuses (id),
    assignee    int           not null references Users (id),
    author      int           not null references Users (id),
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
    release_tag varchar(25),
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
