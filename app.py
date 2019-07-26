from flask import Flask, redirect, render_template, request, url_for, abort
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_compress import Compress

import decimal
import pandas as pd
import json
import geojson
import datetime
import os
import math
import timeit

########## CONFIG ###########

app = Flask(__name__)

# enable compression of response objects
Compress(app)

# WINDOWS setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost:5432/ChinaVis'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # change this before production!
db = SQLAlchemy(app)


# ROUTE_DAYSBACK = 730
# BORO_DAYSBACK = 30


########## SQLALCHEMY MODELS ###########

class GpsMetric(db.Model):
    __tablename__ = 'gps_metrics'

    # id, time, longitude, latitude
    order_id = db.Column(db.String(40), primary_key=True)
    time = db.Column(db.Integer, primary_key=True)
    longitude = db.Column(db.DECIMAL(15, 12))
    latitude = db.Column(db.DECIMAL(15, 13))

    def __init__(self, name, color):
        self.order_id = order_id
        self.time = time
        self.longitude = longitude
        self.latitude = latitude

    # def __repr__(self):
    # res = {"order_id": "", "time": 0, "longitude": 0, "latitude": 0}
    # res["order_id"] = self.order_id
    # res["time"] = self.time
    # res["longitude"] = self.longitude
    # res["latitude"] = self.latitude
    # return res
    # return 'Gps metric set: {}, {}:{}, {}'.format(
    #     self.order_id,
    #     self.time,
    #     self.longitude,
    #     self.latitude)

    def to_json(self):
        model_dict = dict(self.__dict__)
        del model_dict['_sa_instance_state']
        return model_dict


class OrderMetric(db.Model):
    __tablename__ = 'order_metrics'

    # id, time, longitude, latitude
    order_id = db.Column(db.String(40), primary_key=True)
    s_time = db.Column(db.Integer, primary_key=True)
    e_time = db.Column(db.Integer, primary_key=True)
    s_longitude = db.Column(db.Float(precision=50, scale=10))
    s_latitude = db.Column(db.Float(precision=50, scale=10))
    e_longitude = db.Column(db.Float(precision=50, scale=10))
    e_latitude = db.Column(db.Float(precision=50, scale=10))

    def __init__(self, name, color):
        self.order_id = order_id
        self.s_time = s_time
        self.e_time = e_time
        self.s_longitude = s_longitude
        self.s_latitude = s_latitude
        self.e_longitude = e_longitude
        self.e_latitude = e_latitude

    # def __repr__(self):
    #
    #     return '<Order metric set: {}, {}:{}, {}>'.format(
    #         self.order_id,
    #         self.s_time,
    #         self.e_time,
    #         self.s_longitude,
    #         self.s_latitude,
    #         self.e_longitude,
    #         self.e_latitude)

    def to_json(self):
        model_dict = dict(self.__dict__)
        del model_dict['_sa_instance_state']
        return model_dict


########## UTILITY ###########

# subclass standard python dict, implementing __missing__ to generate intermediate keys on the fly
# class InterDict(dict):
#     def __missing__(self, key):
#         self[key] = InterDict()
#         return self[key]


# def split_direc_stop(rds_index, col):
#     route, direc, stop = rds_index.split('_')
#     if col == 'direc':
#         return int(direc)
#     elif col == 'stop':
#         return int(stop)


def clean_nan(val):
    try:
        if math.isnan(val):
            return None
        elif val == 'null':
            return None
        else:
            return val
    except:
        return val


gps_metric_list = ['order_id', 'time', 'longitude', 'latitude']
order_metric_list = ['order_id', 's_time', 'e_time', 's_longitude', 's_latitude', 'e_longitude', 'e_latitude']


########## APP LOGIC ###########

def get_last_update():
    print('server: getting last update')
    # assumes that all metric tables are updated in synchro (so, just query one)
    print(OrderMetric.query.order_by(OrderMetric.s_time.desc()).first().s_time)
    print(GpsMetric.query.order_by(GpsMetric.time.desc()).first().time)


