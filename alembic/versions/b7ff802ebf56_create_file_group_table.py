"""create file_group table

Revision ID: b7ff802ebf56
Revises: 
Create Date: 2017-12-11 19:20:37.272570

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import Session
from waxe_image.models.mymodel import File, Group


class MyFile(File):
    group_id = Column(Integer, ForeignKey('group.group_id'))


# revision identifiers, used by Alembic.
revision = 'b7ff802ebf56'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'file_group',
        sa.Column('file_id', sa.Integer, sa.ForeignKey('file.file_id')),
        sa.Column('group_id', sa.Integer, sa.ForeignKey('group.group_id'))
    )

    bind = op.get_bind()
    dbsession = Session(bind=bind)
    for f in dbsession.query(MyFile).all():
        group = dbsession.query(Group).get(f.group_id)
        f.groups.append(group)
        dbsession.add(f)
    dbsession.commit()

    op.drop_column('file', 'group_id')


def downgrade():
    op.drop_table('file_group')
