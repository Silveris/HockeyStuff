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

def call_by_pos():
    data = []
    
    return data