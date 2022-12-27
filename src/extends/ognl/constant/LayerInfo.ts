export const LAYERNAME = {
    CONTAINER: 'CONTAINER',
    POST: 'POST',
    TAG: 'TAG',
    CATEGORY: 'CATEGORY',
    DOCUMENT: 'VANBAN'
};
export const BASEDATAURL = '/root/vdms/tangthu/data/ognl';
export const LAYERDATARURL = {
    POST: `${BASEDATAURL}/post`,
    TAG: `${BASEDATAURL}/tag`,
    CATEGORY: `${BASEDATAURL}/category`,
    DOCUMENT: `${BASEDATAURL}/document`,
    MEDIA: `${BASEDATAURL}/media`,
    VIDEO: `${BASEDATAURL}/media/video`,
    IMAGE: `${BASEDATAURL}/media/image`,
    CONFIGURATION: `${BASEDATAURL}/portalconfiguration`,
};
export const RETURNFIELDS = {
    TAG: ['slug'],
    POST: ['noiDung', 'trangThai', 'visibility', 'tags', 'categories', 'featured_image', 'allow_comments'],
    CATEGORY: ['slug', 'parents_category'],
    DOCUMENT: ["file", "loaiVanBan", "donVi", "soHieu", "trichYeu", "hieuLucTuNgay", "hieuLucDenNgay"]
};
export const POST_VISIBILITY = {
    PUBLIC: 0,
    PRIVATE: 1
};
export const POST_STATUS = {
    DRAFT: 0,
    PUBLISH: 1
};

export const POST_TYPE = ["Bài viết", "Thư viện ảnh/video"]

export const DOCUMENT_TYPE = [
    "Báo cáo",
    "Kế hoạch",
    "Đề cương",
    "Lịch tiếp dân",
    "Góp ý văn bản dự thảo",
    "Tiếp nhận xử lý phản ánh, kiến nghị",
    "Thông báo kết quả giải quyết KNTC",
    "Tài liệu các cuộc họp",
    "Văn bản chỉ đạo",
    "Nghị quyết",
    "Giấy mời",
    "Thông báo",
    "Quyết định",
]

export const ISSUING_ORGANIZATION = [
    'Văn phòng',
    'Đoàn ĐBQH',
    'HĐND'
]