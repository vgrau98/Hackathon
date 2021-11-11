#!/usr/bin/env python
# coding: utf-8

# In[254]:


"""
This small scipt is an example of how xe can predict the water copnsumption to optimize the growth rate 
of plants or crops. 
We do not have enough data to train a relevant model, and to find the most relevant features. We keep it simple
for the moment and just give an overview of what we can do with all the data collected. The future works will focus
on data engineering, and model optimization. (here we are using a tree regressor but other model can be tested,
like lightGBM for example).
Furthemore, other data can be collected like soil PH, meteo (other than rainfall) etc...

"""




import pandas as pd 
path = '/home/grau/ISS/Hackaton-/'
from datetime import datetime
import sys


# In[255]:


data=pd.read_csv(path+"test.csv", sep=" ")
#data.to_csv(path+"test2.csv", index=None)
#data=pd.read_csv(path+"test2.csv", sep=" ")
imposed_growth_rate=sys.argv[1]
imposed_growth_rate=float(imposed_growth_rate)


# In[256]:


(data)


# ## 

# In[257]:


data['date']=pd.to_datetime(data['date'])
data


# In[260]:


#We want to predict the growth rate of the plants/crops with accuracy to manage the water consumption. So for a water
#consumption and certain external caracteristics we need to know the growth rate (hours by hours)


#Growth rate computing in %
data['var_height']=data['height(cm)'].diff()/data['height(cm)'].shift(1)*100

#These are the caracteristics (water provide) at time t that allow a certain growth rate observed at time t+1
data['var_height']=data['var_height'].shift(-1) 
#We cann't evaluate the last row because we don't know the next plant height, so we don't know the influence
#of the different parameters
data.at[data.shape[0]-1, 'var_height'] = imposed_growth_rate


# In[261]:


data


# In[252]:


from sklearn.model_selection import train_test_split

Y=data['water_consumption(L)']
X=data[['rainfall_24h(mm)', 'rainfall_5d(mm)', 'luminosity(lux)', 'humidity(%)', 'height(cm)', 'var_height', 'period']]


# In[240]:


X


# In[241]:


Y


# In[242]:


X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=1/5)


# In[243]:


X_train


# In[244]:


y_train


# In[245]:


from sklearn.tree import DecisionTreeRegressor


# In[204]:


treeRegressor=DecisionTreeRegressor(criterion="mse")


# In[205]:


#learning
tR_fit=treeRegressor.fit(X_train, y_train)


# In[206]:


score=tR_fit.score(X_test,y_test)


# In[207]:


water_prediction=tR_fit.predict(X_test)


# In[208]:


X_test


# In[209]:


y_test


# In[210]:


print(water_prediction[water_prediction.size-1])


# In[ ]:




