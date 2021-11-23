
CREATE TABLE cases (
    id integer,
    case_name text,
    case_number text,
    city text,
    territory text,
    date_filed text,
    date_closed text,
    region text,
    current_status text,
    reason_closed text,
    representative text);

\copy cases from 'cases_data.csv' DELIMITER ',' CSV NULL AS 'NULL'