from sqlalchemy import (
    Column,
    ForeignKey,
    Index,
    Integer,
    String,
    Table,
)

from sqlalchemy.orm import backref, relationship

from .meta import Base


class MyModel(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    value = Column(Integer)


Index('my_index', MyModel.name, unique=True, mysql_length=255)


class Category(Base):
    __tablename__ = 'category'
    category_id = Column(Integer, primary_key=True)
    name = Column(String)


class Tag(Base):
    __tablename__ = 'tag'
    tag_id = Column(Integer, primary_key=True)
    name = Column(String)
    category_id = Column(Integer, ForeignKey('category.category_id'))
    category = relationship("Category", backref=backref("tags"))


file_tag_table = Table(
    'file_tag',
    Base.metadata,
    Column('file_id', Integer, ForeignKey('file.file_id')),
    Column('tag_id', Integer, ForeignKey('tag.tag_id'))
)


class File(Base):
    __tablename__ = 'file'
    file_id = Column(Integer, primary_key=True)
    root_path = Column(String)
    path = Column(String)
    webpath = Column(String)
    tags = relationship("Tag", secondary=file_tag_table)
