from fastapi import FastAPI, Depends
from strawberry.fastapi import GraphQLRouter
from gql import schema  
from models import Vocab, Meaning 
from database import SessionLocal, Base  
from models import Vocab, Meaning  # Import your ORM models
from sqlalchemy.orm import Session

app = FastAPI()

# GraphQL endpoint
app.include_router(GraphQLRouter(schema), prefix="/gql")
# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/vocab/{level}")
def read_vocab(level: str, db: Session = Depends(get_db)):
    return db.query(Vocab).filter(Vocab.level == level).all()

@app.get("/vocab/{vocab_id}/meanings")
def read_meanings(vocab_id: int, db: Session = Depends(get_db)):
    return db.query(Meaning).filter(Meaning.entity_id == vocab_id).all()

# Only run this line once, typically during the initial setup or migration
# Base.metadata.create_all(bind=engine)  # Uncomment if you need to create tables initially
