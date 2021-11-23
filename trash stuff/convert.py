
# 0 Union name
# 1 Abbrev 
# 2
# 3
'''
Union name , 

0 UNION_NAME| yes
1 AFF_ABBR|  yes
2 F_NUM| ?
3 FYE| ?
4 UNIT_NAME| yes
5 EST_DATE| yes 
6 TERM_DATE|?
7 SHORTAGE| 
8 MAXIMUM_BOND| 
9 PD_COVERED_FROM|
10 PD_COVERED_TO|
11 CONSTITUTION_BYLAW|
12 TERMINATE|
13 TTL_ASSETS|
14 SUBSIDIARY|
15 DESIQ_PRE|
16 DESIG_NUM|
17 DESIG_SUF|
18 DESIG_NAME|
19 TTL_LIABILITIES|
20 TTL_RECEIPTS|
21 TTL_DISBURSEMENTS|
22 MEMBERS| yes 
23 REGISTER_DATE|
24 AMENDED|
25 HARDSHIP|
26 HAS_TRUST|
27 PAC_FUNDS|
28 OUTSIDE_AUDIT|
29 HAS_PROPERTY_CHANGE|
30 ASSETS_PLEDGED|
31 CONTINGENT|
32 NEXT_ELECTION|
33 HAS_LIQUIDATED_LIABILITIES|
34 HAS_EXTENDED_LOAN_CREDIT|
35 HAS_LIQUIDATED_RECEIVABLES|
36 HAS_SUBSIDIARY|
37 NUM_ATTACHMENTS|
38 RPT_ID|
39 YR_COVERED|
40 AMENDMENT|
41 RECEIVE_DATE|
42 ADR_ID| 
43 ADDRESS_TYPE| 
44 MAIL_FIRSTNAME| yes 
45 MAIL_LASTNAME| yes 
46 BUILD_NUM| yes 
47 STREET_ADR| yes
48 CITY| yes
49 STATE| yes
50 ZIP| yes
51 VOICE| 
52 MOD_DATE|
53 MOD_ID|
54 RECORD_KEPT|
55 FORM_TYPE

'''

" id | Union name | aff_abbr | unit name | est date | members | mail first | mail last | build num | street adr | city | state | zip"
" id 0 1 4 5 22 44 45 46 47 48 49 50 "

import csv

in_file = open('lm_data_data_2021.txt')
out_file = open('union_data.csv', 'w')
csv_reader = csv.reader(in_file, delimiter='|')
csv_writer = csv.writer(out_file, delimiter='|')
id = 0
first = True
for row in csv_reader:
	if first:
		first = False
	else:
		number_of_members = row[22]
		if number_of_members == '':
			number_of_members = 0
		csv_writer.writerow([id, row[0], row[1], row[4], row[5], number_of_members, row[44], row[45], row[46], row[47], row[48], row[49], row[50]])
		id = id + 1

in_file.close()
out_file.close()



