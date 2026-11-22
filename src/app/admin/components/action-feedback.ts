/** Thông báo lỗi cho thao tác trong trang admin, dựa trên `code` mà API/server action trả về. */
export function actionErrorMessage(code?: string): string {
  switch (code) {
    case "DEMO_READ_ONLY":
      return "Tài khoản demo chỉ có quyền xem — thao tác này đã bị chặn.";
    case "UNAUTHORIZED":
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    case "FORBIDDEN":
      return "Bạn không có quyền thực hiện thao tác này.";
    case "NOT_FOUND":
      return "Không tìm thấy dữ liệu — có thể đã bị xoá trước đó.";
    case "INVALID_INPUT":
      return "Dữ liệu không hợp lệ.";
    default:
      return "Đã có lỗi xảy ra, vui lòng thử lại.";
  }
}

/** Đọc `code` từ response lỗi của API (JSON `{ error, code }`). */
export async function responseErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { code?: string };
    return actionErrorMessage(data.code);
  } catch {
    return actionErrorMessage();
  }
}
