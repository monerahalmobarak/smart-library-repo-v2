from langchain_experimental.llms.ollama_functions import OllamaFunctions
from pydantic import BaseModel
from fastapi import FastAPI
import uvicorn
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import SQLChatMessageHistory
from app.Database_task.database_vocter import embeddings
from langchain_chroma import Chroma
from app.Books.books_info import get_books_by_genre, get_books_by_date

# Define the prompt template
template = """You are Monerah, an AI-powered librarian. Your job is to provide detailed, insightful, and personalized book recommendations based on user questions and their reading history. Use the provided context from our extensive library database to support your recommendations.

Question: {question}

Context: {context}

Provide a thorough and engaging answer, including why you recommend the book(s) and what makes them relevant to the user's interests or query. If no relevant documents are found, inform the user that no relevant documents are available in the database.
"""
prompt = ChatPromptTemplate.from_template(template)

# Initialize the Ollama model
model = OllamaFunctions(model="llama3.1")

app = FastAPI()

def query_and_respond(question):
    db3 = Chroma(persist_directory="/Users/malmobarak001/All_Vscode/myprojectforbooks/Smart-Library/db", embedding_function=embeddings)
    docs = db3.similarity_search(question)
    if docs:
        context = docs[0]['page_content']
        combined_prompt = prompt.invoke({"question": f"{question}\nContext: {context}"})
        response = model.invoke({"question": combined_prompt})
        return response
    else:
        return "No relevant documents found."


def Book_Categories(query) -> str:
    """Request for all books in a specific genre"""
    return get_books_by_genre(query)

def Book_Date(query) -> str:
    """Request for all books in a specific publish year"""
    return get_books_by_date(query)

class Find_Book_Categories(BaseModel):
    genre: str

class Find_Book_Date(BaseModel):
    year: int

tools = [Find_Book_Date, Find_Book_Categories]

llm_with_tools = model.bind_tools(tools)

query = "all books in history"

print(llm_with_tools.invoke(query))
