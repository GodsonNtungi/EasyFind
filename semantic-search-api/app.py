from flask import Flask, jsonify, request
import cohere
import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.http import models

app = Flask(__name__)
load_dotenv()
api_key = os.getenv("API_KEY")
qdrant_key = os.getenv("Qdrant_key")

client = cohere.Client(api_key)

qdrant_client = QdrantClient(
    host="f80a3b17-cb06-4cbd-8242-712bf20ff2f8.us-east-1-0.aws.cloud.qdrant.io",
    api_key=qdrant_key
)


def search_data(text: str, options=[], limit=50):
    # Convert text query into vector
    vector = client.embed(texts=[text], model="multilingual-22-12")
    should_filter = [models.FieldCondition(key="category", match=models.MatchValue(value=option)) for option in options]
    search_result = qdrant_client.search(
        collection_name="inventory2",
        query_vector=vector.embeddings[0],
        query_filter=models.Filter(
            should=should_filter),
        limit=limit,
    )

    payloads = [hit.payload for hit in search_result]
    return payloads


@app.route('/', methods=["GET"])
def search():
    search_keyword = request.args.get('search')
    limit = request.args.get('limit')
    category = request.args.get('categories')

    if category is not None:
        options = [category for category in category.split(",")]
    else:
        options = []

    if limit is not None:
        payload = search_data(text=search_keyword, options=options, limit=int(limit))
    else:
        payload = search_data(text=search_keyword, options=options)

    return jsonify(payload)


if __name__ == '__main__':
    app.run()
