/* 


" id | Union name | aff_abbr | unit name | est date | members | mail first | mail last | build num | street adr | city | state | zip"
*/



CREATE TABLE unions (
    id integer,
    union_name text,
    abbr text,
    unit text,
    est_date text,
    members text,
    first_name text,
    last_name text,
    build_num text,
    strett_adr text,
    city text,
    region text,
    zip text);

\copy unions from 'union_data.csv' DELIMITER '|' CSV NULL AS 'NULL'