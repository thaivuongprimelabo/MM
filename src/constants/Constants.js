import {
  StyleSheet,
} from 'react-native';


export const HEADER_BG_COLOR = '#1D2F3C';
export const HEADER_TINI_COLOR = '#ffffff';
export const YEAR = 'Năm';
export const MONTH = 'Tháng';
export const DAY = 'Ngày';
export const BUDGET = 'Định mức:';
export const USED = 'Sử dụng:';
export const REMAIN = 'Còn lại:';
export const WAITING_LOADING = 'Vui lòng chờ...';
export const NO_ACTION_FOUND = 'Chưa có hoạt động!';
export const ALERT_TITLE_INFO = 'Thông báo';
export const ALERT_TITLE_ERR = 'Lỗi';
export const ERR_REQUIRED = 'Vui lòng nhập {0}';
export const ERR_SELECT = 'Vui lòng chọn {0}';
export const ERR_NUMBER = 'Vui nhập {0} là giá trị số';
export const ERR_EMAIL = 'E-mail không hợp lệ';
export const ERR_LIMIT = 'Giá trị không hợp lệ';
export const LOGIN_FAILED = 'Tài khoản hoặc mật khẩu không chính xác';
export const SEND_DATA_SUCCESS = 'Đã gửi dữ liệu thành công.';
export const SYNC_DATA_SUCCESS = 'Đã đồng bộ dữ liệu thành công.';
export const REGISTER_DATA_SUCCESS = 'Đã đăng ký thành công.';
export const UPDATE_DATA_SUCCESS = 'Đã cập nhật thành công.';
export const NO_DATA_SEND = 'Không có dữ liệu cần gửi';
export const NO_DATA_SYNC = 'Không có dữ liệu mới từ máy chủ';

export const TXT_TITLE_ACTION_MODAL = 'Thông tin hoạt động';
export const TXT_TITLE_BUDGET_MODAL = 'Định mức tháng {0}';
export const TXT_NAME = 'Tên hoạt động';
export const TXT_TYPE_NAME = 'Loại hoạt động';
export const TXT_SELECT_TYPE = 'Chọn loại hoạt động';
export const TXT_SELECT_LOCATION = 'Chọn địa điểm';
export const TXT_ICON = 'Url icon';
export const TXT_PRICE = 'Chi phí';
export const TXT_TIME = 'Thời gian';
export const TXT_LOCATION = 'Địa điểm';
export const TXT_LATLONG = 'Tọa độ';
export const TXT_ADDRESS = 'Địa chỉ';
export const TXT_USERNAME = 'Tài khoản';
export const TXT_PASSWORD = 'Mật khẩu';
export const TXT_CONFIRM_DEL = 'Bạn chắc chắn xóa không?';
export const TXT_SYNC = 'Đang đồng bộ.Vui lòng chờ';
export const TXT_BUDGET = 'Định mức';

export const TXT_BUTTON_LOGIN = 'Đăng nhập';
export const TXT_BUTTON_ADD = 'Đăng ký';
export const TXT_BUTTON_UPDATE = 'Cập nhật';
export const TXT_BUTTON_OK = 'Đồng ý';
export const TXT_BUTTON_CANCEL = 'Bỏ qua';

export const TXT_SYNC_DATA = 'Đồng bộ dữ liệu';
export const TXT_SEND_DATA = 'Gửi dữ liệu';
export const TXT_LOGOUT = 'Đăng xuất';
export const TXT_CLOSE = 'Đóng';
export const TXT_ADD_ACTION = 'Đăng ký hoạt động';
export const TXT_ADD_TYPE = 'Đăng ký loại hoạt động';
export const TXT_ADD_LOCATION = 'Đăng ký địa điểm';
export const TXT_KEYWORD = 'Từ khóa tìm kiếm';

export const DEFAULT_USER= 'vuongluu';
export const DEFAULT_PASSWORD= '!23456Abc';
export const DEFAULT_SERVER= 'http://heart-warming-analy.000webhostapp.com/public';
export const DEFAULT_SYNC_URI= DEFAULT_SERVER + '/api/v1/sync';
export const DEFAULT_BACKUP_URI= DEFAULT_SERVER + '/api/v1/backup';
export const DEFAULT_AUTH_URI= DEFAULT_SERVER + '/api/v1/auth';
export const DEFAULT_SETTING_URI= DEFAULT_SERVER + '/api/v1/settings';
export const DEFAULT_BUDGET = '2500000';
export const DEFAULT_TIMEOUT = 1000;
export const DEFAULT_ICON = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
export const DEFAULT_LATLONG = '10.780028, 106.699040';
export const DEFAULT_FORMAT_DATETIME = 'YYYY-MM-DD HH:II:SS';
export const PREFIX_CLIENT_ID = 'C';
export const PREFIX_SERVER_ID = 'S';

export const IS_SYNC = 1;
export const NOT_SYNC = 0;

export const IS_DELETED = 1;
export const NOT_DELETED = 0;

export const TYPES_TBL= 'types';
export const ACTIONS_TBL= 'actions';
export const SETTINGS_TBL= 'settings';
export const LOCATIONS_TBL= 'locations';
export const USERS_TBL= 'users';

export const LOGIN_SCREEN = 'LoginScreen';
export const DAY_SCREEN = 'DayScreen';
export const MONTH_SCREEN = 'MonthScreen';
export const YEAR_SCREEN = 'YearScreen';
export const WELCOME_SCREEN = 'WelcomScreen';

export const SYNC_WAITING = 3;
export const SYNC_SUCCESS = 1;
export const SYNC_FAIL = 2;

export const LOADING_WAITING = 0;
export const LOADING_SUCCESS = 1;

export const MONDAY = 'Thứ hai';
export const TUESDAY = 'Thứ ba';
export const WEDNESDAY = 'Thứ tư';
export const THURSDAY = 'Thứ năm';
export const FRIDAY = 'Thứ sáu';
export const SATURDAY = 'Thứ bảy';
export const SUNDAY = 'Chủ Nhật';

export const STYLES = StyleSheet.create({
	borderInput : {
     paddingBottom:-5,
     borderBottomWidth:1, 
     borderBottomColor: '#888888'
  	}
});