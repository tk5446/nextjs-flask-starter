from datetime import datetime
from bson import ObjectId

class Job:
    def __init__(self, title, created_at=None, _id=None):
        self._id = _id if _id else ObjectId()
        self.title = title
        self.created_at = created_at if created_at else datetime.utcnow()

    @staticmethod
    def from_dict(data):
        return Job(
            title=data.get('title'),
            created_at=data.get('created_at'),
            _id=data.get('_id')
        )

    def to_dict(self):
        return {
            '_id': str(self._id),
            'title': self.title,
            'created_at': self.created_at
        }
