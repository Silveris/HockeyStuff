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
age = nhl_db['age_groups']
season = nhl_db['season_groups']


def call_by_pos(pos):
    data = []
    if pos.lower in ['rw', 'lw', 'c'] :
        call = player.find({'Pos' : {'$in' : ['RW', 'LW', 'C']}})

    elif pos.lower == 'forward':
        call = player.find({'Pos' : {'$ne': ['D']}})

    else:
        call = player.find({'Pos' : {'$in' : ['D']}})

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


def import_test():
    print('test')


