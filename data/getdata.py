#coding=GBK
import csv
import os
import sys
'''
def create_csv():
    path = "aa.csv"
    with open(path,'wb') as f:
        csv_write = csv.writer(f)
        csv_head = ["good","bad"]
        csv_write.writerow(csv_head)

def read_csv():
    path = "aa.csv"
    with open(path,"rb") as f:
        csv_read = csv.reader(f)
        for line in csv_read:
            print line
'''
from astropy.wcs.docstrings import row
wpath = 'gps-20180501-WGS84-header.csv'
rpath = 'gps-20180501-WGS84.csv'

with open(wpath,'w',newline='') as fw:
    csv_write = csv.writer(fw)
    dictname = ['id', 'time', 'longitude', 'latitude']
    csv_write.writerow(dictname)
    with open(rpath,"r") as fr:
        csv_read = csv.reader(fr)
        #rows = [row for row in csv_read]
        i = 0
        for row in csv_read:
            #print(row)
            if i == 80000:
                break
            i += 1
            #print(row)
            tmp = row
            csv_write.writerow(tmp)
        '''
        for i, rows in enumerate(csv_read):
            if i == 80000:
                break
            csv_write.writerow(rows)
        '''
            

    