# FILE: backend/app/schemas.py
from typing import Optional
from pydantic import BaseModel, Field


# =========================================================================
# M1: SCHEMAS CHO TÀI KHOẢN, ĐĂNG NHẬP & QUẢN LÝ NGƯỜI DÙNG (W1, W8, Mobile 1, 2, 3, 10)
# =========================================================================
class LoginRequest(BaseModel):
    email: str = Field(..., examples=["ngocanh@smartheritage.vn"])
    password: str = Field(..., examples=["123456"])


class RegisterRequest(BaseModel):
    full_name: str = Field(..., examples=["Nguyễn Văn B"])
    email: str = Field(..., examples=["nguyenvanb@email.com"])
    password: str = Field(..., min_length=6, examples=["123456"])
    preferred_lang: str = Field("vi", examples=["vi"])


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_lang: Optional[str] = Field(None, description="vi, en, ko, ja, zh")
    auto_beacon_notify: Optional[bool] = None
    avatar_url: Optional[str] = None


class AdminUserCreate(BaseModel):
    email: str
    password: str = "123456"
    full_name: str
    role: str = Field("CONTENT_MANAGER", description="ADMIN, CONTENT_MANAGER, VISITOR")
    preferred_lang: str = "vi"
    is_active: bool = True


class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    preferred_lang: Optional[str] = None
    is_active: Optional[bool] = None


# =========================================================================
# M2: SCHEMAS CHO QUẢN LÝ HIỆN VẬT & ĐA NGÔN NGỮ (W3, W4, Mobile 4, 5, 6, 7)
# =========================================================================
class ArtifactCreate(BaseModel):
    site_id: int = 1
    artifact_code: str = Field(..., examples=["HV-006"])
    zone_name: str = Field("Khu trưng bày Đông Sơn - Tầng 1")
    name_vi: str = Field(..., examples=["Mũi giáo đồng Đông Sơn"])
    name_en: str = Field(..., examples=["Dong Son Bronze Spearhead"])
    summary_vi: str = Field(..., examples=["Vũ khí bằng đồng thau tiêu biểu của cư dân Lạc Việt."])
    summary_en: str = Field(..., examples=["Typical bronze weapon of the ancient Lac Viet people."])
    description_vi: str
    description_en: str
    image_url: Optional[str] = "/static/images/hv_001.jpg"
    gallery_json: Optional[str] = None
    audio_vi_url: Optional[str] = "/static/audio/ngoc-lu-thuyet-minh-vi.mp3"
    audio_en_url: Optional[str] = "/static/audio/ngoc-lu-thuyet-minh-en.mp3"
    audio_duration_sec: int = 180
    translated_langs: str = "VI,EN"
    map_x: float = 350.0
    map_y: float = 250.0
    status: str = Field("PUBLISHED", description="PUBLISHED, DRAFT, HIDDEN")


class ArtifactUpdate(BaseModel):
    zone_name: Optional[str] = None
    name_vi: Optional[str] = None
    name_en: Optional[str] = None
    summary_vi: Optional[str] = None
    summary_en: Optional[str] = None
    description_vi: Optional[str] = None
    description_en: Optional[str] = None
    image_url: Optional[str] = None
    gallery_json: Optional[str] = None
    audio_vi_url: Optional[str] = None
    audio_en_url: Optional[str] = None
    audio_duration_sec: Optional[int] = None
    translated_langs: Optional[str] = None
    map_x: Optional[float] = None
    map_y: Optional[float] = None
    status: Optional[str] = None