def get_data_by_hour_GPS():
    start_time = GpsMetric.query.order_by(GpsMetric.time).first().time
    end_time = GpsMetric.query.order_by(GpsMetric.time.desc()).first().time
    print(start_time)
    print(end_time)
    time = start_time
    count = 1

    while time < end_time:
        res = []
        df = GpsMetric.query.filter(GpsMetric.time.between(time, time + 3600)).all()
        for item in df:
            res.append(item.to_json())
        with open('data/{}.json'.format(count), 'w') as f:
            json.dump(res, f)
        time = time + 3600
        count = count + 1


def get_data_by_hour_ORDER():
    start_time = OrderMetric.query.order_by(OrderMetric.e_time).first().e_time
    end_time = OrderMetric.query.order_by(OrderMetric.e_time.desc()).first().e_time
    print(start_time)
    print(end_time)
    interval = 3600
    time = start_time
    count = 1

    while time < end_time:
        res = []
        df = OrderMetric.query.filter(OrderMetric.e_time.between(time, time + 3600)).all()
        for item in df:
            res.append(item.to_json())
        with open('data/ORDER_BY_HOUR_END/{}.json'.format(count), 'w') as f:
            json.dump(res, f)
        time = time + 3600
        count = count + 1


def get_frequency_by_coordinate():
    # s = GpsMetric.query.distinct(GpsMetric.longitude, GpsMetric.latitude).all()
    # s = OrderMetric.query.distinct(OrderMetric.s_longitude, OrderMetric.s_latitude).all()
    res = []
    # print(s)
    start_time = GpsMetric.query.order_by(GpsMetric.time).first().time
    end_time = GpsMetric.query.order_by(GpsMetric.time.desc()).first().time
    interval = 3600
    time = start_time
    count = 1

    while time < end_time:
        s = db.session.query(GpsMetric.latitude, GpsMetric.longitude, db.func.count().label("value")) \
            .filter(GpsMetric.time.between(time, time + 3600)) \
            .group_by(GpsMetric.longitude, GpsMetric.latitude).all()
        res = []
        for item in s:
            dic_list = dict(zip(item.keys(), item))
            temp = {'longitude': float(dic_list['longitude']), 'latitude': float(dic_list['latitude']),
                    'value': dic_list['value']}
            res.append(temp)
        with open('data/FREQUENCY_ORDER/top-10/frequency_{}.json'.format(count), 'w') as f:
            json.dump(res, f)
        time = time + 3600
        count = count + 1


def frequency_order_by_hour():
    # s = GpsMetric.query.distinct(GpsMetric.longitude, GpsMetric.latitude).all()
    # s = OrderMetric.query.distinct(OrderMetric.s_longitude, OrderMetric.s_latitude).all()
    res = []
    # print(s)
    start_time = GpsMetric.query.order_by(GpsMetric.time).first().time
    end_time = GpsMetric.query.order_by(GpsMetric.time.desc()).first().time
    time = start_time
    count = 1

    while time < end_time:
        s = db.session.query(GpsMetric.latitude, GpsMetric.longitude, db.func.count().label("value")) \
            .filter(GpsMetric.time.between(time, time + 3600)) \
            .group_by(GpsMetric.longitude, GpsMetric.latitude).order_by(db.desc('value')).all()
        cnt = 1
        res = []
        for item in s:
            if cnt > 10:
                break
            dic_list = dict(zip(item.keys(), item))
            _time = start_time
            _count = 1
            print("point{}".format(cnt))
            while _time < end_time:
                print("Hour{}".format(_count))
                print("Time{}-{}".format(_time, _time + 3600))
                k = GpsMetric.query \
                    .filter(GpsMetric.longitude == dic_list['longitude'] and GpsMetric.latitude == dic_list['latitude']) \
                    .filter(GpsMetric.time.between(_time, _time + 3600)).count()
                print(k)
                temp = {'longitude': float(dic_list['longitude']), 'latitude': float(dic_list['latitude']),
                        'location': 'Point{}'.format(cnt), 'hour': _count, 'value': k}
                res.append(temp)
                _time = _time + 3600
                _count = _count + 1
            cnt = cnt + 1
        with open('data/frequency_10_{}.json'.format(count), 'w') as f:
            json.dump(res, f)
            print("Successfully load frequency_10_{}".format(count))
        time = time + 3600
        count = count + 1


