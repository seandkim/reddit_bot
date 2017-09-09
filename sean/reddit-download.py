import urllib2 # make GET request
from bs4 import BeautifulSoup
import re # regex expression
# soup = BeautifulSoup(html_doc, 'html.parser')



def getRedditHome(subredit): 
	# TODO retry after 429 error
	html_doc = urllib2.urlopen("https://www.reddit.com/r/RoastMe/").read()
	soup = BeautifulSoup(html_doc, 'html.parser')
	comment_links = soup.find_all('a', {'href': re.compile("^/r/RoastMe/comments/")})
	
	for link in comment_links:
		html_doc = urllib2.urlopen(link).read()
		print(html_doc.find('title'))

	return 42

getRedditHome("RoastMe")