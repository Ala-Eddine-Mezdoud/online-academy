-- # Schema

-- Function to handle new user signup - creates profile automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role, phone_number, wilaya)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'wilaya'
  );
  return new;
end;
$$;

-- Trigger to auto-create profile on user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Unified profiles table
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role varchar(20) not null check (role in ('admin','teacher','student')),
    phone_number varchar(50),
    wilaya varchar(100),        -- optional, mainly for students
    role_title varchar(255),     -- optional, mainly for teachers
    description text,            -- optional, mainly for teachers
    profile_image varchar(255),  -- optional
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- Teacher links (social / external profiles)
create table if not exists teacher_links (
    id serial primary key,
    teacher_id uuid references profiles(id) on delete cascade,
    platform varchar(100),
    url varchar(255)
);

-- Categories
create table if not exists categories (
    id serial primary key,
    name varchar(255) not null unique,
    description text,
    deleted_at timestamp with time zone
);

-- Courses
create table if not exists courses (
    id serial primary key,
    teacher_id uuid references profiles(id) on delete set null,
    title varchar(255) not null,
    overview text,
    description text,
    category_id int references categories(id) on delete set null,
    num_weeks int default 0,
    price numeric(10,2) default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- Course learnings
create table if not exists course_learnings (
    id serial primary key,
    course_id int references courses(id) on delete cascade,
    content text,
    deleted_at timestamp with time zone
);

-- Course FAQ
create table if not exists course_faq (
    id serial primary key,
    course_id int references courses(id) on delete cascade,
    question text,
    answer text,
    deleted_at timestamp with time zone
);

-- Course syllabus
create table if not exists course_syllabus (
    id serial primary key,
    course_id int references courses(id) on delete cascade,
    week_number int,
    title varchar(255),
    content text,
    deleted_at timestamp with time zone
);

-- Course reviews
create table if not exists course_reviews (
    id serial primary key,
    course_id int references courses(id) on delete cascade,
    student_id uuid references profiles(id) on delete cascade,
    rating smallint check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- Enrollments
create table if not exists enrollments (
    id serial primary key,
    course_id int references courses(id) on delete cascade,
    student_id uuid references profiles(id) on delete cascade,
    enrolled_at timestamp with time zone default now(),
    progress int default 0 check (progress >= 0 and progress <= 100),
    deleted_at timestamp with time zone
);

-- Live sessions
create table if not exists live_sessions (
    id serial primary key,
    course_id int references courses(id) on delete cascade,
    teacher_id uuid references profiles(id) on delete cascade,
    session_link varchar(255),
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    session_title varchar(255),
    deleted_at timestamp with time zone
);

-- Notifications
create table if not exists notifications (
    id serial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    title varchar(255),
    message text,
    is_read boolean default false,
    created_at timestamp with time zone default now()
);

-- Contact messages
create table if not exists contact_messages (
    id serial primary key,
    name varchar(255),
    email varchar(255),
    subject varchar(255),
    message text,
    created_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- # Triggers
-- =========================================
-- Role-enforcement triggers & functions
-- Ensure teacher_id points to a profile.role = 'teacher'
-- and student_id points to profile.role = 'student'
-- =========================================

-- Function to check teacher role
create or replace function check_teacher_role() returns trigger language plpgsql as $$
declare
    var_rol profiles.role%type;
begin
    if new.teacher_id is null then
        return new;
    end if;

    select role into var_rol from profiles where id = new.teacher_id;
    if not found then
        raise exception 'Invalid teacher_id: profile not found (%).', new.teacher_id;
    end if;
    if var_rol is distinct from 'teacher' then
        raise exception 'Invalid teacher_id: profile % does not have role = teacher (role = %).', new.teacher_id, var_rol;
    end if;
    return new;
end;
$$;

-- Function to check student role
create or replace function check_student_role() returns trigger language plpgsql as $$
declare
    var_rol profiles.role%type;
begin
    if new.student_id is null then
        return new;
    end if;

    select role into var_rol from profiles where id = new.student_id;
    if not found then
        raise exception 'Invalid student_id: profile not found (%).', new.student_id;
    end if;
    if var_rol is distinct from 'student' then
        raise exception 'Invalid student_id: profile % does not have role = student (role = %).', new.student_id, var_rol;
    end if;
    return new;
end;
$$;

-- Attach triggers
-- courses.teacher_id must be a teacher
create trigger trg_courses_teacher_check
    before insert or update on courses
    for each row execute function check_teacher_role();

-- live_sessions.teacher_id must be a teacher
create trigger trg_live_sessions_teacher_check
    before insert or update on live_sessions
    for each row execute function check_teacher_role();

-- teacher_links.teacher_id must be a teacher
create trigger trg_teacher_links_teacher_check
    before insert or update on teacher_links
    for each row execute function check_teacher_role();

-- course_reviews.student_id must be a student
create trigger trg_course_reviews_student_check
    before insert or update on course_reviews
    for each row execute function check_student_role();

-- enrollments.student_id must be a student
create trigger trg_enrollments_student_check
    before insert or update on enrollments
    for each row execute function check_student_role();

-- # RLS and Policies

-- ENABLE RLS FOR ALL TABLES
alter table profiles enable row level security;
alter table teacher_links enable row level security;
alter table courses enable row level security;
alter table course_learnings enable row level security;
alter table course_faq enable row level security;
alter table course_syllabus enable row level security;
alter table course_reviews enable row level security;
alter table enrollments enable row level security;
alter table live_sessions enable row level security;
alter table notifications enable row level security;
alter table contact_messages enable row level security;
alter table categories enable row level security;

-- PROFILES *********************************
-- Users can read/update their own profile
create policy "Profiles: select own or admin" on profiles for select
using (auth.uid() = id OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Profiles: update own or admin" on profiles for update
using (auth.uid() = id OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Profiles: insert" on profiles for insert
with check (auth.uid() = id OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));


-- TEACHER LINKS *************************
create policy "TeacherLinks: select own or admin" on teacher_links for select
using (
    teacher_id = auth.uid() OR
    (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
);

create policy "TeacherLinks: insert" on teacher_links for insert
with check (teacher_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "TeacherLinks: update own or admin" on teacher_links for update
using (teacher_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "TeacherLinks: delete own or admin" on teacher_links for delete
using (teacher_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

-- COURSES ************************
create policy "Courses: select students/admin" on courses for select
using (
    (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'student')) OR
    teacher_id = auth.uid() OR
    (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
);

create policy "Courses: insert teacher/admin" on courses for insert
with check (
    teacher_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
);

create policy "Courses: update teacher/admin" on courses for update
using (
    teacher_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
);

create policy "Courses: delete teacher/admin" on courses for delete
using (
    teacher_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
);

-- COURSE LEARNINGS *************************
create policy "CourseLearnings: select all" on course_learnings for select
using (true); -- everyone can read

create policy "CourseLearnings: insert teacher/admin" on course_learnings for insert
with check (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "CourseLearnings: update teacher/admin" on course_learnings for update
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "CourseLearnings: delete teacher/admin" on course_learnings for delete
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

-- COURSE FAQ *********************************
create policy "CourseFAQ: select all" on course_faq for select
using (true);

create policy "CourseFAQ: insert teacher/admin" on course_faq for insert
with check (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "CourseFAQ: updateteacher/admin" on course_faq for update
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);
create policy "CourseFAQ: delete teacher/admin" on course_faq for delete
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

-- COURSE SYLLABUS ****************************
create policy "CourseSyllabus: select all" on course_syllabus for select
using (true);

create policy "CourseSyllabus: insert teacher/admin" on course_syllabus for insert
with check (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "CourseSyllabus: update teacher/admin" on course_syllabus for update
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "CourseSyllabus: delete teacher/admin" on course_syllabus for delete
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

-- COURSE REVIEWS ******************************
create policy "CourseReviews: select students/teachers/admin" on course_reviews for select
using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'student') OR
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "CourseReviews: insert student/admin" 
on course_reviews for insert
with check (
    -- student writes their own review AND is enrolled
    (
        student_id = auth.uid()
        AND
        exists (
            select 1 
            from enrollments e
            where e.student_id = auth.uid()
            and e.course_id = course_id
        )
    )
    OR
    -- admin can write anything
    exists (
        select 1 from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
);

create policy "CourseReviews: update own/admin" 
on course_reviews for update
using (
    -- student can editonly their own review
    student_id = auth.uid()
    OR
    -- admin can modify anything
    exists (
        select 1 from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
);

create policy "CourseReviews: delete own/admin" 
on course_reviews for delete
using (
    -- student can delete only their own review
    student_id = auth.uid()
    OR
    -- admin can modify anything
    exists (
        select 1 from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
);

-- ENROLLMENTS *********************************
create policy "Enrollments: select student/teacher/admin" on enrollments for select
using (
    student_id = auth.uid() OR
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "Enrollments: insert student/admin" on enrollments for insert
with check (student_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Enrollments: update student/admin" on enrollments for update
using (student_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Enrollments: delete student/admin" on enrollments for delete
using (student_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));


-- LIVE SESSIONS *********************************
create policy "LiveSessions: select student/teacher/admin" on live_sessions for select
using (
    exists (select 1 from enrollments e where e.course_id = course_id and e.student_id = auth.uid()) OR
    exists (select 1 from profiles p join courses c on p.id = c.teacher_id where p.id = auth.uid() and c.id = course_id) OR
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "LiveSessions: insert teacher/admin" on live_sessions for insert
with check (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

create policy "LiveSessions: update teacher/admin" on live_sessions for update
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);
create policy "LiveSessions: delete teacher/admin" on live_sessions for delete
using (
    exists (select 1 from courses c join profiles p on c.teacher_id = p.id where c.id = course_id and (p.id = auth.uid() OR p.role = 'admin'))
);

-- NOTIFICATIONS **********************************
create policy "Notifications: select own/admin" on notifications for select
using (user_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Notifications: insert own/admin" on notifications for insert
with check (user_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Notifications: update own/admin" on notifications for update
using (user_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));

create policy "Notifications: delete own/admin" on notifications for delete
using (user_id = auth.uid() OR (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')));


-- CONTACT MESSAGES ***************************
create policy "ContactMessages: select admin" on contact_messages for select
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "ContactMessages: insert any" on contact_messages for insert
with check (true);

create policy "ContactMessages: update admin" on contact_messages for update
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "ContactMessages: delete admin" on contact_messages for delete
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));


-- CATEGORIES ***************************
create policy "Categories: select all authenticated"
on categories for select
using (auth.role() = 'authenticated');

create policy "Categories: insert admin only"
on categories for insert
with check (
    exists (
        select 1 
        from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
);

create policy "Categories: update admin only"
on categories for update
using (
    exists (
        select 1 
        from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
)
with check (
    exists (
        select 1 
        from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
);

create policy "Categories: delete admin only"
on categories for delete
using (
    exists (
        select 1 
        from profiles p 
        where p.id = auth.uid() 
        and p.role = 'admin'
    )
);
