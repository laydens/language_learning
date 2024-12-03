from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Vocab(Base):
    __tablename__ = 'vocab'
    id = Column(Integer, primary_key=True, index=True)
    expr = Column(String(50))
    level = Column(String(10))

class Meaning(Base):
    __tablename__ = 'meanings'
    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, ForeignKey('vocab.id'))
    meaning = Column(String)
