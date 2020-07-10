# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
import pandas as pd
# import matplotlib.pyplot as plt
import pymongo


# %%
file = "../data/clean_hockey_data.csv"
nhl_df = pd.read_csv(file)


# %%
file2 = "../data/clean2020.csv"
nhl2020_df = pd.read_csv(file2)


# %%
nhl_df.head()


# %%
nhl2020_df.head()


# %%
# Pass in a df and a category, and the function will produce a new df grouped by that category and displaying 
# the average (or median) of each category
def groupby_avg(df, category):
    # Groups the df by a category
    temp_df = df.groupby([category])

    # Calculates the average stats for each group
    cat_group = temp_df[category].max()
    avg_goals = temp_df["G/60min"].mean()
    avg_assists = temp_df["A/60min"].mean()
    avg_pts = temp_df["PTS/60min"].mean()
    avg_hits = temp_df["HIT/60min"].mean()
    avg_blocks = temp_df["BLK/60min"].mean()
    avg_s = temp_df["S/60min"].mean()
    avg_shootperc = temp_df["S_percent"].mean()
    avg_pim = temp_df["PIM/60min"].mean()
    med_pim = temp_df["PIM/60min"].median()
    count = temp_df["Player"].count()

    # Builds the new df
    new_df = pd.DataFrame({
        category: cat_group,
        "Avg G/60min" : avg_goals,
        "Avg A/60min" : avg_assists,
        "Avg PTS/60min" : avg_pts,
        "Avg HIT/60min" : avg_hits,
        "Avg BLK/60min" : avg_blocks,
        "Avg S/60min" : avg_s,
        "Avg S_percent" : avg_shootperc,
        "Avg PIM/60min" : avg_pim,
        "Med PIM/60min" : med_pim,
        "Num Players" : count
    })
    return new_df


def groupby_median(df, category):
    temp_df = df.groupby([category])

    med_goals = temp_df["G/60min"].median()
    med_assists = temp_df["A/60min"].median()
    med_pts = temp_df["PTS/60min"].median()
    med_hits = temp_df["HIT/60min"].median()
    med_blocks = temp_df["BLK/60min"].median()
    med_shhotperc = temp_df["S_percent"].median()
    med_pim = temp_df["PIM/60min"].median()
    count = temp_df["Player"].count()


    new_df = pd.DataFrame({
        "Med G/60min" : med_goals,
        "Med A/60min" : med_assists,
        "Med PTS/60min" : med_pts,
        "Med HIT/60min" : med_hits,
        "Med BLK/60min" : med_blocks,
        "Med PIM/60min" : med_pim,
        "Num Players" : count
    })
    return new_df


# %%
# Df grouping by 2 categories
def multi_groupby_med(df, category1, category2):
    temp_df = df.groupby([category1, category2])

    med_goals = temp_df["G/60min"].median()
    med_assists = temp_df["A/60min"].median()
    med_pts = temp_df["PTS/60min"].median()
    med_hits = temp_df["HIT/60min"].median()
    med_blocks = temp_df["BLK/60min"].median()
    med_pim = temp_df["PIM/60min"].median()
    count = temp_df["Age"].count()

    new_df = pd.DataFrame({
        "Med G/60min" : med_goals,
        "Med A/60min" : med_assists,
        "Med PTS/60min" : med_pts,
        "Med HIT/60min" : med_hits,
        "Med BLK/60min" : med_blocks,
        "Med PIM/60min" : med_pim,
        "Num Players" : count
    })
    return new_df

def multi_groupby_avg(df, category1, category2):
    temp_df = df.groupby([category1, category2])

    avg_goals = temp_df["G/60min"].mean()
    avg_assists = temp_df["A/60min"].mean()
    avg_pts = temp_df["PTS/60min"].mean()
    avg_hits = temp_df["HIT/60min"].mean()
    avg_blocks = temp_df["BLK/60min"].mean()
    avg_pim = temp_df["PIM/60min"].mean()
    med_pim = temp_df["PIM/60min"].median()
    avg_s = temp_df["S/60min"].mean()
    count = temp_df["Age"].count()

    new_df = pd.DataFrame({
        "Avg G/60min" : avg_goals,
        "Avg A/60min" : avg_assists,
        "Avg PTS/60min" : avg_pts,
        "Avg HIT/60min" : avg_hits,
        "Avg BLK/60min" : avg_blocks,
        "Avg PIM/60min" : avg_pim,
        "Med PIM/60min" : med_pim,
        "Avg S/60min" : avg_s,
        "Avg Players" : count
    })
    return new_df


# %%
def seasonyears_filter(df, years_list):
    new_df = df[df.Season.isin(years_list)]
    return new_df

# Groups a df into 3 sets of 3 years
def three_year_group(df):
    years = [2004, 2005, 2006, 2009, 2010, 2011, 2016, 2017, 2018]
    new_df = df[df.Season.isin(years)]

    bins = [2004, 2006, 2011, 2018]
    groups = ["2004-06", "2009-11", "2016-18"]
    new_df["Season_group"] = pd.cut(new_df["Season"], bins, labels=groups, include_lowest=True)
    # grouped_df = multi_groupby_avg(new_df, "Age", "Season_group")
    return new_df

# %% [markdown]
# # dfs to be moved to database

# %%
complete_nhl_df = nhl_df
complete_nhl_df.head()


# %%
age_df = groupby_avg(complete_nhl_df, "Age")
age_df.head()


# %%
season_df = groupby_avg(complete_nhl_df, "Season")
season_df.head()


# %%
new_df = three_year_group(complete_nhl_df)
year_groups_df = multi_groupby_avg(new_df, "Age", "Season_group")
year_groups_df.reset_index(inplace=True)
year_groups_df.head()

# %% [markdown]
# # Loading into MongoDB

# %%
conn ='mongodb://localhost:27017' 


# %%
client = pymongo.MongoClient(conn)


# %%
client.drop_database('nhl_db')


# %%
db = client.nhl_db


# %%
collection = db.nhl_player_data


# %%
complete_nhl_df.columns


# %%
data = complete_nhl_df.to_dict(orient='records')
collection.insert_many(data)


# %%
# nhl_col=db.nhl_player_data.find()
# for col in nhl_col:
#     print(col)


# %%
collection2 = db.age_groups


# %%
data2 = age_df.to_dict(orient='records')
collection2.insert_many(data2)


# %%
collection3 = db.season_groups


# %%
data3 = season_df.to_dict(orient='records')
collection3.insert_many(data3)


# %%
collection4 = db.age_season_groups


# %%
data4 = year_groups_df.to_dict(orient='records')
collection4.insert_many(data4)


# %%
collection5 = db.nhl2020_players


# %%
data5 = nhl2020_df.to_dict(orient='records')
collection5.insert_many(data5)


# %%
print("Complete")


# %%


