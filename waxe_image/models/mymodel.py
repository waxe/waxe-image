from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
)

from sqlalchemy.orm import relationship

from .meta import Base


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
    abs_path = Column(String)
    web_path = Column(String)
    thumbnail_path = Column(String)

    files = relationship("File", backref="group", order_by="File.rel_path")


class File(Base):
    __tablename__ = 'file'
    file_id = Column(Integer, primary_key=True)
    abs_path = Column(String)
    rel_path = Column(String)
    thumbnail_path = Column(String)
    web_path = Column(String)

    creation_date = Column(DateTime, nullable=True)
    creation_author = Column(String, nullable=True)
    modification_date = Column(DateTime, nullable=True)
    modification_author = Column(String, nullable=True)

    md5sum = Column(String)

    group_id = Column(Integer, ForeignKey('group.group_id'))
    tags = relationship("Tag", secondary=file_tag_table, lazy='joined')


class Category(Base):
    __tablename__ = 'category'
    category_id = Column(Integer, primary_key=True)
    name = Column(String)
    tags = relationship("Tag", secondary=category_tag_table,
                        backref='categories')
