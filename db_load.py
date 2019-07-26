import sys
import pandas as pd
from random import random
from sqlalchemy import create_engine
from app import db

def convert_null(val):
    if val == 'null':
        return None
    else:
        return val


def prod_mode(gps_infile, order_infile, engine):
    # READ DATA FROM CSV FILE, AND WRITE TO POSTGRES
    print('loading data files...')

    gps_df = pd.read_csv(gps_infile)
    gps_df = gps_df.applymap(convert_null)

    order_df = pd.read_csv(order_infile)
    order_df = order_df.applymap(convert_null)

    order_df.to_sql('order_metrics', engine, if_exists='append', index=False)
    gps_df.to_sql('gps_metrics', engine, if_exists='append', index=False)

    print('successfully loaded data.')


def main():
    if len(sys.argv) < 1:
        print("""
          USAGE:
          python db_load.py <mac, windows, compute> <reset, append> <gps_infile> <order_infile>
          eg)   python db_load.py reset data/oct_data_stop.csv data/oct_data_route.csv
          """)
        sys.exit()

    # ESTABLISH SQLALCHEMY CONNECTION

    engine = create_engine('postgresql://postgres:root@localhost:5432/ChinaVis')


    # CLEAR EXISTING TABLES AND REBUILD SCHEMA
    is_reset = sys.argv[1]
    if is_reset == 'reset':
        print('resetting database...')
        db.drop_all()
        db.create_all()
    else:
        print('appending new data...')

    gps_cols = ['order_id', 'time', 'longitude', 'latitude']

    order_cols = ['order_id', 's_time', 'e_time', 's_longitude', 's_latitude', 'e_longitude', 'e_latitude']

    gps_infile = sys.argv[2]
    order_infile = sys.argv[3]
    # prod_mode(gps_infile, order_infile, engine)



if __name__ == '__main__':
    main()
