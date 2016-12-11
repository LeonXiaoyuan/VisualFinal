#This is the function to dfownload all the Twitter data and dump all of them into JSON file and 
#MySQL tables
#There is a retry logic to sleep for 15 minutes and then retry if the request exceed Twitter's limit
import time
from time import gmtime, strftime
import datetime
import io
import json  
import twitter

import matplotlib.pylab as plt
import sys
from dateutil import parser
import datetime
import codecs
today = datetime.date.today()
format='%Y-%m-%d'
todayString= today.strftime(format)
def load_data(file_name):
    return json.loads(open(file_name).read(),'utf-8')

statuses = []
fileName='/Users/haiyanliang/Downloads/data.json'

print 'processing the twitter data....'
with codecs.open(fileName,'rU','utf-8') as f:
    for line in f:
        statuses.append(json.loads(line))


print 'Data retrieved from file'
print "Length of data file", len(statuses)
from guess_language import guess_language
from textblob import TextBlob
import math
def get_sentiment(status):
    try:
        text=status['text']
        lan=guess_language.guessLanguage(text)
            #only do the sentiment analysis for English comments
        if (lan=='en' or lan =='UNKNOWN'):
            print text 
            nlpblob = TextBlob(text)
            nlpblob.sentiment
            if nlpblob.sentiment.polarity is None:
                return 0
            elif math.isnan(nlpblob.sentiment.polarity):
                return 0
            else:
                return nlpblob.sentiment.polarity 
        else:
            return 0
    except Exception as e:
            return 0    
#start_time=time.time()
#from multiprocessing.dummy import Pool as ThreadPool 
#pool = ThreadPool(8)
#results = pool.map(get_sentiment, statuses)
#close the pool and wait for the work to finish 
#pool.close() 
#pool.join() 
#end_time = time.time()
#print 'total time to take to populate sentiment with Spark:' + str(end_time-start_time) + ' seconds' 
#save data to JSON
print 'starting to populate sentiment...'
start_time=time.time()

target = open('tweetsentiment.csv', 'w')
count=1
for status in statuses:
    score=get_sentiment(status)
    result=str(count)+','+ str(score)+'\n'
    print result
    target.write(result)
    count=count+1
target.close()
end_time = time.time()
print 'total time to take to populate sentiment:' + str(end_time-start_time) + ' seconds' 


   