def traffic_by_hour():
    start_time = GpsMetric.query.order_by(GpsMetric.time).first().time
    end_time = GpsMetric.query.order_by(GpsMetric.time.desc()).first().time
    print(start_time)
    print(end_time)
    time = start_time
    hour_count = 1

    while time < end_time:
        res = []
        minute_count = 1
        while minute_count < 4:
            df = GpsMetric.query.filter(GpsMetric.time.between(time, time + 1200)).all()
            for item in df:
                dict_list = dict(zip(item.keys(), item))
                temp = {'longitude': float(dict_list['longitude']), 'latitude': float(dict_list['latitude']),
                        'order_id': dict_list['order_id'], 'time': dict_list['time'], 'hour': hour_count, 'minute': minute_count}
                res.append(temp)
            time = time + 1200
            minute_count = minute_count + 1
        with open('data/{}.json'.format(hour_count), 'w') as f:
            json.dump(res, f)
        hour_count = hour_count + 1


def co_occurrence_matrix():
    # s = GpsMetric.query.distinct(GpsMetric.longitude, GpsMetric.latitude).all()
    # s = OrderMetric.query.distinct(OrderMetric.s_longitude, OrderMetric.s_latitude).all()
    res = []
    # print(s)
    start_time = GpsMetric.query.order_by(GpsMetric.time).first().time
    end_time = GpsMetric.query.order_by(GpsMetric.time.desc()).first().time
    time = start_time
    count = 1

    set = {}
    while time < end_time:
        s = db.session.query(GpsMetric.latitude, GpsMetric.longitude, db.func.count().label("value")) \
            .filter(GpsMetric.time.between(time, time + 3600)) \
            .group_by(GpsMetric.longitude, GpsMetric.latitude).order_by(db.desc('value')).all()
        cnt = 1
        temp = []
        res = []
        for item in s:
            if cnt > 10:
                break
            dic_list = dict(zip(item.keys(), item))
            dic = {'longitude': dic_list['longitude'], 'latitude': dic_list['latitude']}
            temp.append(dic)
            cnt = cnt + 1
        set['hour{}'.format(count)] = temp
        time = time + 3600
        count = count + 1

    hour_count = 1
    while hour_count < 25:
        co_occ = []
        cnt1 = 1
        for item1 in set['hour{}'.format(hour_count)]:
            cnt2 = 1
            for item2 in set['hour{}'.format(hour_count)]:
                if cnt2 >= cnt1:
                    cnt12 = 0
                    for k in range(1, 24):
                        if item1 in set['hour{}'.format(k)] and item2 in set['hour{}'.format(k)]:
                            cnt12 = cnt12 + 1
                    temp1 = {'s1': 'point{}'.format(cnt1), 's2': 'point{}'.format(cnt2),
                             's1_longitude': float(item1['longitude']),
                             's1_latitude': float(item1['latitude']), 's2_longitude': float(item2['longitude']),
                             's2_latitude': float(item2['latitude']), 'value': cnt12}
                    co_occ.append(temp1)
                    if cnt1 != cnt2:
                        temp2 = {'s1': 'point{}'.format(cnt2), 's2': 'point{}'.format(cnt1),
                                 's1_longitude': float(item2['longitude']),
                                 's1_latitude': float(item2['latitude']), 's2_longitude': float(item1['longitude']),
                                 's2_latitude': float(item1['latitude']), 'value': cnt12}
                        co_occ.append(temp2)
                cnt2 = cnt2 + 1
            cnt1 = cnt1 + 1
        with open('data/co_occurrence_{}.json'.format(hour_count), 'w') as f:
            json.dump(co_occ, f)
            print("Successfully load co_occurrence_{}".format(hour_count))
        hour_count = hour_count + 1


########## FLASK ROUTES ###########
# standard template route
@app.route('/')
def dashboard():
    return render_template('heatmap.html')


if __name__ == '__main__':
    # app.debug = True
    # app.run()
    #frequency_order_by_hour()
    co_occurrence_matrix()
