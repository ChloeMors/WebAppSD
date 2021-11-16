import csv

in_file = open('cases_raw.csv')
out_file = open('cases_data.csv', 'w')
csv_reader = csv.reader(in_file, delimiter=',')
csv_writer = csv.writer(out_file, delimiter=',')
id = 0
first = True

for row in csv_reader:
    if first:
        first = False
        continue
    else:
        name = row[0]
        case_number = row[1]
        city = row[2]
        state = row[3]
        date_filed = row[4]
        region = row[5]
        status = row[6]
        date_closed = row[7]
        reason_closed = row[8]
        representative = row[11]
        data = [id,name,case_number,city,state,date_filed,date_closed,region,status,reason_closed,representative]
        csv_writer.writerow(data)
        id = id + 1

in_file.close()
out_file.close()
