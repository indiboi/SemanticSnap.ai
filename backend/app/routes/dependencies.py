from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import security, verify_access_token
from app.db.database import get_db
from app.models.user import User

def get_current_user(
    credentials=Depends(security),
    db: Session = Depends(get_db)
):
    user_id = verify_access_token(credentials)

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user