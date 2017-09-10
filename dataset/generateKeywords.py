import argparse

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import six
import csv
import pandas as pd
import json

# get keywords, get from Google
def entities_text(text):
    """Detects entities in the text."""
    client = language.LanguageServiceClient()

    if isinstance(text, six.binary_type):
        text = text.decode('utf-8')

    # Instantiates a plain text document.
    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects entities in the document. You can also analyze HTML with:
    #   document.type == enums.Document.Type.HTML
    entities = client.analyze_entities(document).entities

    # entity types from enums.Entity.Type
    entity_type = ('UNKNOWN', 'PERSON', 'LOCATION', 'ORGANIZATION',
                   'EVENT', 'WORK_OF_ART', 'CONSUMER_GOOD', 'OTHER')

    result = []
    for entity in entities:
        result.append(entity.name)
    return result


# print(entities_text("Jewish cultural studies student. Roast her!"))

def main(targetFile): 
    store = dict()
    tolerance = 10
    with open(targetFile, 'r') as csvfile:
        rawFile = csv.reader(csvfile)
        i = 0
        for row in rawFile: 
            # if i > 2: break;
            post, commentID = "".join(i for i in row[3] if ord(i)<128), row[5]
            if post == "title": continue
            try: 
                keys = entities_text(post)
            except: 
                print("BROKE!!")
                if (tolerance > 0):
                    tolerance -= 1
                    continue
                else: 
                    break
            for key in keys:
                if key not in store: 
                    store[key] = []
                store[key].append(commentID)
                print(commentID)
            i += 1

    print("Done storing")
    result = []
    for key in store: 
        # temp = json.dumps()
        # print(type(temp))
        result.append({"keyword": key, "commentID": store[key]})

    return result

def writeFile(path, targetFile):
    content = main(targetFile)
    print("Done generating content")
    with open(path, "wt") as f:
        json.dump(content, f)

        # f.write(str(content))

# I need this to work 
try:
    writeFile("foo.txt", 'final/2m-3810-8000.csv')
except:
    try: 
        writeFile("bar.txt", 'final/2m-8001-15000.csv')
    except:
        try: 
            writeFile("woohoo.txt", 'final/15000-25000.csv')
        except:
            print("out of luck I guess!")
