# x always = to age
# y = Pts, Hits, Blocks, PIM (med) 
# filters - position, season
# position - Forward, Defender
# Season - all or specific

import pymongo

conn = 'mongodb://localhost:27017/'
client = pymongo.MongoClient(conn)
nhl_db = client['nhl_db']
player = nhl_db['nhl_player_data']
f_age = nhl_db['f_age_groups']
d_age = nhl_db['d_age_groups']
f_season = nhl_db['f_season_groups']
d_season = nhl_db['d_season_groups']
f_age_season = nhl_db['f_age_season_groups']
d_age_season = nhl_db['d_age_season_groups']
nhl2020 = nhl_db['nhl2020_players']


def call_by_pos(pos):
    data = []
    print(pos)
    if pos.lower() in ['rw', 'lw', 'c'] :
        call = player.find({'Pos' : {'$in' : ['RW', 'LW', 'C']}}, {'_id':False, 'FO_percent':False})

    elif pos.lower() == 'forward':
        call = player.find({'Pos' : {'$ne': ['D']}}, {'_id':False, 'FO_percent':False})

    else:
        print("D")
        call = player.find({'Pos' : {'$in' : ['D']}}, {'_id':False, 'FO_percent':False})

    for x in call:
        data.append(x)
    return data


def call_def_pos():
    data = []
    call = player.find({'Pos' : {'$in' : ['D']}})
    for x in call:
        data.append(x)
    return data


def call_forward_pos():
    data = []
    call = player.find({'Pos' : {'$in' : ['RW', 'LW', 'C']}})
    for x in call:
        data.append(x)
    return data

def call_2020():
    data = []
    # I didn't know how to include the two false statements without a conditional find
    call = nhl2020.find({'Pos' : {'$ne': ['Q']}}, {'_id':False, 'FO%':False})
    for x in call:
        data.append(x)
    return data

def call_age(pos):
    data = []
    if pos.lower() == "forward":
        call = f_age.find({'Age' : {'$ne': [100]}}, {'_id':False})
    else:
        call = d_age.find({'Age' : {'$ne': [100]}}, {'_id':False})
    for x in call:
        data.append(x)
    return data

def call_age_season(pos):
    data = []
    if pos.lower() == "forward":
        call = f_age_season.find({'Age' : {'$ne': [100]}}, {'_id':False})
    else:
        call = d_age_season.find({'Age' : {'$ne': [100]}}, {'_id':False})
    for x in call:
        data.append(x)
    return data


def import_test():
    print('test')


