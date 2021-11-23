/* 

id|Employer|Org|Local|Industry|Bargaining Unit Size|Number of Locations|Address|City|State|Zip Code|Participants|Start Date|End Date|Worker Demands
    
*/

CREATE TABLE strikes (
    id integer, 
    employer text, 
    org text,
    local text,
    industry text,
    BUS text,
    locals text,
    street_adr text,
    city text,
    state text,
    zip text,
    participants text,
    start_date text,
    end_date text,
    demands text);

\copy strikes from 'strikes_data.csv' DELIMITER '|' CSV NULL AS 'NULL'