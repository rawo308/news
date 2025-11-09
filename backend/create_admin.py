"""
Utility to create or reset the default admin user in the SQLite DB.
Usage (from project root):
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  pip install -r backend/requirements.txt
  python backend/create_admin.py --username admin123 --password rawad123

The script will create the DB file (data/app.db) if missing and insert or update the admin row.
"""
import argparse
from backend.db import SessionLocal, engine, Base
from backend import models, auth

Base.metadata.create_all(bind=engine)

parser = argparse.ArgumentParser()
parser.add_argument('--username', default='admin123')
parser.add_argument('--password', default='rawad123')
args = parser.parse_args()

db = SessionLocal()
try:
    user = db.query(models.Admin).filter(models.Admin.username == args.username).first()
    if user:
        print(f"Updating password for {args.username}")
        user.password_hash = auth.get_password_hash(args.password)
    else:
        print(f"Creating admin {args.username}")
        user = models.Admin(username=args.username, password_hash=auth.get_password_hash(args.password))
        db.add(user)
    db.commit()
    print("Done.")
finally:
    db.close()
