import urllib2 # make GET request
from bs4 import BeautifulSoup
# soup = BeautifulSoup(html_doc, 'html.parser')

def getRedditHome(subredit): 
	html_doc = urllib2.urlopen("https://www.reddit.com/r/RoastMe/").read()
	soup = BeautifulSoup(html_doc, 'html.parser')
	res = soup.find_all('a', {})
	print(res)

	return 42



getRedditHome("RoastMe")