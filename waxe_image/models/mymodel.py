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


class Tag(Base):
    __tablename__ = 'tag'
    tag_id = Column(Integer, primary_key=True)
    name = Column(String)


file_tag_table = Table(
    'file_tag',
    Base.metadata,
    Column('file_id', Integer, ForeignKey('file.file_id')),
    Column('tag_id', Integer, ForeignKey('tag.tag_id'))
)


category_tag_table = Table(
    'category_tag',
    Base.metadata,
    Column('category_id', Integer, ForeignKey('category.category_id')),
    Column('tag_id', Integer, ForeignKey('tag.tag_id'))
)


class Group(Base):
    __tablename__ = 'group'
    group_id = Column(Integer, primary_key=True)
    name = Column(String)
    files = relationship("File", backref="group")


class File(Base):
    __tablename__ = 'file'
    file_id = Column(Integer, primary_key=True)
    abs_path = Column(String)
    path = Column(String)
    webpath = Column(String)
    group_id = Column(Integer, ForeignKey('group.group_id'))
    tags = relationship("Tag", secondary=file_tag_table)


class Category(Base):
    __tablename__ = 'category'
    category_id = Column(Integer, primary_key=True)
    name = Column(String)
    tags = relationship("Tag", secondary=category_tag_table,
                        backref='categories')
