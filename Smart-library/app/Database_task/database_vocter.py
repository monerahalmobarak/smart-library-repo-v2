# import os
# from dotenv import load_dotenv
# from langchain_community.vectorstores import Chroma as CommunityChroma
# from langchain_openai import OpenAIEmbeddings
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from app.common.config.database import get_db
# from app.Books.books_info import fetch_all_books
# from langchain_chroma import Chroma

# # Set the OpenAI API key directly
# openai_api_key=os.environ["OPENAI_API_KEY"] = "sk-proj-wfXW64JKdCMXoyIfcJ7KT3BlbkFJbuZU5KVw67xZXgnUvC1B"

# # Check if the OpenAI API key is set
# if not openai_api_key:
#     raise ValueError("OpenAI API key not set.")
# try:
#     # Initialize OpenAI embeddings
#     embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

#     # Initialize Community Chroma vector store
#     persist_directory = 'db'
#     vectorstore = CommunityChroma(embedding_function=embeddings, persist_directory=persist_directory)

#     retriever = vectorstore.as_retriever()
#     print("Community Chroma vector store and retriever initialized successfully.")
# except Exception as e:
#     print(f"An error occurred with Community Chroma: {e}")

# # Initialize OpenAI embeddings model for LangchainChroma
# embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")  # Adjust the model name if necessary

# # Fetch data from PostgreSQL
# db = next(get_db())
# books = fetch_all_books(db)

# # Prepare documents for LangchainChroma
# # Prepare documents for LangchainChroma
# documents = []
# for book in books:
#     content = (f"Book title: {book.title}. "
#                f"Book subtitle: {book.subtitle}. "
#                f"Book authors: {book.authors}. "
#                f"Book categories: {book.categories}. "
#                f"Book description: {book.description}. "
#                f"Published year: {book.published_year}. "
#                f"Average rating: {book.average_rating}. "
#                f"Number of pages: {book.num_pages}. "
#                f"Ratings count: {book.ratings_count}.")
#     documents.append({
#         "page_content": content,
#         "metadata": {
#             "isbn13": book.isbn13,
#             "isbn10": book.isbn10,
#             "title": book.title,
#             "subtitle": book.subtitle,
#             "authors": book.authors,
#             "categories": book.categories,
#             "thumbnail": book.thumbnail,
#             "description": book.description,
#             "published_year": book.published_year,
#             "average_rating": book.average_rating,
#             "num_pages": book.num_pages,
#             "ratings_count": book.ratings_count
#         }
#     })

# # Split documents into chunks using RecursiveCharacterTextSplitter
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=0)

# # Create a list of document texts and their metadata separately
# texts = [doc['page_content'] for doc in documents]
# metadatas = [doc['metadata'] for doc in documents]

# # Split texts using the text_splitter
# split_texts = []
# split_metadatas = []

# for text, metadata in zip(texts, metadatas):
#     chunks = text_splitter.split_text(text)
#     split_texts.extend(chunks)
#     split_metadatas.extend([metadata] * len(chunks))

# #Initialize Langchain Chroma and create embeddings
# persist_directory = 'db'
# vectordb = Chroma.from_texts(texts=split_texts, embedding=embeddings, metadatas=split_metadatas, persist_directory=persist_directory)

# # Reload the database from disk
# vectordb = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
# print("Langchain Chroma database created and persisted successfully.")




import os
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma as CommunityChroma
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.common.config.database import get_db
from app.Books.books_info import fetch_all_books
from langchain_chroma import Chroma

# Set the OpenAI API key directly
openai_api_key = os.environ["OPENAI_API_KEY"] = "sk-proj-wfXW64JKdCMXoyIfcJ7KT3BlbkFJbuZU5KVw67xZXgnUvC1B"

# Check if the OpenAI API key is set
if not openai_api_key:
    raise ValueError("OpenAI API key not set.")
try:
    # Initialize OpenAI embeddings
    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

    # Initialize Community Chroma vector store
    persist_directory = 'db'
    vectorstore = CommunityChroma(embedding_function=embeddings, persist_directory=persist_directory)

    retriever = vectorstore.as_retriever()
    print("Community Chroma vector store and retriever initialized successfully.")
except Exception as e:
    print(f"An error occurred with Community Chroma: {e}")

# Initialize OpenAI embeddings model for LangchainChroma
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")  # Adjust the model name if necessary

# Fetch data from PostgreSQL
db = next(get_db())
books = fetch_all_books(db)

# Prepare documents for LangchainChroma
documents = []
for book in books:
    content = (f"Book title: {book.title}. "
               f"Book subtitle: {book.subtitle}. "
               f"Book authors: {book.authors}. "
               f"Book categories: {book.categories}. "
               f"Book description: {book.description}. "
               f"Published year: {book.published_year}. "
               f"Average rating: {book.average_rating}. "
               f"Number of pages: {book.num_pages}. "
               f"Ratings count: {book.ratings_count}.")
    documents.append({
        "page_content": content,
        "metadata": {
            "isbn13": book.isbn13,
            "isbn10": book.isbn10,
            "title": book.title,
            "subtitle": book.subtitle,
            "authors": book.authors,
            "categories": book.categories,
            "thumbnail": book.thumbnail,
            "description": book.description,
            "published_year": book.published_year,
            "average_rating": book.average_rating,
            "num_pages": book.num_pages,
            "ratings_count": book.ratings_count
        }
    })

# Split documents into chunks using RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=0)

# Create a list of document texts and their metadata separately
texts = [doc['page_content'] for doc in documents]
metadatas = [doc['metadata'] for doc in documents]

# Split texts using the text_splitter
split_texts = []
split_metadatas = []

for text, metadata in zip(texts, metadatas):
    chunks = text_splitter.split_text(text)
    split_texts.extend(chunks)
    split_metadatas.extend([metadata] * len(chunks))

# Initialize Langchain Chroma and create embeddings
persist_directory = 'db'
vectordb = Chroma(embedding_function=embeddings, persist_directory=persist_directory)

# Add data to the vector store in smaller chunks
for i in range(0, len(split_texts), 1000):
    batch_texts = split_texts[i:i + 1000]
    batch_metadatas = split_metadatas[i:i + 1000]
    vectordb.add_texts(texts=batch_texts, metadatas=batch_metadatas)

# Reload the database from disk
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
print("Langchain Chroma database created and persisted successfully.")
