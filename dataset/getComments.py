import urllib2 # make GET request
from bs4 import BeautifulSoup
import re # regex expression


def getRedditHome(subredit = "RoastMe"): 
	# TODO retry after 429 error
	html_doc = urllib2.urlopen("https://www.reddit.com/r/" + subredit).read()
	soup = BeautifulSoup(html_doc, 'html.parser')
	comment_links = soup.find_all('a', {'href': re.compile("^/r/RoastMe/comments/")})
	
	for link in comment_links:
		html_doc = urllib2.urlopen(link).read()
		print(html_doc.find('title'))

	return 42

# getRedditHome()

def getComments(post_id = "6yvfs5"):
	soup = None
	failed_count = 0

	while (failed_count < 5):
		try: 
			html_doc = urllib2.urlopen("https://www.reddit.com/r/RoastMe/"+post_id).read()
			soup = BeautifulSoup(html_doc, 'html.parser')
			failed_count += 10;
		except: 
			print("failed once")
			failed_count += 1
			if (failed_count >= 5): 
				return "failed too many times"

	comments = soup.find_all('div', {'class': 'entry unvoted'})
	for comment in comments[1:]: 
		div = comment.find('div', {'class': 'md'})
		print(comment)

		p = div.find('p')
		if (p == None): 
			print(p.contents)
		else: 
			print("failed!")
			print(comment)
			return

	return len(comments)

print(getComments())
