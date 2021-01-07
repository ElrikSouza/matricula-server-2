create table user_account(
    _id serial primary key,
    student_id int unique not null references student(_id) on delete cascade,
    email varchar(254) unique,
    password char(60)
);

create table student(
    _id serial primary key,
    name varchar(70) not null
);

create table student_verification_code(
    _id serial primary key,
    student_id int not null references student(_id) on delete cascade,
    code char(6) not null,
    expiration_date not null timestamptz
);

create table course(
    code char(6) primary key,
    name varchar(70)
);

create table course_prerequisite (
    _id serial primary key,
    course_code char(6) not null references course(code) on delete cascade,
    prerequisite_code char(6) not null references course(code) on delete cascade
);

create table student_course_record(
    _id serial primary key,
    student_id int not null references student(_id) on delete cascade,
    course_code char(6) not null references course(code) on delete cascade
);

create unique index student_course_record_index on student_course_record(student_id, course_code);

create table enrollment_request(
    _id serial primary key,
    student_id int not null references student(_id) on delete cascade,
    course_code char(6) not null references course(code) on delete cascade,
    created_at timestamptz not null default now()
);

create unique index enrollment_request_index on enrollment_request(student_id, course_code);