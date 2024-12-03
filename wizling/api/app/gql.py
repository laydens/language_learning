import strawberry
from typing import List
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Vocab  # Import your SQLAlchemy model

@strawberry.type
class VocabType:
    id: int
    expr: str
    reading: str
    level: str

@strawberry.type
class Query:
    @strawberry.field
    def vocab(self, level: str) -> List[VocabType]:
        db: Session = SessionLocal()
        vocab_items = db.query(Vocab).filter(Vocab.level == level).all()
        return [VocabType(id=item.id, expr=item.expr, reading=item.reading, level=item.level) for item in vocab_items]

schema = strawberry.federation.Schema(Query)