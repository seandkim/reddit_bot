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

def main(): 
    store = dict()
    with open('final/2m-shorten.csv', 'r') as csvfile:
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
                continue;
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

def writeFile(path):
    content = main()
    print("Done generating content")
    with open(path, "wt") as f:
        json.dump(content, f)

        # f.write(str(content))

writeFile("foo.txt")