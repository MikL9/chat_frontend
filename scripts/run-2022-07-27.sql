# в апи лог не может вставиться токен
alter table api_log modify auth_token text null;
alter table messages alter column attachment set default 0;



