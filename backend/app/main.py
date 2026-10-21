# FILE: backend/app/main.py (BẢN ĐỒNG BỘ 100% VỚI FIGMA WEB W1-W8 & MOBILE 1-10)
import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db, DRIVER, DB_SERVER, DB_NAME

app = FastAPI(
    title="Smart Heritage API",
    description="API đồng bộ với Figma Web Admin (W1-W8) và Mobile App (1-10)",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/images", exist_ok=True)
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/api/health-db", tags=["0. System Health"])
def check_database_connection(db: Session = Depends(get_db)):
    row = db.execute(text("SELECT COUNT(*) AS total FROM dbo.Artifacts")).mappings().first()
    return {
        "status": "CONNECTED",
        "server": DB_SERVER,
        "database": DB_NAME,
        "driver": DRIVER,
        "total_artifacts": row["total"]
    }


# 1. API LẤY DANH SÁCH HIỆN VẬT (Khớp với W3 và Mobile Màn 4, 7)
@app.get("/api/artifacts", tags=["1. Artifacts (W3, W4, Mobile)"])
def get_artifacts(
    lang: str = Query("vi", description="Ngôn ngữ: vi hoặc en"),
    status: str = Query(None, description="Lọc trạng thái: PUBLISHED, DRAFT, HIDDEN"),
    search: str = Query(None, description="Tìm theo tên hoặc mã HV-001"),
    db: Session = Depends(get_db)
):
    sql = """
        SELECT 
            a.artifact_id,
            a.artifact_code,
            a.zone_name,
            CASE WHEN :lang = 'en' THEN a.name_en ELSE a.name_vi END AS name,
            CASE WHEN :lang = 'en' THEN a.summary_en ELSE a.summary_vi END AS summary,
            CASE WHEN :lang = 'en' THEN a.description_en ELSE a.description_vi END AS description,
            a.name_vi, a.name_en,
            a.summary_vi, a.summary_en,
            a.image_url,
            CASE WHEN :lang = 'en' THEN a.audio_en_url ELSE a.audio_vi_url END AS audio_url,
            a.audio_duration_sec,
            a.translated_langs,
            a.map_x, a.map_y,
            a.status,
            b.beacon_id,
            b.beacon_code,
            b.uuid, b.major, b.minor,
            b.trigger_distance,
            b.status AS beacon_status
        FROM dbo.Artifacts a
        LEFT JOIN dbo.Beacons b ON a.artifact_id = b.artifact_id
        WHERE 1=1
    """
    params = {"lang": lang}
    if status:
        sql += " AND a.status = :status"
        params["status"] = status
    if search:
        sql += " AND (a.name_vi LIKE :search OR a.name_en LIKE :search OR a.artifact_code LIKE :search)"
        params["search"] = f"%{search}%"

    rows = db.execute(text(sql), params).mappings().all()
    return [dict(r) for r in rows]


# 2. API TRA CỨU HIỆN VẬT TỪ SÓNG IBEACON (Khớp với Mobile Màn 5 Popup & Màn 6 Chi tiết)
@app.get("/api/beacons/resolve", tags=["2. iBeacon Engine (Mobile Màn 4, 5, 6)"])
def resolve_beacon_artifact(
    major: int = Query(..., description="Mã Major (VD: 1)"),
    minor: int = Query(..., description="Mã Minor (VD: 101)"),
    lang: str = Query("vi", description="Ngôn ngữ: vi hoặc en"),
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT TOP 1
            b.beacon_id,
            b.beacon_code,
            b.uuid, b.major, b.minor,
            b.trigger_distance,
            a.artifact_id,
            a.artifact_code,
            a.zone_name,
            CASE WHEN :lang = 'en' THEN a.name_en ELSE a.name_vi END AS name,
            CASE WHEN :lang = 'en' THEN a.summary_en ELSE a.summary_vi END AS summary,
            CASE WHEN :lang = 'en' THEN a.description_en ELSE a.description_vi END AS description,
            a.image_url,
            CASE WHEN :lang = 'en' THEN a.audio_en_url ELSE a.audio_vi_url END AS audio_url,
            a.audio_duration_sec,
            a.map_x, a.map_y
        FROM dbo.Beacons b
        INNER JOIN dbo.Artifacts a ON b.artifact_id = a.artifact_id
        WHERE b.major = :major AND b.minor = :minor 
          AND b.status IN ('ACTIVE', 'LOW_BATTERY') 
          AND a.status = 'PUBLISHED'
    """)
    row = db.execute(query, {"major": major, "minor": minor, "lang": lang}).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Không tìm thấy hiện vật gắn với iBeacon này.")

    db.execute(text("UPDATE dbo.Beacons SET last_seen_at = SYSDATETIME() WHERE beacon_id = :id"), {"id": row["beacon_id"]})
    db.commit()
    return dict(row)