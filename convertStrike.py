'''
A program to convert a string into a dataset
'''


'''
From
To
Employer
Labor Organization
Employer
Labor Organization
Local
Industry
Bargaining Unit Size
Number of Locations
Address
City
State
Zip Code
Strike or Protest
Approximate Number of Participants
Start Date
End Date
Duration Amount
Duration Unit
Authorized
Worker Demands
Source
Connected

'''


import csv

in_file = open('strikes.txt')
out_file = open('strikes_data.csv', 'w')
csv_reader = csv.reader(in_file, delimiter='|')
csv_writer = csv.writer(out_file, delimiter='|')
id = 0
strike = {"id":id, "Employer":"None", "Org":"None","Local":"None","Industry":"None","Bargaining Unit Size":"None","Number of Locations":"None","Address":"None","City":"None","State":"None","Zip Code":"None","Participants":"None","Start Date":"None","End Date":"None","Worker Demands":"None"}
first = True
stop = False

for row in csv_reader:
    if stop:
        continue
    if len(row) == 0 :
        #print(row)
        #print(" continued for len 0")
        continue
    row = row[0].split(":")
    if len(row) == 1 :
        #print(row)
        #print(" continued for len 1")
        continue
    for i in range(len(row)):
        row[i] = row[i].strip()
    if row[0] == "From":
        if first:
            first=False
        else:
            if strike["Employer"] == "General Electric":
                print(strike["Employer"] + " " + strike["Org"] + " " + strike["Local"] + " " + strike["Industry"] + " " + strike["Bargaining Unit Size"] + " " + strike["Number of Locations"] + " " + strike["Address"] + " " + strike["City"] + " " + strike["State"] + " " + strike["Zip Code"] + " " + strike["Participants"] + " " + strike["Start Date"] + " " + strike["End Date"] + " " + strike["Worker Demands"])
            # IN some cases, the following line doesn't actually write in all of these frields and I have no idea why. The above section prints them all succesffuly (gen elec is one that is continueously getting written impropperly)
            csv_writer.writerow([strike["id"], strike["Employer"], strike["Org"],strike["Local"],strike["Industry"],strike["Bargaining Unit Size"],strike["Number of Locations"],strike["Address"],strike["City"],strike["State"],strike["Zip Code"],strike["Participants"],strike["Start Date"],strike["End Date"],strike["Worker Demands"]])
            id += 1
            if id == 21:
                stop = True
        strike = {"id":id, "Employer":"None", "Org":"None","Local":"None","Industry":"None","Bargaining Unit Size":"None","Number of Locations":"None","Address":"None","City":"None","State":"None","Zip Code":"None","Participants":"None","Start Date":"None","End Date":"None","Worker Demands":"None"}
    elif row[0] == "To":
        continue
    elif row[0] == "Employer":
        #if row[1]:
        strike["Employer"] = row[1]
    elif row[0] == "Labor Organization":
        #if row[1]:
        strike["Org"] = row[1]
    elif row[0] == "Local":
        #f row[1]:
        strike["Local"] = row[1]
    elif row[0] == "Industry":
        #if row[1]:
        strike["Industry"] = row[1]
    elif row[0] == "Bargaining Unit Size":
        #if row[1]:
        strike["Bargaining Unit Size"] = row[1]
    elif row[0] == "Number of Locations":
        #if row[1]:
        strike["Number of Locations"] = row[1]
    elif row[0] == "Address":
        #if row[1]:
        strike["Address"] = row[1]
    elif row[0] == "City":
        #if row[1]:
        strike["City"] = row[1]
    elif row[0] == "State":
        #if row[1]:
        strike["State"] = row[1]
    elif row[0] == "Zip Code":
        #if row[1]:
        strike["Zip Code"] = row[1]
    elif row[0] == "Strike or Protest":
        continue
    elif row[0] == "Approximate Number of Participants":
        #if row[1]:
        strike["Participants"] = row[1]
    elif row[0] == "Start Date":
        #if row[1]:
        strike["Start Date"] = row[1]
    elif row[0] == "End Date":
        #if row[1]:
        strike["End Date"] = row[1]
    elif row[0] == "Duration Amount":
        continue
    elif row[0] == "Duration Unit":
        continue
    elif row[0] == "Authorized":
        continue
    elif row[0] == "Worker Demands":
        #if row[1]:
        strike["Worker Demands"] = row[1]
    elif row[0] == "Source":
        continue
    elif row[0] == "Connected":
        continue
    else:
        #print("Missed field" + row[0])
        pass
	

in_file.close()
out_file.close()